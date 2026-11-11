import { getPublicSurveyResults } from '@/controllers/public-results-controller'

export const runtime = 'nodejs'

export async function GET() {
  return getPublicSurveyResults()
}
