# TODO: Perbaikan Tanggal di Komponen History

## Langkah-langkah yang perlu dilakukan:
- [x] Perbarui komponen `app/componen/Chistory/History.jsx` untuk menggunakan `item.tanggal_kembali` sebagai batas kembali, dan tampilkan tanggal kembali hanya jika status "dikembalikan".
- [x] Perbarui fungsi `updateStatusPeminjaman` di `app/lib/actions.js` untuk mengatur `tanggal_kembali = NOW()` saat status diubah ke "dikembalikan".
- [ ] Uji halaman history untuk memastikan tanggal ditampilkan dengan benar.
