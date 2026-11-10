# PRD.md — Survei Akademik App (Sudo Squad)

## 1. Latar Belakang
Tim Sudo Squad sedang mengembangkan produk kompetisi berupa aplikasi pengelola jadwal & informasi akademik mahasiswa. Untuk memvalidasi masalah dan kebutuhan fitur, tim perlu mengumpulkan data dari mahasiswa (lokal & internasional) melalui survei terstruktur. Google Form dinilai kurang representatif secara visual untuk kebutuhan dokumentasi/pitch lomba, sehingga dibangun web app survei custom.

## 2. Tujuan
- Mengumpulkan data kuantitatif & kualitatif untuk mengisi bagian analisis masalah di proposal lomba (angka `[X]` di proposal diisi dari hasil Q4, Q6, Q8).
- Mengumpulkan bukti minat/validasi solusi (Q11–Q13) untuk bagian "demand" proposal.
- Menyediakan cara mudah bagi tim untuk meninjau & mengekspor data tanpa bergantung pada Google Sheets/Form bawaan.

## 3. Target Pengguna
| Peran | Deskripsi |
|---|---|
| Responden | Mahasiswa Unsyiah (lokal & internasional), diakses via link publik, isi via HP |
| Admin (tim Sudo Squad) | 1 reviewer, akses dashboard via password tunggal, review & export data |

## 4. User Stories
1. Sebagai responden, saya ingin mengisi survei dengan cepat (~3 menit) di HP saya, dengan tampilan yang jelas dan tidak membingungkan.
2. Sebagai responden internasional, saya ingin bisa membaca semua pertanyaan dalam Bahasa Inggris tanpa perlu translate manual.
3. Sebagai admin, saya ingin login sederhana (cukup password) untuk melihat seluruh hasil survei.
4. Sebagai admin, saya ingin melihat ringkasan cepat (rata-rata, distribusi) tanpa harus membuka tiap respons satu per satu.
5. Sebagai admin, saya ingin mengekspor data ke CSV untuk diolah lebih lanjut (mis. untuk proposal/laporan).

## 5. Scope MVP
**In scope:**
- Form survei publik lengkap (15 pertanyaan, 3 bagian, bilingual).
- Penyimpanan data ke PostgreSQL melalui Prisma ORM dan Neon.
- Halaman admin login (password tunggal).
- Dashboard admin: list respons, filter dasar, ringkasan agregat, export CSV.
- PWA installable, mobile-responsive.

**Out of scope (next iteration):**
- Multi-admin dengan role berbeda.
- Autentikasi berbasis akun (saat ini cukup 1 password shared).
- Analitik visual lanjutan (grafik interaktif, dsb — cukup angka/ringkasan sederhana di MVP).
- Reminder/notifikasi untuk responden uji coba 2 minggu (Q13/Q15 hanya mengumpulkan kontak, follow-up dilakukan manual oleh tim).

## 6. Metrik Keberhasilan
- Jumlah respons terkumpul dalam periode penyebaran survei (target ditentukan tim, mis. ≥100 respons).
- Form dapat diakses & diisi tanpa error di perangkat mobile (uji di minimal 2 ukuran layar berbeda).
- Admin dapat login & mengekspor data dalam < 5 klik.

## 7. Risiko & Asumsi
- **Asumsi**: deployment menyediakan Node.js dan environment variables untuk Next.js, Prisma, dan koneksi PostgreSQL Neon.
- **Risiko keamanan**: data responden mencakup alamat email; akses baca hasil harus tetap dibatasi ke sesi admin di server.
- **Risiko data**: tanpa validasi server-side yang kuat, ada kemungkinan submission ganda/spam — mitigasi minimal: disable tombol submit setelah diklik, tidak ada mitigasi anti-bot di MVP.

## 8. Timeline (indikatif)
| Tahap | Output |
|---|---|
| Dokumentasi (saat ini) | SPEC, ARCHITECTURE, DESIGN, PRD, prompt chat.z.ai |
| Generate & deploy awal | Form publik + admin dashboard dasar via chat.z.ai |
| QA manual | Uji isi form di HP, uji login admin, uji export CSV |
| Penyebaran survei | Link dibagikan ke mahasiswa Unsyiah |
| Analisis hasil | Data diambil dari dashboard/export untuk mengisi proposal |
