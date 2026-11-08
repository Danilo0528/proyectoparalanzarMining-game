'use client'

import { cn } from '@/lib/utils'
import type { TabType } from '@/lib/game/types'
import { NAV_ITEMS } from './nav-items'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-arcade-border/80 bg-arcade-bg/95 backdrop-blur-xl md:hidden"
      aria-label="Main"
    >
      <div className="arcade-safe-bottom mx-auto grid max-w-md grid-cols-5 px-1 pt-1">
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
                'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors',
                active ? 'text-arcade-gold' : 'text-arcade-muted active:bg-white/5',
              )}
            >
              {active ? (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-arcade-gold shadow-[0_0_10px_rgba(247,183,51,0.8)]" />
              ) : null}
              <Icon className={cn('h-5 w-5', active && 'drop-shadow-[0_0_8px_rgba(247,183,51,0.6)]')} />
              <span>{item.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
