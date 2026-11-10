'use client'

// Dashboard admin: statistik agregat, distribusi, filter, daftar respons,
// detail per-responden (modal bottom-sheet), dan export CSV.
// Komponen murni (tanpa file route): di-mount oleh router di luar file ini.
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Download,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  SearchX,
  ServerCrash,
  ThumbsUp,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useLang, useToast } from '@/components/providers'
import type { Lang } from '@/lib/i18n'
import { clearAdminSession, isAdminSession } from '@/lib/admin-auth'
import { fetchSurveyResponses } from '@/lib/api'
import type { SurveyResponse } from '@/lib/types'
import {
  ANGKATAN_OPTIONS,
  HELPFUL_COLS,
  KEJADIAN_COLS,
  KEJADIAN_ROWS,
  KEBERMANFAATAN_ROWS,
  PENYEBAB_OPTIONS,
  STATUS_OPTIONS,
  SUMBER_INFO_OPTIONS,
  TRIAL_OPTIONS,
  WA_GROUP_OPTIONS,
  labelOf,
  scaleLabelOf,
  type Option,
  type ScaleColumn,
} from '@/lib/survey-options'
import {
  Card,
  GhostButton,
  LanguageToggle,
  PageShell,
  TextInput,
} from '@/components/survey/ui'
import { SelectDropdown, type ChoiceOption } from '@/components/survey/choices'
import { buildSurveyCsv } from './csv'

// ---------- Tipe & komponen kecil lokal ----------

interface DistItem {
  value: string
  label: string
  count: number
  pct: number
}

