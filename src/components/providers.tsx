'use client'

// Providers global: bahasa (ID/EN) + toast + registrasi service worker (PWA).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { translate, type Lang, type TKey } from '@/lib/i18n'

// ---------- Language ----------

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang harus dipakai di dalam AppProviders')
  return ctx
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(
    (onChange) => {
      window.addEventListener('sudo-squad-lang-change', onChange)
      window.addEventListener('storage', onChange)
      return () => {
        window.removeEventListener('sudo-squad-lang-change', onChange)
        window.removeEventListener('storage', onChange)
      }
    },
    () => {
      try {
        return localStorage.getItem('sudo-squad-lang') === 'en' ? 'en' : 'id'
      } catch {
        return 'id'
      }
    },
    () => 'id',
  )

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem('sudo-squad-lang', next)
      window.dispatchEvent(new Event('sudo-squad-lang-change'))
    } catch {
      // Keep the default language when storage is unavailable.
    }
  }, [])

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// ---------- Toast ----------

type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam AppProviders')
  return ctx
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev.slice(-2), { id, type, message }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 3200)
  }, [])

  const value = useMemo(
    () => ({
      success: (message: string) => push(message, 'success'),
      error: (message: string) => push(message, 'error'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`animate-ss-toast-in pointer-events-auto flex w-full max-w-[440px] items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-md ${
              item.type === 'success'
                ? 'border-emerald-400/25 bg-[#101a24]/95'
                : 'border-red-400/30 bg-[#1d1218]/95'
            }`}
          >
            {item.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden />
            )}
            <span className="text-sm font-medium text-white">{item.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ---------- Root providers ----------

export function AppProviders({ children }: { children: ReactNode }) {
  // Registrasi service worker untuk PWA (installable + offline shell).
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA opsional — kegagalan registrasi tidak mengganggu app
      })
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
    return () => window.removeEventListener('load', register)
  }, [])

  return (
    <LanguageProvider>
      <ToastProvider>{children}</ToastProvider>
    </LanguageProvider>
  )
}
