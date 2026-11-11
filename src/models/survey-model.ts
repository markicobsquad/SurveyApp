import { db } from '@/lib/db'
import type { PublicSurveySummary, SurveyFormData, SurveyResponse } from '@/lib/types'

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

export async function getPublicSurveySummary(): Promise<PublicSurveySummary> {
  const [metrics, whatsappGroups, trialWillingness] = await Promise.all([
    db.surveyResponse.aggregate({
      _count: { _all: true },
      _avg: {
        wifiHambatan: true,
        sulitTempatBelajar: true,
        manfaatKeseluruhan: true,
      },
    }),
    db.surveyResponse.groupBy({
      by: ['jumlahGrupWa'],
      _count: { _all: true },
    }),
    db.surveyResponse.groupBy({
      by: ['bersediaUjiCoba'],
      _count: { _all: true },
    }),
  ])

  return {
    responseCount: metrics._count._all,
    averages: {
      wifiDifficulty: metrics._avg.wifiHambatan,
      studySpaceDifficulty: metrics._avg.sulitTempatBelajar,
      overallUsefulness: metrics._avg.manfaatKeseluruhan,
    },
    whatsappGroupDistribution: whatsappGroups.map((item) => ({
      value: item.jumlahGrupWa,
      count: item._count._all,
    })),
    trialWillingnessDistribution: trialWillingness.map((item) => ({
      value: item.bersediaUjiCoba,
      count: item._count._all,
    })),
  }
}