function StatusChip({ status, lang }: { status: string; lang: Lang }) {
  const international = status === 'international'
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        international
          ? 'bg-purple-400/10 text-purple-300'
          : 'bg-[#3B6EF5]/15 text-[#9DBAFF]'
      }`}
    >
      {labelOf(STATUS_OPTIONS, status, lang)}
    </span>
  )
}

function DistributionRows({
  items,
  labelWidthClass,
}: {
  items: DistItem[]
  labelWidthClass: string
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <div key={item.value} className="flex items-center gap-2.5">
          <span className={`${labelWidthClass} shrink-0 truncate text-xs text-[#C6CDDC]`}>
            {item.label}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-[linear-gradient(90deg,#3B6EF5,#7FB2FF)] transition-all duration-300 ease-out"
              style={{ width: `${item.pct}%` }}
            />
          </span>
          <span className="w-16 shrink-0 whitespace-nowrap text-right text-xs font-semibold text-white">
            {item.count} · {item.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

function DetailSection({
  num,
  title,
  children,
}: {
  num: number
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-1 flex items-center gap-2">
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3B6EF5]/15 text-xs font-bold text-[#7FB2FF]"
        >
          {num}
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA3B5]">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-white/[0.05] py-2.5 last:border-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9AA3B5]">
        {label}
      </p>
      <div className="mt-1 break-words text-sm leading-relaxed text-white">
        {children}
      </div>
    </div>
  )
}

/** Sub-daftar jawaban matrix (Q6 / Q11) — label baris + label skala di kanan. */
function ScaleSubList({
  rows,
  columns,
  values,
  lang,
}: {
  rows: Option[]
  columns: ScaleColumn[]
  values: Record<string, number> | undefined
  lang: Lang
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div
          key={row.value}
          className="flex items-baseline justify-between gap-3 pl-2 text-xs"
        >
          <span className="text-[#9AA3B5]">{row.label[lang]}</span>
          <span className="shrink-0 font-semibold text-white">
            {scaleLabelOf(columns, values?.[row.value], lang)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------- Halaman dashboard ----------

export default function AdminDashboardPage() {
  const { lang, t } = useLang()
  const { success } = useToast()
  const router = useRouter()

  const [authed] = useState(() => isAdminSession())
  const [responses, setResponses] = useState<SurveyResponse[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAngkatan, setFilterAngkatan] = useState('all')
  const [searchProdi, setSearchProdi] = useState('')
  const [selected, setSelected] = useState<SurveyResponse | null>(null)

  // Guard route: tanpa sesi admin → balik ke halaman login.
  useEffect(() => {
    if (!authed) {
      router.replace('/admin')
    }
  }, [authed, router])

  const applyResponses = useCallback((data: SurveyResponse[]) => {
    // API sudah sort terbaru di atas — re-sort defensif.
    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setResponses(sorted)
    setLoadError(false)
  }, [])

  // Muat data via promise chain — setState hanya di callback async (aturan react-hooks).
  useEffect(() => {
    if (!authed) return
    let active = true
    fetchSurveyResponses()
      .then((data) => {
        if (active) applyResponses(data)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
    return () => {
      active = false
    }
  }, [authed, applyResponses])

  /** Ulangi pemuatan data (dipanggil dari event handler, bukan effect). */
  const retry = () => {
    setResponses(null)
    setLoadError(false)
    fetchSurveyResponses()
      .then((data) => applyResponses(data))
      .catch(() => setLoadError(true))
  }

  // Tutup modal detail dengan tombol Escape.
  useEffect(() => {
    if (!selected) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const statusOptions = useMemo<ChoiceOption[]>(
    () => [
      { value: 'all', label: t('admin.dash.all') },
      ...STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: labelOf(STATUS_OPTIONS, o.value, lang),
      })),
    ],
    [t, lang],
  )

  const angkatanOptions = useMemo<ChoiceOption[]>(
    () => [
      { value: 'all', label: t('admin.dash.all') },
      ...ANGKATAN_OPTIONS.map((o) => ({
        value: o.value,
        label: labelOf(ANGKATAN_OPTIONS, o.value, lang),
      })),
    ],
    [t, lang],
  )

  const stats = useMemo(() => {
    const list = responses ?? []
    const total = list.length
    const meanOf = (pick: (r: SurveyResponse) => number) =>
      total === 0 ? 0 : list.reduce((sum, r) => sum + pick(r), 0) / total
    const fmt = (n: number) =>
      n.toFixed(1).replace('.', lang === 'id' ? ',' : '.')
    return {
      total,
      wifi: fmt(meanOf((r) => r.wifiHambatan)),
      study: fmt(meanOf((r) => r.sulitTempatBelajar)),
      overall: fmt(meanOf((r) => r.manfaatKeseluruhan)),
    }
  }, [responses, lang])

  const distQ4 = useMemo<DistItem[]>(() => {
    const list = responses ?? []
    const total = list.length
    return WA_GROUP_OPTIONS.map((opt) => {
      const count = list.filter((r) => r.jumlahGrupWa === opt.value).length
      return {
        value: opt.value,
        label: opt.label[lang],
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }
    })
  }, [responses, lang])

  const distQ13 = useMemo<DistItem[]>(() => {
    const list = responses ?? []
    const total = list.length
    return TRIAL_OPTIONS.map((opt) => {
      const count = list.filter((r) => r.bersediaUjiCoba === opt.value).length
      return {
        value: opt.value,
        label: opt.label[lang],
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }
    })
  }, [responses, lang])

  const filtered = useMemo(() => {
    const list = responses ?? []
    const query = searchProdi.trim().toLowerCase()
    return list.filter((r) => {
      if (filterStatus !== 'all' && (r.statusMahasiswa ?? '') !== filterStatus) {
        return false
      }
      if (filterAngkatan !== 'all' && (r.angkatan ?? '') !== filterAngkatan) {
        return false
      }
      if (query && !(r.programStudi ?? '').toLowerCase().includes(query)) {
        return false
      }
      return true
    })
  }, [responses, filterStatus, filterAngkatan, searchProdi])

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [lang],
  )

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
  }

  const sumberInfoText = (r: SurveyResponse): string => {
    const list = r.sumberInfo ?? []
    const labels = list.map((v) => labelOf(SUMBER_INFO_OPTIONS, v, lang)).join(', ')
    if (list.includes('other') && r.sumberInfoLainnya) {
      return labels ? `${labels} — "${r.sumberInfoLainnya}"` : `"${r.sumberInfoLainnya}"`
    }
    return labels
  }

  const penyebabText = (r: SurveyResponse): string => {
    const list = r.penyebabUtama ?? []
    const labels = list.map((v) => labelOf(PENYEBAB_OPTIONS, v, lang)).join(', ')
    if (list.includes('other') && r.penyebabLainnya) {
      return labels ? `${labels} — "${r.penyebabLainnya}"` : `"${r.penyebabLainnya}"`
    }
    return labels
  }

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => undefined)
    clearAdminSession()
    success(t('admin.toast.logout'))
    router.replace('/admin')
  }

  const handleExport = () => {
    const csv = buildSurveyCsv(responses ?? [])
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <PageShell>
        <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 items-center justify-center px-5 pb-12 pt-6">
          <Loader2 className="h-6 w-6 animate-spin text-[#7FB2FF]" aria-hidden />
        </main>
      </PageShell>
    )
  }

  const avgItems: { icon: LucideIcon; value: string; label: string }[] = [
    { icon: Wifi, value: stats.wifi, label: t('admin.dash.avgWifi') },
    { icon: BookOpen, value: stats.study, label: t('admin.dash.avgStudy') },
    { icon: ThumbsUp, value: stats.overall, label: t('admin.dash.avgOverall') },
  ]

  return (
    <PageShell>
      <header className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-lg shadow-[#3B6EF5]/30">
              <LayoutDashboard className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                {t('admin.dash.title')}
              </p>
              <p className="text-[11px] leading-tight text-[#9AA3B5]">
                {t('admin.dash.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              aria-label={t('admin.dash.logout')}
              className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/70 transition-all duration-150 hover:bg-white/[0.08] hover:text-white active:scale-[0.97]"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">{t('admin.dash.logout')}</span>
            </button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[480px] flex-1 px-5 pb-12 pt-6">
        {loadError ? (
          <Card className="animate-ss-slide-up flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10">
              <ServerCrash className="h-6 w-6 text-red-400" aria-hidden />
            </span>
            <p className="text-sm text-[#C6CDDC]">{t('admin.dash.loadError')}</p>
            <GhostButton onClick={retry} className="mt-1">
              {t('admin.dash.retry')}
            </GhostButton>
          </Card>
        ) : responses === null ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#7FB2FF]" aria-hidden />
            <p className="text-sm text-[#9AA3B5]">{t('admin.dash.loading')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Statistik utama */}
            <section className="flex flex-col gap-3" aria-label={t('admin.dash.total')}>
              <Card className="animate-ss-slide-up">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-[0_0_18px_rgba(59,110,245,0.5)]">
                      <Inbox className="h-5 w-5 text-white" aria-hidden />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                      {t('admin.dash.total')}
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold leading-none text-white">
                    {responses.length}
                  </span>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                {avgItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-4"
                    >
                      <Icon className="h-4 w-4 text-[#7FB2FF]" aria-hidden />
                      <p className="mt-2 text-xl font-bold leading-none text-white">
                        {item.value}
                        <span className="ml-1 text-[10px] font-semibold text-[#9AA3B5]">
                          {t('admin.dash.outOf5')}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium leading-tight text-[#9AA3B5]">
                        {item.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Distribusi Q4 & Q13 */}
            <section className="flex flex-col gap-3">
              <Card className="animate-ss-slide-up">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-white">
                    {t('admin.dash.distQ4')}
                  </h2>
                  <span className="shrink-0 text-[11px] text-[#9AA3B5]">
                    {t('admin.dash.responses', { n: responses.length })}
                  </span>
                </div>
                <DistributionRows items={distQ4} labelWidthClass="w-24" />
              </Card>

              <Card className="animate-ss-slide-up">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-white">
                    {t('admin.dash.distQ13')}
                  </h2>
                  <span className="shrink-0 text-[11px] text-[#9AA3B5]">
                    {t('admin.dash.responses', { n: responses.length })}
                  </span>
                </div>
                <DistributionRows items={distQ13} labelWidthClass="w-16" />
              </Card>
            </section>

            {/* Filter + export */}
            <Card className="animate-ss-slide-up flex flex-col gap-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                  {t('admin.dash.filterStatus')}
                </p>
                <SelectDropdown
                  options={statusOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder={t('admin.dash.all')}
                  ariaLabel={t('admin.dash.filterStatus')}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                  {t('admin.dash.filterAngkatan')}
                </p>
                <SelectDropdown
                  options={angkatanOptions}
                  value={filterAngkatan}
                  onChange={setFilterAngkatan}
                  placeholder={t('admin.dash.all')}
                  ariaLabel={t('admin.dash.filterAngkatan')}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                  {t('admin.dash.col.prodi')}
                </p>
                <TextInput
                  type="text"
                  value={searchProdi}
                  onChange={setSearchProdi}
                  placeholder={t('admin.dash.filterProdi')}
                  ariaLabel={t('admin.dash.filterProdi')}
                />
              </div>
              <GhostButton onClick={handleExport}>
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                {t('admin.dash.export')}
              </GhostButton>
            </Card>

            {/* Caption */}
            <p className="text-xs text-[#9AA3B5]">
              {t('admin.dash.showing', {
                n: filtered.length,
                m: responses.length,
              })}
            </p>

            {/* Daftar respons / empty state */}
            {responses.length === 0 ? (
              <Card className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Inbox className="h-6 w-6 text-[#9AA3B5]" aria-hidden />
                </span>
                <p className="text-sm text-[#C6CDDC]">{t('admin.dash.empty')}</p>
              </Card>
            ) : filtered.length === 0 ? (
              <Card className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <SearchX className="h-6 w-6 text-[#9AA3B5]" aria-hidden />
                </span>
                <p className="text-sm text-[#C6CDDC]">
                  {t('admin.dash.emptyFiltered')}
                </p>
              </Card>
            ) : (
              <div className="animate-ss-fade-in overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">
                <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#9AA3B5]">
                  <span>{t('admin.dash.col.date')}</span>
                  <span>{t('admin.dash.col.score')}</span>
                </div>
                {filtered.map((r, index) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className={`w-full border-b border-white/[0.04] text-left transition-colors duration-150 last:border-0 hover:bg-[#3B6EF5]/[0.08] ${
                      index % 2 === 1 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {formatDate(r.createdAt)}
                          </span>
                          <StatusChip
                            status={r.statusMahasiswa ?? ''}
                            lang={lang}
                          />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[#9AA3B5]">
                          {r.angkatan ?? '—'} · {r.programStudi ?? '—'}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-white">
                        {r.manfaatKeseluruhan}/5
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal detail respons — bottom-sheet di mobile, dialog di layar lebar */}
      {selected && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('admin.dash.detail.title')}
            className="animate-ss-pop-in relative max-h-[86vh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#111726] p-5 shadow-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 flex items-start justify-between gap-3 border-b border-white/[0.06] bg-[#111726] px-5 pb-3.5 pt-5">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white">
                  {t('admin.dash.detail.title')}
                </h2>
                <p className="mt-0.5 text-xs text-[#9AA3B5]">
                  {t('admin.dash.detail.subtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={t('admin.dash.close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#9AA3B5] transition-all duration-150 hover:bg-white/[0.08] hover:text-white active:scale-[0.97]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <DetailSection num={1} title={t('section1.title')}>
                <DetailRow label={t('q1.title')}>
                  {labelOf(STATUS_OPTIONS, selected.statusMahasiswa, lang)}
                </DetailRow>
                <DetailRow label={t('q2.title')}>{selected.angkatan || '—'}</DetailRow>
                <DetailRow label={t('q3.title')}>
                  {selected.programStudi || '—'}
                </DetailRow>
                <DetailRow label={t('q4.title')}>
                  {labelOf(WA_GROUP_OPTIONS, selected.jumlahGrupWa, lang)}
                </DetailRow>
                <DetailRow label={t('q5.title')}>
                  {sumberInfoText(selected) || '—'}
                </DetailRow>
              </DetailSection>

              <DetailSection num={2} title={t('section2.title')}>
                <DetailRow label={t('q6.title')}>
                  <ScaleSubList
                    rows={KEJADIAN_ROWS}
                    columns={KEJADIAN_COLS}
                    values={selected.kejadian}
                    lang={lang}
                  />
                </DetailRow>
                <DetailRow label={t('q7.title')}>
                  {penyebabText(selected) || '—'}
                </DetailRow>
                <DetailRow label={t('q8.title')}>{selected.wifiHambatan}/5</DetailRow>
                <DetailRow label={t('q9.title')}>
                  {selected.sulitTempatBelajar}/5
                </DetailRow>
                <DetailRow label={t('q10.title')}>
                  {selected.sulitBahasa != null
                    ? `${selected.sulitBahasa}/5`
                    : t('common.notAnswered')}
                </DetailRow>
              </DetailSection>

              <DetailSection num={3} title={t('section3.title')}>
                <DetailRow label={t('q11.title')}>
                  <ScaleSubList
                    rows={KEBERMANFAATAN_ROWS}
                    columns={HELPFUL_COLS}
                    values={selected.kebermanfaatan}
                    lang={lang}
                  />
                </DetailRow>
                <DetailRow label={t('q12.title')}>
                  {selected.manfaatKeseluruhan}/5
                </DetailRow>
                <DetailRow label={t('q13.title')}>
                  {labelOf(TRIAL_OPTIONS, selected.bersediaUjiCoba, lang)}
                </DetailRow>
                <DetailRow label={t('q14.title')}>
                  {selected.fiturTambahan || t('common.notAnswered')}
                </DetailRow>
                <DetailRow label={t('q15.title')}>
                  {selected.kontak || t('common.notAnswered')}
                </DetailRow>
              </DetailSection>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
