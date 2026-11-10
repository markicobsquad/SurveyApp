# Arsitektur — Survei Akademik Sudo Squad

## Stack

- Next.js App Router, React, TypeScript, dan Tailwind CSS.
- Prisma ORM 6 dengan PostgreSQL di Neon.
- PWA memakai manifest dan service worker manual.
- UI survei dan dashboard berada di `src/features/`; komponen presentasi bersama di `src/components/`.

## MVC dan alur request

```text
src/app/                 Routing Next.js dan adapter HTTP tipis
src/controllers/         Validasi request, aturan alur, dan response HTTP
src/models/              Query Prisma dan pemetaan data survei
src/features/            View React untuk survei dan admin
src/lib/                 Database client, sesi admin, opsi, dan tipe bersama
prisma/                  Model PostgreSQL dan migration SQL
```

- `POST /api/survey` memvalidasi payload di controller, menyimpan melalui model Prisma, lalu mengembalikan ID respons.
- `GET /api/survey` hanya mengembalikan data setelah controller memverifikasi cookie sesi admin bertanda tangan.
- `POST /api/admin/session` memeriksa password di server dan menerbitkan cookie `HttpOnly`, `SameSite=Strict`, berumur delapan jam.
- `DELETE /api/admin/session` menghapus cookie sesi.
- Halaman `/`, `/admin`, dan `/admin/dashboard` memakai routing bawaan Next.js. Komponen `features` adalah view; komponen tidak mengakses Prisma.

## Database Neon

Prisma menggunakan koneksi pooler Neon saat aplikasi berjalan dan koneksi langsung untuk operasi CLI/migrasi:

```env
DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
DIRECT_URL="postgresql://.../neondb?sslmode=require"
```

Isi kedua variabel tersebut di `.env` lokal dan environment deployment. Jangan commit `.env`. `prisma migrate dev` membuat migration saat pengembangan; gunakan `prisma migrate deploy` untuk menerapkan migration di deployment. Jangan memakai `db push --accept-data-loss` untuk database ini.

Migration awal ada di `prisma/migrations/20261110000000_init/`. Migration ini membuat tabel kosong di Neon. Data di `db/custom.db` adalah database SQLite lama dan tidak diimpor otomatis; file itu dipertahankan sebagai sumber data lama.

## Variabel rahasia admin

```env
ADMIN_PASSWORD="password-kuat"
ADMIN_SESSION_SECRET="secret-acak-minimal-32-byte"
```

Keduanya hanya dibaca di server. Atur nilainya di `.env` lokal dan environment deployment. Tanpa konfigurasi ini login admin dinonaktifkan dan endpoint data tetap tertutup.
