import { getSurveyResponses, submitSurvey } from '@/controllers/survey-controller'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  return submitSurvey(request)
}

export async function GET(request: NextRequest) {
  return getSurveyResponses(request)
}
