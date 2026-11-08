import { calculateMinerEarnings } from "@/lib/economy-config"
import { MAX_MINERS_PER_TYPE } from "./islands"
import type { GameState, IslandData, MinerData } from "./types"

export { MAX_MINERS_PER_TYPE }

/** Income per second for a single miner, taking owned count into account. */
export function getMinerIncomePerSecond(miner: MinerData): number {
  return calculateMinerEarnings(miner.perDay, miner.owned)
}

/** Income per second for one island (all owned miners). */
export function getIslandIncomePerSecond(island: IslandData): number {
  return island.miners.reduce(
    (total, miner) => total + getMinerIncomePerSecond(miner),
    0,
  )
}

/** Aggregate income rates across every unlocked island. */
export function getIncomeRates(islands: IslandData[]) {
  const perDay = islands.reduce((total, island) => {
    if (!island.unlocked) return total
    return (
      total +
      island.miners.reduce((sum, miner) => sum + miner.perDay * miner.owned, 0)
    )
  }, 0)

  return {
    perSecond: perDay / 86400,
    perHour: perDay / 24,
    perDay,
    perMonth: perDay * 30,
  }
}

/** Advance one island by a number of seconds, capped at max capacity. */
export function applyEarningsTick(island: IslandData, seconds = 1): IslandData {
  if (!island.unlocked) return island

  const perSecond = getIslandIncomePerSecond(island)
  if (perSecond <= 0) return island

  return {
    ...island,
    currentEarnings: Math.min(
      island.currentEarnings + perSecond * seconds,
      island.maxCapacity,
    ),
  }
}

/** Apply offline progress to every island, capped only by each island's storage. */
export function applyOfflineProgress(
  islands: IslandData[],
  secondsOffline: number,
): IslandData[] {
  return islands.map((island) => {
    if (!island.unlocked) return island

    const perSecond = getIslandIncomePerSecond(island)
    if (perSecond <= 0) return island

    return {
      ...island,
      currentEarnings: Math.min(
        island.currentEarnings + perSecond * secondsOffline,
        island.maxCapacity,
      ),
    }
  })
}

export function findIsland(
  islands: IslandData[],
  islandId: number,
): IslandData | undefined {
  return islands.find((island) => island.id === islandId)
}

export function findMiner(
  island: IslandData,
  minerId: string,
): MinerData | undefined {
  return island.miners.find((miner) => miner.id === minerId)
}

export function canBuyMiner(
  island: IslandData | undefined,
  minerId: string,
  balance: number,
): boolean {
  if (!island) return false

  const miner = findMiner(island, minerId)
  if (!miner) return false

  return balance >= miner.price && miner.owned < MAX_MINERS_PER_TYPE
}

/** Buy a miner. Returns the same state reference when the purchase is invalid. */
export function buyMiner(
  state: GameState,
  islandId: number,
  minerId: string,
): GameState {
  const island = findIsland(state.islands, islandId)
  if (!island) return state

  const miner = findMiner(island, minerId)
  if (!miner || miner.owned >= MAX_MINERS_PER_TYPE) return state
  if (state.balance < miner.price) return state

  const updatedIslands = state.islands.map((current) => {
    if (current.id !== islandId) return current

    return {
      ...current,
      totalPurchases: current.totalPurchases + 1,
      miners: current.miners.map((entry) =>
        entry.id === minerId ? { ...entry, owned: entry.owned + 1 } : entry,
      ),
    }
  })

  const updatedIsland = findIsland(updatedIslands, islandId)
  const nextIslandId = islandId + 1

  const islands = updatedIslands.map((current) => {
    if (
      current.id === nextIslandId &&
      !current.unlocked &&
      updatedIsland &&
      updatedIsland.totalPurchases >= updatedIsland.requiredPurchases
    ) {
      return { ...current, unlocked: true }
    }
    return current
  })

  return {
    balance: state.balance - miner.price,
    islands,
  }
}

/** Collect the accumulated earnings of an island. */
export function collectIsland(state: GameState, islandId: number): GameState {
  const island = findIsland(state.islands, islandId)
  if (!island || island.currentEarnings < 1) return state

  return {
    balance: state.balance + Math.floor(island.currentEarnings),
    islands: state.islands.map((current) =>
      current.id === islandId ? { ...current, currentEarnings: 0 } : current,
    ),
  }
}

/** Progress towards unlocking the next island, driven by purchases on this one. */
export function getUnlockProgress(island: IslandData) {
  const progress = Math.min(
    100,
    island.requiredPurchases > 0
      ? (island.totalPurchases / island.requiredPurchases) * 100
      : 100,
  )

  return {
    current: island.totalPurchases,
    required: island.requiredPurchases,
    remaining: Math.max(0, island.requiredPurchases - island.totalPurchases),
    progress,
    complete: island.totalPurchases >= island.requiredPurchases,
  }
}

/** Return on investment for a miner, expressed as days to break even. */
export function getMinerRoiDays(miner: MinerData): number {
  if (miner.perDay <= 0) return Infinity
  return miner.price / miner.perDay
}

/** Total miners owned, across all islands. */
export function getTotalMinersOwned(islands: IslandData[]): number {
  return islands.reduce(
    (total, island) =>
      total +
      island.miners.reduce((sum, miner) => sum + miner.owned, 0),
    0,
  )
}
