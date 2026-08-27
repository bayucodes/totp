function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

function parseURLSearch(search) {
  const queryParams = search.substr(1).split('&').reduce(function (q, query) {
    const chunks = query.split('=');
    const key = chunks[0];
    let value = decodeURIComponent(chunks[1]);
    value = isNaN(Number(value)) ? value : Number(value);
    return (q[key] = value, q);
  }, {});

  return queryParams;
}

const app = Vue.createApp({
  data() {
    return {
      secret_key: 'JBSWY3DPEHPK3PXP',
      digits: 6,
      period: 30,
      algorithm: 'SHA1',
      updatingIn: 30,
      token: null,
      clipboardButton: null,
      errorMsg: '',
      hasGenerated: false,
      isGenerating: false,
      justUpdated: false,
      // nilai yang benar-benar dipakai untuk generate token
      // (baru berubah saat tombol "Generate" diklik)
      active_secret: 'JBSWY3DPEHPK3PXP',
      active_digits: 6,
      active_period: 30,
    };
  },

  mounted: function () {
    this.getKeyFromUrl();
    this.getQueryParameters();
    this.generate();

    this.clipboardButton = new ClipboardJS('#clipboard-button');
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: this.algorithm,
        digits: this.active_digits,
        period: this.active_period,
        secret: OTPAuth.Secret.fromBase32(stripSpaces(this.active_secret)),
      });
    }
  },

  methods: {
    generate: function () {
      this.errorMsg = '';

      if (this.isGenerating) {
        return;
      }

      const secret = this.secret_key;
      const digits = parseInt(this.digits) || 6;
      const period = parseInt(this.period) || 30;

      // validasi dulu sebelum dikunci, biar tidak menimpa token lama dengan error
      try {
        const test = new OTPAuth.TOTP({
          algorithm: this.algorithm,
          digits: digits,
          period: period,
          secret: OTPAuth.Secret.fromBase32(stripSpaces(secret)),
        });
        test.generate();
      } catch (e) {
        this.errorMsg = 'Secret key tidak valid. Pastikan formatnya base-32 (huruf A-Z dan angka 2-7).';
        return;
      }

      this.isGenerating = true;

      // jeda sebentar biar animasi loading kelihatan, sekaligus penanda proses "generate"
      setTimeout(() => {
        this.active_secret = secret;
        this.active_digits = digits;
        this.active_period = period;
        this.hasGenerated = true;

        // update address bar jadi https://domain/#/SECRETKEY tanpa reload halaman
        try {
          const newHash = '#/' + encodeURIComponent(secret);
          if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
          }
        } catch (e) {
          // abaikan kalau browser tidak izinkan (mis. dibuka dari file://)
        }

        if (this.intervalHandle) {
          clearInterval(this.intervalHandle);
        }

        this.update();
        this.intervalHandle = setInterval(this.update, 1000);

        this.isGenerating = false;
        this.justUpdated = true;
        setTimeout(() => { this.justUpdated = false; }, 1000);
      }, 350);
    },

    update: function () {
      try {
        this.updatingIn = this.active_period - (getCurrentSeconds() % this.active_period);
        this.token = truncateTo(this.totp.generate(), this.active_digits);
      } catch (e) {
        this.errorMsg = 'Terjadi kesalahan saat generate token.';
        clearInterval(this.intervalHandle);
      }
    },

    getKeyFromUrl: function () {
      const key = document.location.hash.replace(/[#\/]+/, '');

      if (key.length > 0) {
        this.secret_key = key;
      }
    },
    getQueryParameters: function () {
      const queryParams = parseURLSearch(window.location.search);

      if (queryParams.key) {
        this.secret_key = queryParams.key;
      }

      if (queryParams.digits) {
        this.digits = queryParams.digits;
      }

      if (queryParams.period) {
        this.period = queryParams.period;
      }

      if (queryParams.algorithm) {
        this.algorithm = queryParams.algorithm;
      }
    }
  }
});

app.mount('#app');
