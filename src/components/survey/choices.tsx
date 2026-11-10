'use client'

// Komponen pilihan interaktif custom — TANPA elemen native browser:
// radio, checkbox, dropdown, scale/Likert 1–5, dan accordion matrix.
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export interface ChoiceOption {
  value: string
  label: string
}

export interface MatrixColumn {
  value: number
  label: string
}

// ---------- Radio ----------

/** Custom radio: dot gradient + ring glow saat aktif. */
export function RadioGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: ChoiceOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`flex min-h-[48px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
              selected
                ? 'border-[#3B6EF5]/50 bg-[#3B6EF5]/[0.12] shadow-[0_0_20px_rgba(59,110,245,0.15)]'
                : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <span
              aria-hidden
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
                selected
                  ? 'border-[#7FB2FF] shadow-[0_0_10px_rgba(59,110,245,0.55)]'
                  : 'border-white/25'
              }`}
            >
              {selected && (
                <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)]" />
              )}
            </span>
            <span
              className={`text-sm transition-colors duration-150 ${
                selected ? 'font-semibold text-white' : 'text-[#C6CDDC]'
              }`}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ---------- Checkbox ----------

/** Custom checkbox: kotak rounded + icon Check saat aktif. */
export function CheckboxGroup({
  options,
  values,
  onToggle,
  ariaLabel,
}: {
  options: ChoiceOption[]
  values: string[]
  onToggle: (value: string) => void
  ariaLabel?: string
}) {
  return (
    <div className="flex flex-col gap-2" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const checked = values.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => onToggle(opt.value)}
            className={`flex min-h-[48px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
              checked
                ? 'border-[#3B6EF5]/50 bg-[#3B6EF5]/[0.12] shadow-[0_0_20px_rgba(59,110,245,0.15)]'
                : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
          >
            <span
              aria-hidden
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-150 ${
                checked
                  ? 'border-transparent bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] shadow-[0_0_10px_rgba(59,110,245,0.45)]'
                  : 'border-white/25'
              }`}
            >
              {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </span>
            <span
              className={`text-sm transition-colors duration-150 ${
                checked ? 'font-semibold text-white' : 'text-[#C6CDDC]'
              }`}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ---------- Dropdown ----------

/** Custom dropdown: trigger rounded + panel fade/scale + checkmark item terpilih. */
export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder,
  error = false,
  ariaLabel,
}: {
  options: ChoiceOption[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: boolean
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-2xl border px-4 text-left transition-all duration-150 ease-out active:scale-[0.99] ${
          error
            ? 'border-red-400/50'
            : open
              ? 'border-[#3B6EF5]/60 bg-white/[0.06] ring-2 ring-[#3B6EF5]/20'
              : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06]'
        }`}
      >
        <span
          className={`truncate text-sm ${selected ? 'font-medium text-white' : 'text-white/35'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#9AA3B5] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="animate-ss-pop-in absolute inset-x-0 top-[calc(100%+6px)] z-30 origin-top overflow-hidden rounded-2xl border border-white/10 bg-[#141A2B]/[0.97] shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto p-1.5">
            {options.map((opt) => {
              const active = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ${
                    active
                      ? 'bg-[#3B6EF5]/15 font-semibold text-white'
                      : 'text-[#C6CDDC] hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <Check className="h-4 w-4 shrink-0 text-[#7FB2FF]" strokeWidth={3} aria-hidden />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Scale / Likert 1–5 ----------

/** Scale selector custom: tombol bulat berjajar dengan track tipis, bukan slider native. */
export function ScaleSelector({
  value,
  onChange,
  leftLabel,
  rightLabel,
  count = 5,
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  leftLabel: string
  rightLabel: string
  count?: number
  ariaLabel?: string
}) {
  const steps = Array.from({ length: count }, (_, i) => i + 1)
  return (
    <div role="radiogroup" aria-label={ariaLabel}>
      <div className="relative">
        <div aria-hidden className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-white/[0.07]" />
        <div className="relative flex items-center justify-between gap-1.5">
          {steps.map((n) => {
            const active = value === n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${ariaLabel ?? 'Skala'}: ${n}`}
                onClick={() => onChange(n)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-150 ease-out active:scale-[0.92] ${
                  active
                    ? 'scale-105 bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)] text-white shadow-[0_0_18px_rgba(59,110,245,0.5)]'
                    : 'border border-white/[0.1] bg-[#121828] text-[#9AA3B5] hover:border-white/25 hover:text-white'
                }`}
              >
                {n}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-3 text-[11px] font-medium leading-tight text-[#9AA3B5]">
        <span className="max-w-[42%] text-left">{leftLabel}</span>
        <span className="max-w-[42%] text-right">{rightLabel}</span>
      </div>
    </div>
  )
}

// ---------- Accordion Matrix ----------

export interface MatrixRow {
  key: string
  label: string
}

/** Matrix radio per-baris sebagai accordion (mobile-friendly), dengan badge jawaban terpilih. */
export function AccordionMatrix({
  rows,
  columns,
  values,
  onChange,
  answeredLabel,
  ariaLabel,
}: {
  rows: MatrixRow[]
  columns: MatrixColumn[]
  values: Record<string, number>
  onChange: (rowKey: string, value: number) => void
  answeredLabel: string
  ariaLabel?: string
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const answered = rows.filter((row) => values[row.key] != null).length
  const allAnswered = answered === rows.length

  return (
    <div role="group" aria-label={ariaLabel}>
      <div className="mb-2 flex justify-end">
        <span
          className={`text-[11px] font-semibold ${allAnswered ? 'text-emerald-400' : 'text-[#9AA3B5]'}`}
        >
          {answeredLabel}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => {
          const open = openKey === row.key
          const selected = values[row.key]
          const selectedColumn = selected != null
            ? columns.find((c) => c.value === selected)
            : undefined
          return (
            <div
              key={row.key}
              className={`overflow-hidden rounded-2xl border transition-colors duration-150 ${
                selected != null
                  ? 'border-[#3B6EF5]/40 bg-[#3B6EF5]/[0.07]'
                  : 'border-white/[0.08] bg-white/[0.03]'
              }`}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenKey(open ? null : row.key)}
                className="flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  className={`flex-1 text-sm leading-snug transition-colors duration-150 ${
                    selected != null ? 'font-medium text-white' : 'text-[#C6CDDC]'
                  }`}
                >
                  {row.label}
                </span>
                {selectedColumn && (
                  <span className="animate-ss-pop-in shrink-0 rounded-full bg-[#3B6EF5]/20 px-2.5 py-1 text-[11px] font-semibold text-[#9DBAFF]">
                    {selectedColumn.label}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#9AA3B5] transition-transform duration-200 ${
                    open ? 'rotate-180' : ''
                  }`}
                  aria-hidden
                />
              </button>
              <div className="ss-accordion" data-open={open}>
                <div>
                  <div className="flex flex-col gap-1 px-3 pb-3 pt-1">
                    {columns.map((col) => {
                      const active = selected === col.value
                      return (
                        <button
                          key={col.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => onChange(row.key, col.value)}
                          className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
                            active ? 'bg-[#3B6EF5]/15' : 'hover:bg-white/[0.05]'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
                              active
                                ? 'border-[#7FB2FF] shadow-[0_0_8px_rgba(59,110,245,0.5)]'
                                : 'border-white/25'
                            }`}
                          >
                            {active && (
                              <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#3B6EF5,#7FB2FF)]" />
                            )}
                          </span>
                          <span
                            className={`text-sm transition-colors duration-150 ${
                              active ? 'font-semibold text-white' : 'text-[#C6CDDC]'
                            }`}
                          >
                            {col.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
