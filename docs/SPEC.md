# SPEC.md — Survei Akademik App (Sudo Squad)

## 1. Ringkasan
Aplikasi fullstack PWA (mobile-first) untuk mengumpulkan data survei "Pengelolaan Jadwal & Informasi Akademik Mahasiswa" dari khalayak umum, dengan halaman admin terpisah (password-protected) untuk meninjau hasil. Dibangun & deploy via chat.z.ai (no post-deploy file editing).

## 2. Halaman

### 2.1 Halaman Publik — `/`
- Form survei bilingual (ID/EN), toggle bahasa di header (default: Indonesia).
- 3 bagian form sesuai struktur berikut (lihat detail field di §3).
- Progress indicator (misal: "Bagian 1 dari 3" + progress bar).
- Validasi inline per field, required vs optional ditandai jelas.
- Submit → tampilkan halaman "Terima kasih" + opsi isi lagi (reset form).
- Disclaimer singkat (durasi ~3 menit, data hanya untuk lomba) ditampilkan di atas form.

### 2.2 Halaman Admin — `/admin`
- `/admin` → login page (input password saja, tanpa username).
- Password disediakan lewat `ADMIN_PASSWORD` pada environment server, bukan di bundle browser.
- Setelah login sukses → redirect ke `/admin/dashboard`; server menerbitkan cookie `HttpOnly`, `SameSite=Strict` yang kedaluwarsa setelah 8 jam. `sessionStorage` hanya menjadi petunjuk navigasi di browser, bukan mekanisme otorisasi.
- Salah password → pesan error, tanpa lockout/rate-limit (skala kecil, tidak perlu).

### 2.3 Dashboard Admin — `/admin/dashboard`
- Tabel/list seluruh respons survei, terbaru di atas.
- Filter: status mahasiswa (Indonesia/internasional), angkatan, program studi (search).
- Klik 1 respons → detail view (semua jawaban ditampilkan rapi per bagian).
- Ringkasan agregat di atas tabel: total respons, rata-rata skala Likert (Q8, Q9, Q12), distribusi pilihan ganda (Q4, Q13) — bisa berupa angka/bar sederhana.
- Export ke CSV (tombol "Export CSV").
- Tombol Logout.

## 3. Struktur Data Form

| # | Field | Tipe | Wajib | Opsi |
|---|---|---|---|---|
| 1 | status_mahasiswa | radio | ya | Indonesia / Internasional |
| 2 | angkatan | select | ya | 2022–2026 |
| 3 | program_studi | text | ya | - |
| 4 | jumlah_grup_wa | radio | ya | 1–5, 6–10, 11–20, >20 |
| 5 | sumber_info | checkbox (multi) | ya | 6 opsi + "Lainnya" (text follow-up jika dipilih) |
| 6 | kejadian_semester_ini | matrix radio (5 baris × 4 kolom) | ya | Tidak pernah / 1x / 2–3x / >3x |
| 7 | penyebab_utama | checkbox (multi) | ya | 6 opsi + "Lainnya" (text) |
| 8 | wifi_hambatan | scale 1–5 | ya | 1=Tidak pernah, 5=Sangat sering |
| 9 | sulit_tempat_belajar | scale 1–5 | ya | 1=Sangat mudah, 5=Sangat sulit |
| 10 | sulit_bahasa_internasional | scale 1–5 | tidak (opsional) | hanya relevan utk status internasional, tapi tetap tampil untuk semua |
| 11 | kebermanfaatan_fitur | matrix scale (7 baris × 5 kolom) | ya | 1=Tidak membantu, 5=Sangat membantu |
| 12 | manfaat_keseluruhan | scale 1–5 | ya | - |
| 13 | bersedia_uji_coba | radio | ya | Ya / Mungkin / Tidak |
| 14 | fitur_tambahan | textarea | tidak | - |
| 15 | kontak | text | tidak | email atau nomor WA |

Teks lengkap tiap pertanyaan (ID + EN) mengikuti dokumen asli yang dilampirkan user — gunakan sebagai sumber copy, jangan diringkas.

## 4. Non-Functional Requirements
- **Mobile-first PWA**: installable (manifest.json + service worker), responsive di semua ukuran layar (utamakan 360–430px width).
- **Bilingual**: toggle ID/EN real-time tanpa reload, semua label/placeholder/pesan error ikut berubah.
- **Custom UI**: semua komponen interaktif (dropdown, scrollbar, scale/rating selector, checkbox, radio) dibuat custom — tidak memakai elemen native browser look.
- **Icon**: Lucide React untuk semua ikon (bukan emoji/icon font lain).
- **Aksesibilitas dasar**: kontras warna cukup (dark theme), target tap area minimal 44×44px, label terhubung ke input.
- **Performa**: form tetap responsif di koneksi lambat (tidak ada dependency berat yang tidak perlu).

## 5. Out of Scope (MVP)
- Multi-admin / role management.
- Notifikasi email otomatis.
- Analytics lanjutan (hanya ringkasan dasar di dashboard).
- Edit/hapus respons oleh admin (read-only review untuk MVP, bisa ditambah nanti).
