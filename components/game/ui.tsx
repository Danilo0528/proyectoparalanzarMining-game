import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ArcadeCard({
  children,
  className,
  raised = false,
}: {
  children: ReactNode
  className?: string
  raised?: boolean
}) {
  return (
    <div className={cn(raised ? 'arcade-card-raised' : 'arcade-card', className)}>
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-arcade-border bg-arcade-raised text-arcade-gold">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-arcade-muted">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-xl tracking-wide text-arcade-text sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-arcade-muted">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'gold',
  className,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: ReactNode
  hint?: string
  tone?: 'gold' | 'violet' | 'cyan' | 'green'
  className?: string
}) {
  const toneClasses = {
    gold: 'text-arcade-gold border-arcade-gold/25 bg-arcade-gold/10',
    violet: 'text-arcade-violet border-arcade-violet/30 bg-arcade-violet/10',
    cyan: 'text-arcade-cyan border-arcade-cyan/30 bg-arcade-cyan/10',
    green: 'text-arcade-green border-arcade-green/30 bg-arcade-green/10',
  }[tone]

  return (
    <div className={cn('arcade-card flex items-center gap-3 px-4 py-3', className)}>
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', toneClasses)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-arcade-muted">
          {label}
        </p>
        <p className="font-display text-lg leading-tight text-arcade-text">{value}</p>
        {hint ? <p className="truncate text-xs text-arcade-muted">{hint}</p> : null}
      </div>
    </div>
  )
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'gold',
  className,
  label,
}: {
  value: number
  max?: number
  tone?: 'gold' | 'violet' | 'cyan' | 'green'
  className?: string
  label?: string
}) {
  const safeMax = max > 0 ? max : 1
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100))

  const fill = {
    gold: 'from-arcade-gold-soft to-arcade-gold',
    violet: 'from-arcade-violet to-[#a78bfa]',
    cyan: 'from-arcade-cyan to-[#7dd3fc]',
    green: 'from-arcade-green to-[#6ee7b7]',
  }[tone]

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-arcade-muted">
          <span>{label}</span>
          <span className="font-semibold text-arcade-text">{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full border border-arcade-border bg-black/40"
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-500', fill)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-arcade-border bg-black/20 px-6 py-12 text-center">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-border bg-arcade-raised text-arcade-muted">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg text-arcade-text">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-arcade-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

const RARITIES = [
  { max: 62, label: 'Common', className: 'border-slate-500/40 bg-slate-500/15 text-slate-300' },
  { max: 67, label: 'Rare', className: 'border-arcade-cyan/40 bg-arcade-cyan/15 text-arcade-cyan' },
  { max: 72, label: 'Epic', className: 'border-arcade-violet/40 bg-arcade-violet/15 text-[#c4b5fd]' },
  { max: 78, label: 'Legendary', className: 'border-arcade-gold/50 bg-arcade-gold/15 text-arcade-gold' },
  { max: 100, label: 'Mythic', className: 'border-arcade-danger/50 bg-arcade-danger/15 text-arcade-danger' },
]

export function RarityBadge({ percentage, className }: { percentage: number; className?: string }) {
  const rarity = RARITIES.find((entry) => percentage <= entry.max) ?? RARITIES[RARITIES.length - 1]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest',
        rarity.className,
        className,
      )}
    >
      {rarity.label}
    </span>
  )
}

export function CoinAmount({ value, className }: { value: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-display tabular-nums', className)}>
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-b from-arcade-gold-soft to-arcade-gold text-[9px] font-black text-[#3b2600]">
        $
      </span>
      {value}
    </span>
  )
}
