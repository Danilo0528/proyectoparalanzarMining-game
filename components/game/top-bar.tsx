'use client'

import Image from 'next/image'
import { LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TabType } from '@/lib/game/types'
import { NAV_ITEMS } from './nav-items'
import { CoinAmount } from './ui'

interface TopBarProps {
  balance: number
  incomePerSecond: number
  email: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onLogout: () => void
}

export default function TopBar({
  balance,
  incomePerSecond,
  email,
  activeTab,
  onTabChange,
  onLogout,
}: TopBarProps) {
  const initial = email ? email.charAt(0).toUpperCase() : 'M'

  return (
    <header className="sticky top-0 z-40 border-b border-arcade-border/70 bg-arcade-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        <a href="#main" className="flex items-center gap-2.5" aria-label="Melqo home">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-arcade-gold/30 bg-arcade-raised shadow-[0_0_24px_-6px_rgba(247,183,51,0.6)]">
            <Image
              src="/images/mine-icon.png"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
            />
          </span>
          <span className="font-display text-xl tracking-[0.18em] text-arcade-text">
            MEL<span className="text-arcade-gold text-glow-gold">QO</span>
          </span>
        </a>

        <div className="ml-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-arcade-gold/30 bg-arcade-gold/10 px-3 py-1.5">
            <CoinAmount value={balance.toLocaleString()} className="text-sm text-arcade-gold sm:text-base" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-arcade-cyan/25 bg-arcade-cyan/10 px-3 py-1.5 text-xs text-arcade-cyan sm:flex">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-semibold tabular-nums">{incomePerSecond.toFixed(4)}</span>
            <span className="text-arcade-muted">/sec</span>
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-arcade-gold/15 text-arcade-gold'
                    : 'text-arcade-muted hover:bg-white/5 hover:text-arcade-text',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="hidden items-center gap-2 rounded-xl border border-arcade-border bg-arcade-raised px-2.5 py-1.5 lg:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-arcade-violet to-arcade-cyan text-xs font-bold text-white">
              {initial}
            </span>
            <span className="max-w-[150px] truncate text-xs text-arcade-muted">{email}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-arcade-border bg-arcade-raised px-2.5 text-sm text-arcade-muted transition-colors hover:border-arcade-danger/40 hover:text-arcade-danger"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
