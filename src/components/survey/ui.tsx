'use client'

// Komponen UI dasar bergaya "finance app premium" — dark theme, card glass,
// CTA gradient biru, micro-interaction 150–200ms.
import { type ReactNode } from 'react'
import { AlertCircle, ListChecks, Loader2 } from 'lucide-react'
import { useLang } from '@/components/providers'

// ---------- Shell ----------

/** Kerangka halaman mobile-first: aura gradient, container 480px, footer sticky. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="ss-app relative flex min-h-screen flex-col bg-[#0A0E1A] text-white">
      <div className="ss-aura" aria-hidden="true" />
      <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
      <AppFooter />
    </div>
  )
}

/** Footer sticky: menempel di bawah saat konten pendek, terdorong alami saat konten panjang. */
export function AppFooter() {
  const { t } = useLang()
  return (
    <footer className="relative z-10 mt-auto px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-10 text-center">
      <p className="text-xs leading-relaxed text-[#9AA3B5]">{t('footer.text')}</p>
      <p className="mt-1 text-[11px] text-white/30">{t('footer.copyright')}</p>
    </footer>
  )
}

/** Header aplikasi: brand + toggle bahasa. */
export function SurveyHeader() {
  const { t } = useLang()
  return (
    <header className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-lg shadow-[#3B6EF5]/30">
            <ListChecks className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-white">{t('app.name')}</p>
            <p className="text-[11px] leading-tight text-[#9AA3B5]">{t('app.brand')}</p>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  )
}

// ---------- Layout helpers ----------

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[480px] ${className ?? ''}`}>{children}</div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

// ---------- Buttons ----------

interface CTAButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  className?: string
}

/** CTA utama: full-width, rounded-full, gradient biru, tap scale(0.97). */
export function CTAButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className,
}: CTAButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#3B6EF5,#7FB2FF)] text-[15px] font-bold text-white shadow-lg shadow-[#3B6EF5]/25 transition-all duration-150 ease-out hover:brightness-110 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${className ?? ''}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

/** Tombol sekunder (ghost) untuk aksi seperti "Kembali". */
export function GhostButton({
  children,
  onClick,
  disabled = false,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] text-[15px] font-semibold text-white/80 transition-all duration-150 ease-out hover:bg-white/[0.08] hover:text-white active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

// ---------- Form primitives ----------

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  error?: boolean
  ariaLabel?: string
  autoComplete?: string
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
  ariaLabel,
  autoComplete,
}: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      aria-label={ariaLabel}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-12 w-full rounded-2xl border bg-white/[0.04] px-4 text-sm text-white outline-none transition-all duration-150 placeholder:text-white/30 focus:ring-2 ${
        error
          ? 'border-red-400/50 focus:border-red-400/60 focus:ring-red-400/15'
          : 'border-white/[0.08] focus:border-[#3B6EF5]/60 focus:ring-[#3B6EF5]/20 hover:bg-white/[0.06]'
      }`}
    />
  )
}

interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  ariaLabel?: string
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  ariaLabel,
}: TextareaProps) {
  return (
    <textarea
      value={value}
      rows={rows}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-all duration-150 placeholder:text-white/30 hover:bg-white/[0.06] focus:border-[#3B6EF5]/60 focus:ring-2 focus:ring-[#3B6EF5]/20"
    />
  )
}

/** Pesan error inline di bawah sebuah field. */
export function FieldError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="animate-ss-fade-in mt-2.5 flex items-center gap-1.5 text-xs font-medium text-red-400"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  )
}

// ---------- Question block ----------

interface QuestionCardProps {
  num?: number
  title: string
  optionalLabel?: string
  error?: string
  labelledById: string
  children: ReactNode
}

/** Kartu pertanyaan: nomor, judul, badge opsional, isi, dan error inline. */
export function QuestionCard({
  num,
  title,
  optionalLabel,
  error,
  labelledById,
  children,
}: QuestionCardProps) {
  return (
    <section
      aria-labelledby={labelledById}
      className="animate-ss-slide-up rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5"
    >
      <div className="mb-3.5 flex items-start gap-2.5">
        {num !== undefined && (
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3B6EF5]/15 text-xs font-bold text-[#7FB2FF]"
          >
            {num}
          </span>
        )}
        <h3
          id={labelledById}
          className="flex-1 text-[15px] font-semibold leading-snug text-white"
        >
          {title}
        </h3>
        {optionalLabel && (
          <span className="mt-0.5 shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#9AA3B5]">
            {optionalLabel}
          </span>
        )}
      </div>
      {children}
      {error && <FieldError message={error} />}
    </section>
  )
}

// ---------- Progress ----------

/** Progress bar ala onboarding: garis gradient + dot indikator bagian. */
export function ProgressBar({
  current,
  total,
  label,
}: {
  current: number
  total: number
  label: string
}) {
  const pct = total > 1 ? ((current - 1) / (total - 1)) * 100 : 100
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9AA3B5]">
          {label}
        </span>
        <span className="text-xs font-semibold text-white/60">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="relative h-1 rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#3B6EF5,#7FB2FF)] transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
          const passed = step < current
          const active = step === current
          return (
            <span
              key={step}
              aria-hidden
              className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out ${
                active
                  ? 'border-[#7FB2FF] bg-[#3B6EF5] shadow-[0_0_12px_rgba(59,110,245,0.7)]'
                  : passed
                    ? 'border-transparent bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)]'
                    : 'border-white/25 bg-[#0A0E1A]'
              }`}
              style={{
                left: `${total > 1 ? ((step - 1) / (total - 1)) * 100 : 100}%`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ---------- Language toggle ----------

/** Segmented control pill ala toggle "Premium/infinity" dengan thumb gradient bergeser. */
export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div
      role="radiogroup"
      aria-label="Bahasa / Language"
      className="relative flex h-9 items-center rounded-full border border-white/10 bg-white/[0.05] p-1"
    >
      <span
        aria-hidden
        className={`absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-[linear-gradient(90deg,#3B6EF5,#7FB2FF)] shadow-md shadow-[#3B6EF5]/30 transition-transform duration-200 ease-out ${
          lang === 'en' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {(['id', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={lang === l}
          onClick={() => setLang(l)}
          className={`relative z-10 h-7 w-12 rounded-full text-xs font-bold transition-colors duration-150 ${
            lang === l ? 'text-white' : 'text-[#9AA3B5] hover:text-white/80'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
