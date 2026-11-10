'use client'

// Halaman publik survei — wizard 3 bagian, bilingual, validasi inline.
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { useLang, useToast } from '@/components/providers'
import {
  CTAButton,
  Container,
  GhostButton,
  PageShell,
  ProgressBar,
  QuestionCard,
  SurveyHeader,
  TextInput,
  Textarea,
} from '@/components/survey/ui'
import {
  AccordionMatrix,
  CheckboxGroup,
  RadioGroup,
  ScaleSelector,
  SelectDropdown,
  type ChoiceOption,
} from '@/components/survey/choices'
import { submitSurvey } from '@/lib/api'
import {
  ANGKATAN_OPTIONS,
  HELPFUL_COLS,
  KEJADIAN_COLS,
  KEJADIAN_ROWS,
  KEBERMANFAATAN_ROWS,
  OTHER_KEY,
  PENYEBAB_OPTIONS,
  STATUS_OPTIONS,
  SUMBER_INFO_OPTIONS,
  TRIAL_OPTIONS,
  WA_GROUP_OPTIONS,
  type Option,
} from '@/lib/survey-options'
import type { SurveyFormData } from '@/lib/types'
import type { TKey } from '@/lib/i18n'
import { isValidEmail } from '@/lib/validation'

// ---------- State ----------

interface SurveyState {
  statusMahasiswa: string
  angkatan: string
  programStudi: string
  jumlahGrupWa: string
  sumberInfo: string[]
  sumberInfoLainnya: string
  kejadian: Record<string, number>
  penyebabUtama: string[]
  penyebabLainnya: string
  wifiHambatan: number
  sulitTempatBelajar: number
  sulitBahasa: number
  kebermanfaatan: Record<string, number>
  manfaatKeseluruhan: number
  bersediaUjiCoba: string
  fiturTambahan: string
  kontak: string
}

const INITIAL_STATE: SurveyState = {
  statusMahasiswa: '',
  angkatan: '',
  programStudi: '',
  jumlahGrupWa: '',
  sumberInfo: [],
  sumberInfoLainnya: '',
  kejadian: {},
  penyebabUtama: [],
  penyebabLainnya: '',
  wifiHambatan: 0,
  sulitTempatBelajar: 0,
  sulitBahasa: 0,
  kebermanfaatan: {},
  manfaatKeseluruhan: 0,
  bersediaUjiCoba: '',
  fiturTambahan: '',
  kontak: '',
}

type ErrorKey = 'required' | 'selectOne' | 'answerAll' | 'invalidEmail'
type FieldErrors = Partial<Record<string, ErrorKey>>

function validateStep(step: number, s: SurveyState): FieldErrors {
  const errors: FieldErrors = {}
  if (step === 0) {
    if (!s.statusMahasiswa) errors.statusMahasiswa = 'required'
    if (!s.angkatan) errors.angkatan = 'required'
    if (!s.programStudi.trim()) errors.programStudi = 'required'
  } else if (step === 1) {
    if (!s.jumlahGrupWa) errors.jumlahGrupWa = 'required'
    if (s.sumberInfo.length === 0) errors.sumberInfo = 'selectOne'
    if (KEJADIAN_ROWS.some((row) => s.kejadian[row.value] == null)) errors.kejadian = 'answerAll'
    if (s.penyebabUtama.length === 0) errors.penyebabUtama = 'selectOne'
    if (s.wifiHambatan === 0) errors.wifiHambatan = 'required'
    if (s.sulitTempatBelajar === 0) errors.sulitTempatBelajar = 'required'
  } else if (step === 2) {
    if (KEBERMANFAATAN_ROWS.some((row) => s.kebermanfaatan[row.value] == null))
      errors.kebermanfaatan = 'answerAll'
    if (s.manfaatKeseluruhan === 0) errors.manfaatKeseluruhan = 'required'
    if (!s.bersediaUjiCoba) errors.bersediaUjiCoba = 'required'
    if (!s.kontak.trim()) errors.kontak = 'required'
    else if (!isValidEmail(s.kontak)) errors.kontak = 'invalidEmail'
  }
  return errors
}

