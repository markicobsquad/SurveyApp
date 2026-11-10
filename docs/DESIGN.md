# DESIGN.md — Survei Akademik App (Sudo Squad)

## 1. Referensi Visual
Mengikuti gaya UI pada referensi gambar "Finance App — Zentra" (@uix.vikram): dark theme premium dengan gradient biru radial di latar, kartu rounded besar, tipografi tegas, CTA button gradient biru.

## 2. Palet Warna
| Token | Hex (perkiraan) | Penggunaan |
|---|---|---|
| `--bg-base` | `#0A0E1A` | Background utama (hampir hitam) |
| `--bg-gradient-start` | `#2B4FE0` | Radial gradient biru terang (atas/tengah layar) |
| `--bg-gradient-end` | `#0A0E1A` | Fade ke gelap di tepi |
| `--surface` | `#12161F` / `rgba(255,255,255,0.04)` | Card background (glass-ish) |
| `--surface-border` | `rgba(255,255,255,0.08)` | Border tipis kartu |
| `--text-primary` | `#FFFFFF` | Teks utama |
| `--text-secondary` | `#9AA3B5` | Teks sekunder/deskripsi |
| `--accent` | `#3B6EF5 → #7FB2FF` (gradient) | Tombol CTA, elemen aktif |
| `--success` | `#3B6EF5` (dipakai juga sbg "selected" state) | Checklist terpilih |

## 3. Tipografi
- Font: sans-serif modern (mis. Inter/SF Pro fallback system-ui).
- Heading (judul bagian/survei): 24–28px, bold, white.
- Sub-heading (judul pertanyaan): 15–16px, semi-bold, white.
- Body/deskripsi/helper text: 13–14px, `--text-secondary`.
- Label tombol: 15px, semi-bold.

## 4. Komponen Custom

### 4.1 Card
- `border-radius: 24px`, padding 20–24px, background `--surface`, border 1px `--surface-border`, sedikit shadow/glow biru halus pada elemen aktif.

### 4.2 Custom Dropdown (pengganti `<select>` native)
- Trigger: rounded-full/rounded-xl, background `--surface`, chevron icon (Lucide `ChevronDown`) kanan.
- Panel: muncul dengan animasi fade+scale 150ms, list item dengan hover state biru transparan, item terpilih ditandai checkmark (Lucide `Check`).

### 4.3 Radio & Checkbox Custom
- Radio: lingkaran custom, state aktif berisi dot biru gradient + ring glow.
- Checkbox: kotak rounded 6px, state aktif background gradient biru + icon `Check` putih.

### 4.4 Scale/Likert Selector (1–5)
- Ditampilkan sebagai 5 tombol bulat berjajar (bukan slider native), angka di tengah, label min/max di kiri-kanan dengan `--text-secondary`.
- Terpilih → fill gradient biru + scale-up animasi ringan.

### 4.5 Toggle Bahasa (ID/EN)
- Mengikuti pola segmented control pada referensi ("Premium / infinity"): pill container dengan satu sisi highlighted gradient biru bergeser (`transition: transform`) saat toggle.

### 4.6 Progress Bar (indikator bagian)
- Thin rounded bar di atas form, mengisi gradient biru sesuai progres (bagian 1/3, 2/3, 3/3), mirip dot-indicator pada referensi (garis biru aktif + dot abu-abu).

### 4.7 Custom Scrollbar (webkit)
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
```

### 4.8 Tombol Primer (CTA)
- Full-width, rounded-full, gradient biru (`linear-gradient(90deg, #3B6EF5, #7FB2FF)`), teks putih bold, tap-state: scale(0.97) + sedikit darken, transisi 120ms.

### 4.9 Tabel Admin Dashboard
- Dark surface dengan baris zebra halus (`rgba(255,255,255,0.02)`), header sticky, hover row highlight biru transparan tipis, badge warna untuk status (mis. "Ya" hijau-biru, "Tidak" abu-abu).

## 5. Interaksi & Micro-interaction
- Semua transisi state (hover/tap/select) pakai `transition: all 150–200ms ease`.
- Submit button: loading state (spinner Lucide `Loader2` dengan animasi spin) saat menyimpan respons lewat Prisma.
- Toast/snackbar sederhana untuk notifikasi sukses submit & error.
- Halaman "Terima kasih" pakai icon besar (Lucide `CheckCircle2`) dengan animasi scale-in.

## 6. Layout Mobile-First
- Container max-width 480px, center-aligned di layar lebar (desktop tetap terlihat seperti mobile app, mirip mockup referensi yang ditampilkan dalam frame ponsel).
- Spacing vertikal antar pertanyaan: 20–24px.
- Safe-area padding bawah untuk tombol sticky (jika CTA dibuat sticky di bawah layar pada mobile).
