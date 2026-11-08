'use client'

import type { ReactNode } from 'react'
import type { TabType } from '@/lib/game/types'
import BottomNav from './bottom-nav'
import TopBar from './top-bar'

interface GameShellProps {
  balance: number
  incomePerSecond: number
  email: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onLogout: () => void
  children: ReactNode
}

export default function GameShell({
  balance,
  incomePerSecond,
  email,
  activeTab,
  onTabChange,
  onLogout,
  children,
}: GameShellProps) {
  return (
    <div className="arcade-bg arcade-grid min-h-screen">
      <TopBar
        balance={balance}
        incomePerSecond={incomePerSecond}
        email={email}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
      />
      <main id="main" className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:px-8 md:pb-12">
        {children}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
