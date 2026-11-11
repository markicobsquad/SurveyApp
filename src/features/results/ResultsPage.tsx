'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Inbox,
  Loader2,
  ThumbsUp,
  Wifi,
} from 'lucide-react'
import { useLang } from '@/components/providers'
import { Card, GhostButton, PageShell, SurveyHeader } from '@/components/survey/ui'
import { fetchPublicSurveySummary } from '@/lib/api'
import { TRIAL_OPTIONS, WA_GROUP_OPTIONS } from '@/lib/survey-options'
import type { PublicSurveySummary, SurveyAggregateCount } from '@/lib/types'

function DistributionCard({
  title,
  options,
  counts,
  total,
  lang,
}: {
  title: string
  options: { value: string; label: { id: string; en: string } }[]
  counts: SurveyAggregateCount[]
  total: number
  lang: 'id' | 'en'
}) {
  const countByValue = new Map(counts.map((item) => [item.value, item.count]))

  return (
    <Card>
      <h2 className="mb-5 text-sm font-bold text-white">{title}</h2>
      <div className="flex flex-col gap-4">
        {options.map((option) => {
          const count = countByValue.get(option.value) ?? 0
          const percent = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={option.value} className="grid grid-cols-[minmax(72px,1fr)_minmax(60px,2fr)_auto] items-center gap-3">
              <span className="truncate text-xs text-[#C6CDDC]">{option.label[lang]}</span>
              <span
                className="h-2 overflow-hidden rounded-full bg-white/[0.07]"
                role="img"
                aria-label={`${option.label[lang]}: ${percent}%`}
              >
                <span
                  className="block h-full rounded-full bg-[linear-gradient(90deg,#3B6EF5,#7FB2FF)] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-[4.5rem] whitespace-nowrap text-right text-xs font-semibold text-white">
                {count} · {percent}%
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  outOfFive,
}: {
  icon: typeof Wifi
  title: string
  value: string
  outOfFive?: string
}) {
  return (
    <Card className="min-h-32">
      <Icon className="h-5 w-5 text-[#7FB2FF]" aria-hidden />
      <p className="mt-3 text-2xl font-extrabold leading-none text-white">
        {value}
        {outOfFive && (
          <span className="ml-1.5 text-[10px] font-semibold text-[#9AA3B5]">{outOfFive}</span>
        )}
      </p>
      <p className="mt-2 text-xs leading-snug text-[#9AA3B5]">{title}</p>
    </Card>
  )
}

export default function ResultsPage() {
  const { lang, t } = useLang()
  const [summary, setSummary] = useState<PublicSurveySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const loadResults = useCallback(() => {
    fetchPublicSurveySummary()
      .then((data) => {
        setSummary(data)
        setLoadError(false)
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US'),
    [lang],
  )
  const decimalFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 1 }),
    [lang],
  )
  const average = (value: number | null | undefined) =>
    value == null ? '—' : decimalFormatter.format(value)

  const summaries = summary
    ? [
        { icon: Wifi, title: t('results.avgWifi'), value: average(summary.averages.wifiDifficulty) },
        { icon: BookOpen, title: t('results.avgStudy'), value: average(summary.averages.studySpaceDifficulty) },
        { icon: ThumbsUp, title: t('results.avgOverall'), value: average(summary.averages.overallUsefulness) },
      ]
    : []

  const retry = () => {
    setLoading(true)
    setLoadError(false)
    loadResults()
  }

  return (
    <PageShell>
      <SurveyHeader />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 pb-12 pt-6">
        <Card className="animate-ss-slide-up mb-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#3B6EF5]/15 text-[#7FB2FF]">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold leading-snug text-white">{t('results.title')}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-[#C6CDDC]">
                {t('results.description')}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#9AA3B5]">
                {t('results.privacy')}
              </p>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-[#9AA3B5]" role="status">
            <Loader2 className="h-5 w-5 animate-spin text-[#7FB2FF]" aria-hidden />
            {t('results.loading')}
          </div>
        ) : loadError ? (
          <div role="alert">
            <Card className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertCircle className="h-6 w-6 text-red-400" aria-hidden />
              <p className="text-sm text-[#C6CDDC]">{t('results.loadError')}</p>
              <GhostButton onClick={retry} className="mt-1 max-w-48">
                {t('results.retry')}
              </GhostButton>
            </Card>
          </div>
        ) : summary ? (
          <div className="flex flex-col gap-5">
            <Card className="animate-ss-slide-up">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-[0_0_18px_rgba(59,110,245,0.35)]">
                    <Inbox className="h-5 w-5 text-white" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                    {t('results.responseCount')}
                  </span>
                </div>
                <span className="text-3xl font-extrabold leading-none text-white">
                  {numberFormatter.format(summary.responseCount)}
                </span>
              </div>
            </Card>

            {summary.responseCount === 0 ? (
              <Card className="py-8 text-center">
                <p className="text-sm leading-relaxed text-[#9AA3B5]">{t('results.empty')}</p>
              </Card>
            ) : (
              <>
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={t('results.title')}>
                  {summaries.map((item) => (
                    <SummaryCard
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      value={item.value}
                      outOfFive={t('results.outOf5')}
                    />
                  ))}
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <DistributionCard
                    title={t('results.groups')}
                    options={WA_GROUP_OPTIONS}
                    counts={summary.whatsappGroupDistribution}
                    total={summary.responseCount}
                    lang={lang}
                  />
                  <DistributionCard
                    title={t('results.trial')}
                    options={TRIAL_OPTIONS}
                    counts={summary.trialWillingnessDistribution}
                    total={summary.responseCount}
                    lang={lang}
                  />
                </section>
              </>
            )}
          </div>
        ) : null}

        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('results.backToSurvey')}
        </Link>
      </main>
    </PageShell>
  )
}
