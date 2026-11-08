export type MinerData = {
  id: string
  name: string
  percentage: number
  perDay: number
  price: number
  owned: number
}

export type IslandData = {
  id: number
  name: string
  unlocked: boolean
  miners: MinerData[]
  totalPurchases: number
  requiredPurchases: number
  maxCapacity: number
  currentEarnings: number
}

export type GameState = {
  balance: number
  islands: IslandData[]
}

export type TabType = "miners" | "bonus" | "finance" | "partners" | "leaderboard"
