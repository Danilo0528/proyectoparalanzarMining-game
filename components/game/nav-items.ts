import {
  Gift,
  Pickaxe,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { TabType } from '@/lib/game/types'

export type NavItem = {
  id: TabType
  label: string
  shortLabel: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'miners', label: 'Miners', shortLabel: 'Miners', icon: Pickaxe },
  { id: 'bonus', label: 'Bonus', shortLabel: 'Bonus', icon: Gift },
  { id: 'finance', label: 'Finance', shortLabel: 'Wallet', icon: Wallet },
  { id: 'partners', label: 'Partners', shortLabel: 'Partners', icon: Users },
  { id: 'leaderboard', label: 'Leaderboard', shortLabel: 'Top 10', icon: Trophy },
]
