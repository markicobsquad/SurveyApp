import { NextResponse } from 'next/server'
import { getPublicSurveySummary } from '@/models/survey-model'

export async function getPublicSurveyResults() {
  try {
    const summary = await getPublicSurveySummary()
    return NextResponse.json(
      { ok: true, summary },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[GET /api/survey/results]', error)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}
