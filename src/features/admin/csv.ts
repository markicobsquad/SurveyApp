// CSV builder untuk export hasil survei — pure functions, tanpa dependensi UI.
// Format: koma-separated, satu baris per respons, label bahasa Indonesia,
// baris dipisah CRLF agar rapi juga di Excel Windows.

import type { SurveyResponse } from '@/lib/types'
import type { Option } from '@/lib/survey-options'
import {
  PENYEBAB_OPTIONS,
  STATUS_OPTIONS,
  SUMBER_INFO_OPTIONS,
  TRIAL_OPTIONS,
  WA_GROUP_OPTIONS,
} from '@/lib/survey-options'

const KEJADIAN_KEYS = [
  'deadline',
  'classMoved',
  'lab',
  'advising',
  'submission',
] as const

const KEBERMANFAATAN_KEYS = [
  'oneView',
  'reminders',
  'classAlerts',
  'standardized',
  'crowdMap',
  'wifiStatus',
  'languageOption',
] as const

const CSV_HEADERS = [
  'No',
  'Tanggal',
  'Status Mahasiswa',
  'Angkatan',
  'Program Studi',
  'Jumlah Grup WA',
  'Sumber Info',
  'Sumber Info Lainnya',
  'Q6a Melewatkan tenggat tugas (1-4)',
  'Q6b Kelas kosong atau pindah (1-4)',
  'Q6c Lupa praktikum (1-4)',
  'Q6d Terlambat bimbingan (1-4)',
  'Q6e Bingung pengumpulan tugas (1-4)',
  'Penyebab Utama',
  'Penyebab Lainnya',
  'Q8 Hambatan Wi-Fi (1-5)',
  'Q9 Sulit Tempat Belajar (1-5)',
  'Q10 Sulit Bahasa (1-5)',
  'Q11a Jadwal satu tampilan (1-5)',
  'Q11b Pengingat tenggat (1-5)',
  'Q11c Alert kelas pindah (1-5)',
  'Q11d Format tugas seragam (1-5)',
  'Q11e Peta keramaian (1-5)',
  'Q11f Status Wi-Fi zona (1-5)',
  'Q11g Pilihan bahasa (1-5)',
  'Q12 Manfaat Keseluruhan (1-5)',
  'Bersedia Uji Coba',
  'Fitur Tambahan',
  'Email',
] as const

/** Escape satu sel CSV: bungkus kutip ganda jika mengandung koma / kutip / newline / titik-koma. */
export function csvEscape(value: string): string {
  // Prefix formula-like user input so spreadsheet apps treat it as plain text.
  const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? `'${value}` : value
  if (/[",\n;]/.test(safeValue)) {
    return `"${safeValue.replaceAll('"', '""')}"`
  }
  return safeValue
}

/** Label Indonesia untuk nilai opsi; '' jika kosong, nilai mentah jika tidak dikenal. */
function idLabel(options: Option[], value: string | null | undefined): string {
  if (!value) return ''
  const found = options.find((o) => o.value === value)
  return found ? found.label.id : value
}

/** Gabungkan banyak nilai opsi menjadi "A | B | C" (label Indonesia). */
function joinIdLabels(
  options: Option[],
  values: string[] | null | undefined,
): string {
  return (values ?? []).map((v) => idLabel(options, v)).join(' | ')
}

/** Angka mentah untuk sel skala; null/undefined → string kosong. */
function numCell(value: number | null | undefined): string {
  return value === null || value === undefined ? '' : String(value)
}

/** Tanggal gaya 'id-ID' singkat (mis. 05/07/2025 14.30); '' jika tidak valid. */
function dateCell(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
}

function rowCells(r: SurveyResponse, index: number): string[] {
  return [
    String(index + 1),
    dateCell(r.createdAt),
    idLabel(STATUS_OPTIONS, r.statusMahasiswa),
    r.angkatan ?? '',
    r.programStudi ?? '',
    idLabel(WA_GROUP_OPTIONS, r.jumlahGrupWa),
    joinIdLabels(SUMBER_INFO_OPTIONS, r.sumberInfo),
    r.sumberInfoLainnya ?? '',
    ...KEJADIAN_KEYS.map((key) => numCell(r.kejadian?.[key])),
    joinIdLabels(PENYEBAB_OPTIONS, r.penyebabUtama),
    r.penyebabLainnya ?? '',
    numCell(r.wifiHambatan),
    numCell(r.sulitTempatBelajar),
    numCell(r.sulitBahasa),
    ...KEBERMANFAATAN_KEYS.map((key) => numCell(r.kebermanfaatan?.[key])),
    numCell(r.manfaatKeseluruhan),
    idLabel(TRIAL_OPTIONS, r.bersediaUjiCoba),
    r.fiturTambahan ?? '',
    r.kontak ?? '',
  ]
}

/** Bangun isi file CSV lengkap (baris header + baris data, dipisah CRLF). */
export function buildSurveyCsv(responses: SurveyResponse[]): string {
  const lines: string[] = [CSV_HEADERS.join(',')]
  responses.forEach((response, index) => {
    lines.push(rowCells(response, index).map(csvEscape).join(','))
  })
  return lines.join('\r\n')
}
