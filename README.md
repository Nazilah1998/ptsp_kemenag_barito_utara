# PTSP Kemenag Barito Utara

Starter project Next.js untuk sistem PTSP Kemenag Barito Utara.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Turbopack
- Supabase Auth, Database, Storage

## Cara menjalankan

1. Install dependency

```bash
npm install
```

2. Salin file environment

```bash
cp .env.example .env.local
```

3. Isi nilai Supabase pada `.env.local`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Buat project Supabase lalu jalankan SQL di file berikut secara berurutan

- `supabase/schema.sql`
- `supabase/seed.sql`

5. Siapkan bucket storage

Sebenarnya bucket sudah dibuat di `schema.sql`. Pastikan bucket berikut tersedia:

- `request-documents`
- `generated-documents`

6. Jalankan aplikasi

```bash
npm run dev
```

7. Buka browser

```text
http://localhost:3000
```

## Akun admin

Project ini tidak membuat user auth admin secara otomatis karena tabel auth.users dikelola Supabase Auth.

Langkah cepat:

1. Register user biasa dari aplikasi
2. Buka SQL Editor Supabase
3. Jalankan query ini

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin-anda@example.com';
```

Setelah itu login ulang. User tersebut akan masuk sebagai admin.

## Fitur utama

- Registrasi, login, logout, reset password
- Dashboard pemohon
- Dashboard admin
- CRUD layanan
- CRUD item layanan
- CRUD field form dinamis
- CRUD persyaratan dokumen
- Pengajuan layanan berbasis database
- Upload dokumen
- Workflow revisi, tolak, terima
- Riwayat aktivitas
- Download dokumen hasil

## Catatan penting

- Upload dokumen memakai `SUPABASE_SERVICE_ROLE_KEY` di sisi server.
- Route admin dicek dari role pada tabel `profiles`.
- Middleware dipakai untuk refresh session Supabase berbasis cookie.
- Semua query penting memakai validasi sisi server.

## Struktur ringkas

```text
app/
components/
lib/
supabase/
```

## Saran deployment

- Frontend: Vercel
- Database/Auth/Storage: Supabase
- Simpan environment variable di platform deployment
- Aktifkan email auth yang sesuai kebutuhan
- Tambahkan domain resmi instansi pada redirect URL Supabase
