import { db } from '@/lib/db'
import type { SurveyFormData, SurveyResponse } from '@/lib/types'

export async function createSurveyResponse(data: SurveyFormData): Promise<string> {
  const response = await db.surveyResponse.create({
    data: {
      ...data,
      kejadian: data.kejadian,
      kebermanfaatan: data.kebermanfaatan,
    },
    select: { id: true },
  })
  return response.id
}

export async function listSurveyResponses(): Promise<SurveyResponse[]> {
  const rows = await db.surveyResponse.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    kejadian: row.kejadian as unknown as Record<string, number>,
    kebermanfaatan: row.kebermanfaatan as unknown as Record<string, number>,
  }))
}
