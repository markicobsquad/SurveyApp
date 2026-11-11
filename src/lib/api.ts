// Klien API untuk frontend — semua request relatif (tanpa absolut URL).
import type {
  PublicSurveySummary,
  PublicSurveySummaryResult,
  SurveyFormData,
  SurveyListResult,
  SurveyResponse,
  SurveySubmitResult,
} from './types'

/** Kirim respons survei ke backend. Melempar Error jika gagal. */
export async function submitSurvey(data: SurveyFormData): Promise<string> {
  const res = await fetch('/api/survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = (await res.json().catch(() => ({}))) as SurveySubmitResult
  if (!res.ok || !json.ok || !json.id) {
    throw new Error(json.error || 'SUBMIT_FAILED')
  }
  return json.id
}

/** Ambil seluruh respons survei (untuk dashboard admin), terbaru di atas. */
export async function fetchSurveyResponses(): Promise<SurveyResponse[]> {
  const res = await fetch('/api/survey', { cache: 'no-store' })
  const json = (await res.json().catch(() => ({}))) as SurveyListResult
  if (!res.ok || !json.ok || !json.responses) {
    throw new Error(json.error || 'FETCH_FAILED')
  }
  return json.responses
}

/** Fetch aggregate-only results for the public results page. */
export async function fetchPublicSurveySummary(): Promise<PublicSurveySummary> {
  const res = await fetch('/api/survey/results', { cache: 'no-store' })
  const json = (await res.json().catch(() => ({}))) as PublicSurveySummaryResult
  if (!res.ok || !json.ok || !json.summary) {
    throw new Error(json.error || 'FETCH_RESULTS_FAILED')
  }
  return json.summary
}
