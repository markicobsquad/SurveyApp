'use client'

// Halaman login admin — gerbang password sederhana menuju dashboard hasil survei.
// Komponen murni (tanpa file route): di-mount oleh router di luar file ini.
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { useLang, useToast } from '@/components/providers'
import {
  isAdminSession,
  setAdminSession,
} from '@/lib/admin-auth'
import {
  CTAButton,
  Card,
  FieldError,
  GhostButton,
  LanguageToggle,
  PageShell,
  TextInput,
} from '@/components/survey/ui'

export default function AdminLoginPage() {
  const { lang, t } = useLang()
  const { success, error } = useToast()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [checking, setChecking] = useState(false)
  const [wrong, setWrong] = useState(false)

  // Lazy init: komponen hanya di-mount client-side setelah hydrasi (page.tsx),
  // jadi membaca sessionStorage di sini aman tanpa setState-in-effect.
  const [alreadyAuthed] = useState(() => isAdminSession())

  // Guard: kalau sudah login, langsung terbang ke dashboard.
  useEffect(() => {
    if (alreadyAuthed) {
      router.replace('/admin/dashboard')
    }
  }, [alreadyAuthed, router])

  const handleChange = (value: string) => {
    setPassword(value)
    if (wrong) setWrong(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (checking) return
    setChecking(true)
    // Jeda kecil agar tombol terasa memeriksa (UX guard sederhana).
    await new Promise((resolve) => setTimeout(resolve, 150))
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) throw new Error('LOGIN_FAILED')
      setAdminSession()
      success(t('admin.toast.welcome'))
      router.replace('/admin/dashboard')
    } catch {
      setWrong(true)
      error(t('admin.login.error'))
    } finally {
      setChecking(false)
    }
  }

  if (alreadyAuthed) {
    return (
      <PageShell>
        <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 items-center justify-center px-5 pb-12 pt-6">
          <Loader2 className="h-6 w-6 animate-spin text-[#7FB2FF]" aria-hidden />
        </main>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <header className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-lg shadow-[#3B6EF5]/30">
              <LockKeyhole className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                {t('admin.login.title')}
              </p>
              <p className="text-[11px] leading-tight text-[#9AA3B5]">
                {t('app.brand')}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[480px] flex-1 px-5 pb-12 pt-6">
        <Card className="mt-8 animate-ss-slide-up">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-[0_0_18px_rgba(59,110,245,0.5)]">
              <ShieldCheck className="h-6 w-6 text-white" aria-hidden />
            </span>
            <h1 className="mt-4 text-xl font-bold text-white">
              {t('admin.login.title')}
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[#9AA3B5]">
              {t('admin.login.subtitle')}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9AA3B5]">
                {t('admin.login.label')}
              </p>
              <div className="relative">
                <TextInput
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  placeholder={t('admin.login.placeholder')}
                  autoComplete="current-password"
                  ariaLabel={t('admin.login.label')}
                  error={wrong}
                />
                <button
                  type="button"
                  onClick={() => setShow((prev) => !prev)}
                  aria-label={
                    show
                      ? lang === 'id'
                        ? 'Sembunyikan password'
                        : 'Hide password'
                      : lang === 'id'
                        ? 'Tampilkan password'
                        : 'Show password'
                  }
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-[#9AA3B5] transition-all duration-150 hover:text-white active:scale-[0.97]"
                >
                  {show ? (
                    <EyeOff className="h-5 w-5" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden />
                  )}
                </button>
              </div>
              {wrong && <FieldError message={t('admin.login.error')} />}
            </div>

            <CTAButton type="submit" loading={checking} disabled={!password.trim()}>
              {checking ? t('admin.login.submitting') : t('admin.login.submit')}
            </CTAButton>
          </form>
        </Card>

        <GhostButton onClick={() => router.push('/')} className="mt-4">
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {t('admin.login.back')}
        </GhostButton>
      </main>
    </PageShell>
  )
}
