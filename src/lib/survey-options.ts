// Konstanta opsi survei — single source of truth untuk form publik,
// detail view admin, dan export CSV.
import type { Lang } from './i18n'

export interface LocalizedLabel {
  id: string
  en: string
}

export interface Option {
  value: string
  label: LocalizedLabel
}

export interface ScaleColumn {
  value: number
  label: LocalizedLabel
}

// Q1 — Status mahasiswa
export const STATUS_OPTIONS: Option[] = [
  { value: 'indonesian', label: { id: 'Mahasiswa Indonesia', en: 'Indonesian student' } },
  { value: 'international', label: { id: 'Mahasiswa internasional', en: 'International student' } },
]

// Q2 — Angkatan
export const ANGKATAN_OPTIONS: Option[] = ['2022', '2023', '2024', '2025', '2026'].map(
  (year) => ({ value: year, label: { id: year, en: year } }),
)

// Q4 — Jumlah grup WhatsApp
export const WA_GROUP_OPTIONS: Option[] = [
  { value: '1-5', label: { id: '1–5', en: '1–5' } },
  { value: '6-10', label: { id: '6–10', en: '6–10' } },
  { value: '11-20', label: { id: '11–20', en: '11–20' } },
  { value: '>20', label: { id: 'Lebih dari 20', en: 'More than 20' } },
]

// Q5 — Sumber informasi
export const SUMBER_INFO_OPTIONS: Option[] = [
  { value: 'sia', label: { id: 'Sistem informasi akademik', en: 'Academic information system' } },
  { value: 'lms', label: { id: 'E-learning / LMS', en: 'E-learning / LMS' } },
  { value: 'wa', label: { id: 'Grup WhatsApp', en: 'WhatsApp groups' } },
  { value: 'friends', label: { id: 'Diberitahu teman', en: 'From friends' } },
  { value: 'inclass', label: { id: 'Pengumuman langsung di kelas', en: 'In-class announcement' } },
  { value: 'other', label: { id: 'Lainnya', en: 'Other' } },
]

// Q6 — Kejadian semester ini (baris matrix)
export const KEJADIAN_ROWS: Option[] = [
  { value: 'deadline', label: { id: 'Melewatkan tenggat tugas', en: 'Missed an assignment deadline' } },
  { value: 'classMoved', label: { id: 'Datang ke kelas yang ternyata kosong atau dipindahkan', en: 'Came to a class that was cancelled or moved' } },
  { value: 'lab', label: { id: 'Lupa jadwal praktikum', en: 'Forgot a lab session' } },
  { value: 'advising', label: { id: 'Lupa atau terlambat bimbingan dengan dosen wali', en: 'Missed or was late for an academic advising session' } },
  { value: 'submission', label: { id: 'Bingung format atau tempat pengumpulan tugas', en: 'Confused about how or where to submit an assignment' } },
]

// Q6 — Kolom frekuensi (1–4)
export const KEJADIAN_COLS: ScaleColumn[] = [
  { value: 1, label: { id: 'Tidak pernah', en: 'Never' } },
  { value: 2, label: { id: '1 kali', en: 'Once' } },
  { value: 3, label: { id: '2–3 kali', en: '2–3 times' } },
  { value: 4, label: { id: 'Lebih dari 3 kali', en: 'More than 3 times' } },
]

// Q7 — Penyebab utama
export const PENYEBAB_OPTIONS: Option[] = [
  { value: 'scattered', label: { id: 'Informasi tersebar di banyak tempat', en: 'Information is scattered' } },
  { value: 'lastMinute', label: { id: 'Pengumuman mendadak', en: 'Last-minute announcements' } },
  { value: 'buried', label: { id: 'Pesan tenggelam di grup WhatsApp', en: 'Messages get buried in chat groups' } },
  { value: 'noReminder', label: { id: 'Tidak ada pengingat', en: 'No reminders' } },
  { value: 'language', label: { id: 'Kendala bahasa', en: 'Language barrier' } },
  { value: 'other', label: { id: 'Lainnya', en: 'Other' } },
]

// Q11 — Baris fitur
export const KEBERMANFAATAN_ROWS: Option[] = [
  { value: 'oneView', label: { id: 'Jadwal kuliah, praktikum, dan bimbingan dalam satu tampilan', en: 'All schedules in one view' } },
  { value: 'reminders', label: { id: 'Pengingat otomatis sebelum tenggat', en: 'Automatic deadline reminders' } },
  { value: 'classAlerts', label: { id: 'Pemberitahuan dosen berhalangan atau kelas pindah', en: 'Alerts for cancelled or moved classes' } },
  { value: 'standardized', label: { id: 'Format tugas yang seragam (instruksi, dokumen, tenggat)', en: 'Standardized assignment details' } },
  { value: 'crowdMap', label: { id: 'Peta keramaian area kampus', en: 'Campus crowd map' } },
  { value: 'wifiStatus', label: { id: 'Status Wi-Fi per zona', en: 'Wi-Fi status by area' } },
  { value: 'languageOption', label: { id: 'Pilihan bahasa Indonesia/Inggris', en: 'Indonesian/English language option' } },
]

// Q11 & Q12 — Kolom skala kebermanfaatan (1–5)
export const HELPFUL_COLS: ScaleColumn[] = [
  { value: 1, label: { id: 'Tidak membantu', en: 'Not helpful' } },
  { value: 2, label: { id: 'Sedikit membantu', en: 'Slightly helpful' } },
  { value: 3, label: { id: 'Cukup membantu', en: 'Moderately helpful' } },
  { value: 4, label: { id: 'Membantu', en: 'Helpful' } },
  { value: 5, label: { id: 'Sangat membantu', en: 'Very helpful' } },
]

// Q13 — Bersedia uji coba
export const TRIAL_OPTIONS: Option[] = [
  { value: 'yes', label: { id: 'Ya', en: 'Yes' } },
  { value: 'maybe', label: { id: 'Mungkin', en: 'Maybe' } },
  { value: 'no', label: { id: 'Tidak', en: 'No' } },
]

export const OTHER_KEY = 'other'

/** Cari label bilingual untuk sebuah nilai opsi. */
export function labelOf(
  options: Option[],
  value: string | null | undefined,
  lang: Lang,
): string {
  if (!value) return '—'
  const found = options.find((o) => o.value === value)
  return found ? found.label[lang] : value
}

/** Cari label bilingual untuk nilai kolom skala. */
export function scaleLabelOf(
  columns: ScaleColumn[],
  value: number | null | undefined,
  lang: Lang,
): string {
  if (value === null || value === undefined) return '—'
  const found = columns.find((c) => c.value === value)
  return found ? found.label[lang] : String(value)
}
