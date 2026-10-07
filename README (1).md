# PasarKu - Website Jual Beli Online

Website marketplace sederhana untuk jual beli barang, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Fitur

- Daftar produk dalam bentuk grid
- Pencarian barang
- Filter kategori dan pengurutan harga
- Form "Jual Barang" untuk menambah produk baru
- Keranjang belanja (tambah, kurangi, hapus, total harga)
- Data tersimpan di browser (localStorage), tetap ada setelah refresh
- Tampilan responsif (HP dan desktop)

## Struktur File

```
index.html   -> struktur halaman
style.css    -> tampilan dan layout
script.js    -> logika (produk, keranjang, form)
README.md    -> dokumentasi ini
```

## Cara Menjalankan

1. Simpan keempat file dalam satu folder.
2. Buka `index.html` dengan browser (klik dua kali).
3. Selesai. Tidak perlu instalasi apa pun.

## Batasan (Penting)

- Data hanya tersimpan di browser masing-masing pengguna. Penjual A tidak bisa dilihat pembeli B.
- Checkout hanya simulasi. Tidak ada pembayaran, akun, atau pengiriman nyata.
- Belum ada login, upload gambar (hanya URL), atau database.

## Pengembangan Lanjutan

1. Backend dan database (Node.js + Express + MongoDB/PostgreSQL, atau Firebase/Supabase) agar data dibagikan antar pengguna.
2. Sistem login dan akun penjual.
3. Upload gambar ke penyimpanan cloud.
4. Integrasi pembayaran (Midtrans, Xendit).
5. Validasi dan sanitasi sisi server (validasi di sisi browser saja tidak cukup untuk produksi).

## Lisensi

Bebas dipakai untuk belajar.