const ERROR_MESSAGE_KEY: Record<ErrorKey, TKey> = {
  required: 'error.required',
  selectOne: 'error.selectOne',
  answerAll: 'error.answerAll',
  invalidEmail: 'error.invalidEmail',
}

// ---------- Page ----------

export default function SurveyPage() {
  const { lang, t } = useLang()
  const toast = useToast()

  const [form, setForm] = useState<SurveyState>(INITIAL_STATE)
  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, submitted])

  const stepErrors = useMemo(() => validateStep(step, form), [step, form])
  const stepValid = Object.keys(stepErrors).length === 0

  const opts = (options: Option[]): ChoiceOption[] =>
    options.map((o) => ({ value: o.value, label: o.label[lang] }))

  const touch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }))
  const errorFor = (field: string): string | undefined => {
    const key = stepErrors[field]
    if (!key || !touched[field]) return undefined
    return t(ERROR_MESSAGE_KEY[key])
  }

  const update = <K extends keyof SurveyState>(field: K, value: SurveyState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    touch(field as string)
  }

  const touchStepFields = () => {
    const fieldsByStep = [
      ['statusMahasiswa', 'angkatan', 'programStudi'],
      ['jumlahGrupWa', 'sumberInfo', 'kejadian', 'penyebabUtama', 'wifiHambatan', 'sulitTempatBelajar'],
      ['kebermanfaatan', 'manfaatKeseluruhan', 'bersediaUjiCoba', 'kontak'],
    ]
    setTouched((previous) => ({
      ...previous,
      ...Object.fromEntries(fieldsByStep[step].map((field) => [field, true])),
    }))
  }

  const goNext = () => {
    if (!stepValid) {
      touchStepFields()
      return
    }
    setStep((prev) => Math.min(prev + 1, 2))
  }

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0))

  const handleSubmit = async () => {
    if (submitting) return
    if (!stepValid) {
      touchStepFields()
      return
    }
    setSubmitting(true)
    try {
      const payload: SurveyFormData = {
        statusMahasiswa: form.statusMahasiswa,
        angkatan: form.angkatan,
        programStudi: form.programStudi.trim(),
        jumlahGrupWa: form.jumlahGrupWa,
        sumberInfo: form.sumberInfo,
        sumberInfoLainnya:
          form.sumberInfo.includes(OTHER_KEY) && form.sumberInfoLainnya.trim()
            ? form.sumberInfoLainnya.trim()
            : null,
        kejadian: form.kejadian,
        penyebabUtama: form.penyebabUtama,
        penyebabLainnya:
          form.penyebabUtama.includes(OTHER_KEY) && form.penyebabLainnya.trim()
            ? form.penyebabLainnya.trim()
            : null,
        wifiHambatan: form.wifiHambatan,
        sulitTempatBelajar: form.sulitTempatBelajar,
        sulitBahasa:
          form.statusMahasiswa === 'international' && form.sulitBahasa > 0
            ? form.sulitBahasa
            : null,
        kebermanfaatan: form.kebermanfaatan,
        manfaatKeseluruhan: form.manfaatKeseluruhan,
        bersediaUjiCoba: form.bersediaUjiCoba,
        fiturTambahan: form.fiturTambahan.trim() || null,
        kontak: form.kontak.trim(),
      }
      await submitSurvey(payload)
      toast.success(t('toast.success'))
      setSubmitted(true)
    } catch {
      toast.error(t('toast.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const resetSurvey = () => {
    setForm(INITIAL_STATE)
    setTouched({})
    setStep(0)
    setSubmitted(false)
  }

  const isInternational = form.statusMahasiswa === 'international'
  const kejadianAnswered = KEJADIAN_ROWS.filter((r) => form.kejadian[r.value] != null).length
  const manfaatAnswered = KEBERMANFAATAN_ROWS.filter(
    (r) => form.kebermanfaatan[r.value] != null,
  ).length

  return (
    <PageShell>
      <SurveyHeader />

      {submitted ? (
        <ThankYouView onAgain={resetSurvey} />
      ) : (
        <main className="relative z-10 mx-auto w-full max-w-[480px] flex-1 px-5 pb-4 pt-6">
          {/* Kartu intro */}
          <Container className="animate-ss-slide-up mb-5">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
              <h1 className="text-[21px] font-bold leading-snug text-white">{t('survey.title')}</h1>
              <p className="mt-2.5 text-[13px] leading-relaxed text-[#9AA3B5]">{t('survey.desc')}</p>
            </div>
          </Container>

          {/* Progress bagian */}
          <Container className="mb-6">
            <ProgressBar current={step + 1} total={3} label={t('progress.part', { x: step + 1 })} />
          </Container>

          {/* Judul bagian */}
          <Container className="mb-4">
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#7FB2FF]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                {t(`section${step + 1}.title` as TKey)}
              </h2>
            </div>
          </Container>

          <div className="flex flex-col gap-4">
            {/* ============ BAGIAN 1 ============ */}
            {step === 0 && (
              <>
                <QuestionCard
                  num={1}
                  labelledById="q-status"
                  title={t('q1.title')}
                  error={errorFor('statusMahasiswa')}
                >
                  <RadioGroup
                    options={opts(STATUS_OPTIONS)}
                    value={form.statusMahasiswa}
                    onChange={(v) => update('statusMahasiswa', v)}
                    ariaLabel={t('q1.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={2}
                  labelledById="q-angkatan"
                  title={t('q2.title')}
                  error={errorFor('angkatan')}
                >
                  <SelectDropdown
                    options={opts(ANGKATAN_OPTIONS)}
                    value={form.angkatan}
                    onChange={(v) => update('angkatan', v)}
                    placeholder={t('q2.placeholder')}
                    error={Boolean(errorFor('angkatan'))}
                    ariaLabel={t('q2.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={3}
                  labelledById="q-prodi"
                  title={t('q3.title')}
                  error={errorFor('programStudi')}
                >
                  <TextInput
                    value={form.programStudi}
                    onChange={(v) => update('programStudi', v)}
                    placeholder={t('q3.placeholder')}
                    error={Boolean(errorFor('programStudi'))}
                    ariaLabel={t('q3.title')}
                  />
                </QuestionCard>
              </>
            )}

            {/* ============ BAGIAN 2 ============ */}
            {step === 1 && (
              <>
                <QuestionCard
                  num={4}
                  labelledById="q-wa"
                  title={t('q4.title')}
                  error={errorFor('jumlahGrupWa')}
                >
                  <RadioGroup
                    options={opts(WA_GROUP_OPTIONS)}
                    value={form.jumlahGrupWa}
                    onChange={(v) => update('jumlahGrupWa', v)}
                    ariaLabel={t('q4.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={5}
                  labelledById="q-sumber"
                  title={t('q5.title')}
                  error={errorFor('sumberInfo')}
                >
                  <CheckboxGroup
                    options={opts(SUMBER_INFO_OPTIONS)}
                    values={form.sumberInfo}
                    onToggle={(value) => {
                      const next = form.sumberInfo.includes(value)
                        ? form.sumberInfo.filter((v) => v !== value)
                        : [...form.sumberInfo, value]
                      update('sumberInfo', next)
                    }}
                    ariaLabel={t('q5.title')}
                  />
                  {form.sumberInfo.includes(OTHER_KEY) && (
                    <div className="animate-ss-slide-up mt-2.5">
                      <TextInput
                        value={form.sumberInfoLainnya}
                        onChange={(v) => setForm((prev) => ({ ...prev, sumberInfoLainnya: v }))}
                        placeholder={t('q5.otherPlaceholder')}
                        ariaLabel={t('q5.otherPlaceholder')}
                      />
                    </div>
                  )}
                </QuestionCard>

                <QuestionCard
                  num={6}
                  labelledById="q-kejadian"
                  title={t('q6.title')}
                  error={errorFor('kejadian')}
                >
                  <AccordionMatrix
                    rows={KEJADIAN_ROWS.map((r) => ({ key: r.value, label: r.label[lang] }))}
                    columns={KEJADIAN_COLS.map((c) => ({ value: c.value, label: c.label[lang] }))}
                    values={form.kejadian}
                    onChange={(rowKey, value) => {
                      touch('kejadian')
                      setForm((prev) => ({
                        ...prev,
                        kejadian: { ...prev.kejadian, [rowKey]: value },
                      }))
                    }}
                    answeredLabel={t('matrix.answered', {
                      a: kejadianAnswered,
                      b: KEJADIAN_ROWS.length,
                    })}
                    ariaLabel={t('q6.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={7}
                  labelledById="q-penyebab"
                  title={t('q7.title')}
                  error={errorFor('penyebabUtama')}
                >
                  <CheckboxGroup
                    options={opts(PENYEBAB_OPTIONS)}
                    values={form.penyebabUtama}
                    onToggle={(value) => {
                      const next = form.penyebabUtama.includes(value)
                        ? form.penyebabUtama.filter((v) => v !== value)
                        : [...form.penyebabUtama, value]
                      update('penyebabUtama', next)
                    }}
                    ariaLabel={t('q7.title')}
                  />
                  {form.penyebabUtama.includes(OTHER_KEY) && (
                    <div className="animate-ss-slide-up mt-2.5">
                      <TextInput
                        value={form.penyebabLainnya}
                        onChange={(v) => setForm((prev) => ({ ...prev, penyebabLainnya: v }))}
                        placeholder={t('q7.otherPlaceholder')}
                        ariaLabel={t('q7.otherPlaceholder')}
                      />
                    </div>
                  )}
                </QuestionCard>

                <QuestionCard
                  num={8}
                  labelledById="q-wifi"
                  title={t('q8.title')}
                  error={errorFor('wifiHambatan')}
                >
                  <ScaleSelector
                    value={form.wifiHambatan}
                    onChange={(v) => update('wifiHambatan', v)}
                    leftLabel={t('q8.left')}
                    rightLabel={t('q8.right')}
                    ariaLabel={t('q8.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={9}
                  labelledById="q-belajar"
                  title={t('q9.title')}
                  error={errorFor('sulitTempatBelajar')}
                >
                  <ScaleSelector
                    value={form.sulitTempatBelajar}
                    onChange={(v) => update('sulitTempatBelajar', v)}
                    leftLabel={t('q9.left')}
                    rightLabel={t('q9.right')}
                    ariaLabel={t('q9.title')}
                  />
                </QuestionCard>

                {isInternational && (
                  <QuestionCard
                    num={10}
                    labelledById="q-bahasa"
                    title={t('q10.title')}
                    optionalLabel={t('badge.optional')}
                  >
                    <ScaleSelector
                      value={form.sulitBahasa}
                      onChange={(v) => setForm((prev) => ({ ...prev, sulitBahasa: v }))}
                      leftLabel={t('q10.left')}
                      rightLabel={t('q10.right')}
                      ariaLabel={t('q10.title')}
                    />
                  </QuestionCard>
                )}
              </>
            )}

            {/* ============ BAGIAN 3 ============ */}
            {step === 2 && (
              <>
                {/* Pengantar solusi */}
                <div className="animate-ss-slide-up rounded-3xl border border-[#3B6EF5]/25 bg-[linear-gradient(135deg,rgba(59,110,245,0.14),rgba(127,178,255,0.06))] p-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-lg shadow-[#3B6EF5]/30"
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </span>
                    <p className="text-[13px] leading-relaxed text-[#C6CDDC]">{t('intro3.body')}</p>
                  </div>
                </div>

                <QuestionCard
                  num={11}
                  labelledById="q-manfaat"
                  title={t('q11.title')}
                  error={errorFor('kebermanfaatan')}
                >
                  <AccordionMatrix
                    rows={KEBERMANFAATAN_ROWS.map((r) => ({ key: r.value, label: r.label[lang] }))}
                    columns={HELPFUL_COLS.map((c) => ({ value: c.value, label: c.label[lang] }))}
                    values={form.kebermanfaatan}
                    onChange={(rowKey, value) => {
                      touch('kebermanfaatan')
                      setForm((prev) => ({
                        ...prev,
                        kebermanfaatan: { ...prev.kebermanfaatan, [rowKey]: value },
                      }))
                    }}
                    answeredLabel={t('matrix.answered', {
                      a: manfaatAnswered,
                      b: KEBERMANFAATAN_ROWS.length,
                    })}
                    ariaLabel={t('q11.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={12}
                  labelledById="q-keseluruhan"
                  title={t('q12.title')}
                  error={errorFor('manfaatKeseluruhan')}
                >
                  <ScaleSelector
                    value={form.manfaatKeseluruhan}
                    onChange={(v) => update('manfaatKeseluruhan', v)}
                    leftLabel={t('q12.left')}
                    rightLabel={t('q12.right')}
                    ariaLabel={t('q12.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={13}
                  labelledById="q-uji"
                  title={t('q13.title')}
                  error={errorFor('bersediaUjiCoba')}
                >
                  <RadioGroup
                    options={opts(TRIAL_OPTIONS)}
                    value={form.bersediaUjiCoba}
                    onChange={(v) => update('bersediaUjiCoba', v)}
                    ariaLabel={t('q13.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={14}
                  labelledById="q-fitur"
                  title={t('q14.title')}
                  optionalLabel={t('badge.optional')}
                >
                  <Textarea
                    value={form.fiturTambahan}
                    onChange={(v) => setForm((prev) => ({ ...prev, fiturTambahan: v }))}
                    placeholder={t('q14.placeholder')}
                    ariaLabel={t('q14.title')}
                  />
                </QuestionCard>

                <QuestionCard
                  num={15}
                  labelledById="q-kontak"
                  title={t('q15.title')}
                  error={errorFor('kontak')}
                >
                  <TextInput
                    type="email"
                    required
                    value={form.kontak}
                    onChange={(v) => update('kontak', v)}
                    placeholder={t('q15.placeholder')}
                    ariaLabel={t('q15.title')}
                    error={Boolean(errorFor('kontak'))}
                  />
                </QuestionCard>
              </>
            )}
          </div>

          {/* Navigasi wizard — sticky bottom dengan blur (gradient transparan terhadap klik) */}
          <div className="pointer-events-none sticky bottom-0 -mx-5 mt-6 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/95 to-transparent px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4">
            <div className="pointer-events-auto flex gap-3">
              {step > 0 && (
                <GhostButton onClick={goBack} className="w-[38%] shrink-0">
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  {t('btn.back')}
                </GhostButton>
              )}
              {step < 2 ? (
                <CTAButton onClick={goNext} className="flex-1">
                  {t('btn.next')}
                </CTAButton>
              ) : (
                <CTAButton onClick={handleSubmit} loading={submitting} className="flex-1">
                  {submitting ? t('btn.submitting') : t('btn.submit')}
                </CTAButton>
              )}
            </div>
          </div>
        </main>
      )}
    </PageShell>
  )
}

// ---------- Halaman Terima Kasih ----------

function ThankYouView({ onAgain }: { onAgain: () => void }) {
  const { t } = useLang()
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-ss-scale-in">
        <span
          aria-hidden
          className="flex h-28 w-28 items-center justify-center rounded-full border border-[#3B6EF5]/30 bg-[#3B6EF5]/10"
          style={{ boxShadow: '0 0 60px rgba(59,110,245,0.35)' }}
        >
          <CheckCircle2Big />
        </span>
      </div>
      <h1 className="animate-ss-slide-up mt-7 text-2xl font-bold text-white">{t('thanks.title')}</h1>
      <p className="animate-ss-slide-up mt-3 max-w-[340px] text-sm leading-relaxed text-[#9AA3B5]">
        {t('thanks.body')}
      </p>
      <div className="animate-ss-slide-up mt-8 w-full max-w-[320px]">
        <CTAButton onClick={onAgain}>{t('thanks.again')}</CTAButton>
      </div>
    </main>
  )
}

function CheckCircle2Big() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#ss-check-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="ss-check-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B6EF5" />
          <stop offset="100%" stopColor="#7FB2FF" />
        </linearGradient>
      </defs>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
