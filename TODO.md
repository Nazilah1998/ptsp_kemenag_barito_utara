# TODO Revamp PTSP Kemenag Barito Utara

## Plan Disetujui

- [x] Konfirmasi rencana revamp total UI + pertahankan fitur CRUD Admin.

## Eksekusi

- [x] 1. Update fondasi tema global (`app/globals.css`) sesuai referensi (biru-emas, nuansa portal instansi).
- [x] 2. Update layout utama (`app/layout.tsx`) dengan struktur header-content-footer yang rapi.
- [x] 3. Revamp header publik (`components/site-header.tsx`) ala portal PTSP.
- [x] 4. Revamp beranda (`app/page.tsx`) sesuai referensi: hero, CTA, track layanan, daftar layanan, FAQ ringkas.
- [x] 5. Revamp halaman layanan (`app/layanan/page.tsx`) menjadi katalog layanan modern.
- [x] 6. Revamp detail layanan (`app/layanan/[slug]/page.tsx`) dengan info layanan + persyaratan + CTA pengajuan.
- [x] 7. Revamp halaman login (`app/login/page.tsx`) gaya split-card seperti referensi.
- [x] 8. Revamp halaman register (`app/register/page.tsx`) konsisten dengan login.
- [x] 9. Revamp layout admin (`app/admin/layout.tsx`) agar tampilan panel lebih clean.
- [x] 10. Revamp sidebar dashboard/admin (`components/dashboard/sidebar.tsx`) dengan navigasi lebih jelas.
- [ ] 11. Penyeragaman UI halaman admin CRUD utama (tanpa ubah logic server actions).
- [ ] 12. Revamp UI registrasi pemohon (field disederhanakan + modern + icon password).
- [ ] 13. Update logic registrasi pemohon (tanpa verifikasi, cek duplikasi nomor WA).
- [ ] 14. Update registrasi petugas (tanpa verifikasi email, menunggu aktivasi super_admin).
- [ ] 15. Uji build/lint untuk validasi.
- [ ] 16. Finishing pass (rapikan spacing, warna, dan hierarchy visual).
- [ ] 17. UI harmonization pass untuk `/track`, `/login`, `/kontak`, `/layanan`, `/register`, `/register/petugas`.

## Catatan Teknis

- Tidak mengubah core logic server actions di `lib/actions/admin.ts`.
- Fokus perubahan pada tampilan, struktur UI, dan pengalaman penggunaan.
