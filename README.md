# TOTP Generator

Generator kode OTP (One-Time Password) berbasis TOTP (Time-based One-Time Password) yang berjalan sepenuhnya di sisi client (browser) — tanpa server/backend. Cocok dipakai sebagai alat bantu 2FA manual, testing, atau debugging integrasi autentikasi dua faktor.

## Fitur

- Generate token OTP dari secret key berformat base-32
- Bisa atur jumlah digit token dan periode refresh (detik)
- Tombol **Generate Token** — token baru hanya berlaku setelah tombol ditekan (atau tekan Enter di salah satu field), jadi tidak ada token "nyangkut" ke secret key lama
- Countdown & progress bar menunjukkan sisa waktu sebelum token berganti
- Tombol salin token ke clipboard
- Validasi otomatis: menampilkan pesan error jika secret key tidak valid
- Dark mode (aktif secara default) dengan toggle manual
- Responsif — layout 2 kolom di desktop (header kiri, form & hasil di kanan), stack di mobile
- Mendukung pengisian otomatis lewat URL:
  - Hash: `index.html#/SECRETKEY`
  - Query string: `index.html?key=SECRETKEY&digits=6&period=30&algorithm=SHA1`

## Struktur File

```
totpghosterx/
├── index.html              # Tampilan & markup halaman
└── js/
    ├── app.js               # Logic utama (Vue 3): generate token, validasi, timer
    └── assets/
        ├── vue-3.4.20.global.prod.js
        ├── otpauth-9.1.3.min.js       # Library perhitungan TOTP/HOTP
        └── clipboard-2.0.6.min.js     # Copy-to-clipboard
```

## Cara Pakai

1. Buka `index.html` langsung di browser, atau upload ke hosting/static site apa pun (tidak butuh server backend).
2. Masukkan **Secret Key** (format base-32), atur **Jumlah Digit** dan **Periode** jika perlu.
3. Klik **Generate Token** (atau tekan Enter).
4. Token akan otomatis diperbarui sesuai periode yang diatur. Klik ikon salin untuk menyalin token ke clipboard.

### Lewat Link Langsung

```
https://otp.adjibayu.biz.id/#/JBSWY3DPEHPK3PXP
```

atau

```
https://otp.adjibayu.biz.id/?key=JBSWY3DPEHPK3PXP&digits=6&period=30
```

Secret key akan otomatis terisi dan token langsung ter-generate saat halaman dimuat.

## Teknologi

- [Vue 3](https://vuejs.org/) — reaktivitas UI
- [otpauth](https://github.com/hectorm/otpauth) — perhitungan TOTP/HOTP sesuai RFC 6238
- [clipboard.js](https://clipboardjs.com/) — salin ke clipboard
- Font Awesome 6 — ikon
- Google Fonts (Inter & Poppins)

## Kredit

- Logic TOTP awal oleh [Dan Hersam](https://danhersam.com) — [Original Source](https://github.com/jaden/totp-generator)
- Tampilan & penyesuaian oleh [Muhamad Adji Bayu Saputra](https://adjibayu.biz.id)

## Catatan Keamanan

Alat ini memproses secret key sepenuhnya di browser (client-side) dan tidak mengirim data ke server mana pun. Namun tetap disarankan untuk tidak membagikan link yang sudah berisi secret key (`#/...` atau `?key=...`) ke pihak yang tidak berkepentingan, karena siapa pun yang memegang link tersebut bisa men-generate token OTP yang sama.
