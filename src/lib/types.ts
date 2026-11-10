// Tipe data survei — dipakai oleh form publik, API, dan dashboard admin.

export interface SurveyFormData {
  statusMahasiswa: string
  angkatan: string
  programStudi: string
  jumlahGrupWa: string
  sumberInfo: string[]
  sumberInfoLainnya: string | null
  kejadian: Record<string, number>
  penyebabUtama: string[]
  penyebabLainnya: string | null
  wifiHambatan: number
  sulitTempatBelajar: number
  sulitBahasa: number | null
  kebermanfaatan: Record<string, number>
  manfaatKeseluruhan: number
  bersediaUjiCoba: string
  fiturTambahan: string | null
  kontak: string | null
}

export interface SurveyResponse extends SurveyFormData {
  id: string
  createdAt: string
}

export interface SurveySubmitResult {
  ok: boolean
  id?: string
  error?: string
}

export interface SurveyListResult {
  ok: boolean
  responses?: SurveyResponse[]
  error?: string
}
