import { NextResponse, type NextRequest } from 'next/server'
import {
  ANGKATAN_OPTIONS,
  KEJADIAN_ROWS,
  KEBERMANFAATAN_ROWS,
  PENYEBAB_OPTIONS,
  STATUS_OPTIONS,
  SUMBER_INFO_OPTIONS,
  TRIAL_OPTIONS,
  WA_GROUP_OPTIONS,
} from '@/lib/survey-options'
import type { SurveyFormData } from '@/lib/types'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-session'
import { createSurveyResponse, listSurveyResponses } from '@/models/survey-model'

const isChoice = (value: string, choices: readonly { value: string }[]) =>
  choices.some((choice) => choice.value === value)

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown, allowed: readonly { value: string }[]): string[] | null {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) return null
  const values = [...new Set(value.map((item: string) => item.trim()))]
  return values.length > 0 && values.every((item) => isChoice(item, allowed)) ? values : null
}

function numericMatrix(
  value: unknown,
  keys: readonly { value: string }[],
  max: number,
): Record<string, number> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const expectedKeys = keys.map((key) => key.value)
  if (
    Object.keys(record).length !== expectedKeys.length ||
    expectedKeys.some((key) => !Object.hasOwn(record, key))
  ) return null

  const result: Record<string, number> = {}
  for (const key of expectedKeys) {
    const score = record[key]
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > max) return null
    result[key] = score
  }
  return result
}

function optionalText(value: unknown): string | null {
  const text = stringValue(value)
  return text || null
}

function requiredScore(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
    ? value
    : null
}

export async function submitSurvey(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'INVALID_BODY' }, { status: 400 })
  }

  const statusMahasiswa = stringValue(body.statusMahasiswa)
  const angkatan = stringValue(body.angkatan)
  const programStudi = stringValue(body.programStudi)
  const jumlahGrupWa = stringValue(body.jumlahGrupWa)
  const sumberInfo = stringList(body.sumberInfo, SUMBER_INFO_OPTIONS)
  const penyebabUtama = stringList(body.penyebabUtama, PENYEBAB_OPTIONS)
  const kejadian = numericMatrix(body.kejadian, KEJADIAN_ROWS, 4)
  const kebermanfaatan = numericMatrix(body.kebermanfaatan, KEBERMANFAATAN_ROWS, 5)
  const wifiHambatan = requiredScore(body.wifiHambatan)
  const sulitTempatBelajar = requiredScore(body.sulitTempatBelajar)
  const manfaatKeseluruhan = requiredScore(body.manfaatKeseluruhan)
  const bersediaUjiCoba = stringValue(body.bersediaUjiCoba)

  const fields: string[] = []
  if (!isChoice(statusMahasiswa, STATUS_OPTIONS)) fields.push('statusMahasiswa')
  if (!isChoice(angkatan, ANGKATAN_OPTIONS)) fields.push('angkatan')
  if (!programStudi || programStudi.length > 200) fields.push('programStudi')
  if (!isChoice(jumlahGrupWa, WA_GROUP_OPTIONS)) fields.push('jumlahGrupWa')
  if (!sumberInfo) fields.push('sumberInfo')
  if (!penyebabUtama) fields.push('penyebabUtama')
  if (!kejadian) fields.push('kejadian')
  if (!kebermanfaatan) fields.push('kebermanfaatan')
  if (wifiHambatan === null) fields.push('wifiHambatan')
  if (sulitTempatBelajar === null) fields.push('sulitTempatBelajar')
  if (manfaatKeseluruhan === null) fields.push('manfaatKeseluruhan')
  if (!isChoice(bersediaUjiCoba, TRIAL_OPTIONS)) fields.push('bersediaUjiCoba')

  const sulitBahasa = body.sulitBahasa == null ? null : requiredScore(body.sulitBahasa)
  if (body.sulitBahasa != null && sulitBahasa === null) fields.push('sulitBahasa')
  if (fields.length) {
    return NextResponse.json({ ok: false, error: 'VALIDATION_FAILED', fields }, { status: 400 })
  }

  const data: SurveyFormData = {
    statusMahasiswa,
    angkatan,
    programStudi,
    jumlahGrupWa,
    sumberInfo: sumberInfo!,
    sumberInfoLainnya: optionalText(body.sumberInfoLainnya),
    kejadian: kejadian!,
    penyebabUtama: penyebabUtama!,
    penyebabLainnya: optionalText(body.penyebabLainnya),
    wifiHambatan: wifiHambatan!,
    sulitTempatBelajar: sulitTempatBelajar!,
    sulitBahasa,
    kebermanfaatan: kebermanfaatan!,
    manfaatKeseluruhan: manfaatKeseluruhan!,
    bersediaUjiCoba,
    fiturTambahan: optionalText(body.fiturTambahan),
    kontak: optionalText(body.kontak),
  }

  try {
    const id = await createSurveyResponse(data)
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/survey]', error)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function getSurveyResponses(request: NextRequest) {
  if (!verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const responses = await listSurveyResponses()
    return NextResponse.json({ ok: true, responses }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[GET /api/survey]', error)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}
