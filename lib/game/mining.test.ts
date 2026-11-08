import { describe, expect, it } from "vitest"
import {
  applyEarningsTick,
  applyOfflineProgress,
  buyMiner,
  canBuyMiner,
  collectIsland,
  getIncomeRates,
  getIslandIncomePerSecond,
  getMinerIncomePerSecond,
  getUnlockProgress,
  MAX_MINERS_PER_TYPE,
} from "./mining"
import type { GameState, IslandData, MinerData } from "./types"

const miner = (overrides: Partial<MinerData> = {}): MinerData => ({
  id: "alpha",
  name: "Alpha",
  percentage: 60,
  perDay: 10,
  price: 100,
  owned: 1,
  ...overrides,
})

const island = (overrides: Partial<IslandData> = {}): IslandData => ({
  id: 1,
  name: "Mine #1",
  unlocked: true,
  miners: [miner()],
  totalPurchases: 0,
  requiredPurchases: 120,
  maxCapacity: 2000,
  currentEarnings: 0,
  ...overrides,
})

const state = (overrides: Partial<GameState> = {}): GameState => ({
  balance: 1000,
  islands: [island()],
  ...overrides,
})

describe("mining income", () => {
  it("converts a miner per-day rate into per-second earnings", () => {
    expect(getMinerIncomePerSecond(miner({ perDay: 10, owned: 1 }))).toBeCloseTo(
      10 / 86400,
    )
    expect(getMinerIncomePerSecond(miner({ perDay: 10, owned: 3 }))).toBeCloseTo(
      30 / 86400,
    )
  })

  it("sums all owned miners on an island", () => {
    const value = getIslandIncomePerSecond(
      island({
        miners: [
          miner({ id: "a", perDay: 10, owned: 1 }),
          miner({ id: "b", perDay: 20, owned: 2 }),
        ],
      }),
    )
    expect(value).toBeCloseTo(50 / 86400)
  })

  it("ignores owned miners on locked islands", () => {
    const rates = getIncomeRates([
      island({ id: 1, unlocked: true, miners: [miner({ perDay: 10, owned: 1 })] }),
      island({ id: 2, unlocked: false, miners: [miner({ perDay: 100, owned: 5 })] }),
    ])

    expect(rates.perDay).toBe(10)
    expect(rates.perHour).toBeCloseTo(10 / 24)
    expect(rates.perMonth).toBe(300)
    expect(rates.perSecond).toBeCloseTo(10 / 86400)
  })
})

describe("earnings accrual", () => {
  it("adds one second of income to the island", () => {
    const next = applyEarningsTick(island({ currentEarnings: 0 }), 1)
    expect(next.currentEarnings).toBeCloseTo(10 / 86400)
  })

  it("never exceeds the island capacity", () => {
    const next = applyEarningsTick(
      island({ currentEarnings: 1999, maxCapacity: 2000, miners: [miner({ perDay: 86400 })] }),
      10,
    )
    expect(next.currentEarnings).toBe(2000)
  })

  it("does not accrue earnings on locked islands", () => {
    const locked = island({ unlocked: false })
    expect(applyEarningsTick(locked, 100)).toEqual(locked)
  })

  it("applies offline progress only to unlocked islands", () => {
    const [first, second] = applyOfflineProgress(
      [
        island({ id: 1, unlocked: true, currentEarnings: 0 }),
        island({ id: 2, unlocked: false, currentEarnings: 0 }),
      ],
      3600,
    )

    expect(first.currentEarnings).toBeCloseTo(3600 * (10 / 86400))
    expect(second.currentEarnings).toBe(0)
  })

  it("keeps accruing offline earnings beyond 24 hours until storage is full", () => {
    const [capped] = applyOfflineProgress(
      [island({ currentEarnings: 0, maxCapacity: 1_000_000 })],
      86400 * 10,
    )
    expect(capped.currentEarnings).toBeCloseTo(100)
  })

  it("caps offline earnings at the island storage", () => {
    const [capped] = applyOfflineProgress(
      [island({ currentEarnings: 0, maxCapacity: 50 })],
      86400 * 10,
    )
    expect(capped.currentEarnings).toBe(50)
  })
})

describe("buying miners", () => {
  it("rejects purchases that cost more than the balance", () => {
    expect(canBuyMiner(island({ miners: [miner({ price: 500 })] }), "alpha", 100)).toBe(
      false,
    )
  })

  it("rejects purchases once the player owns the maximum", () => {
    expect(
      canBuyMiner(
        island({ miners: [miner({ owned: MAX_MINERS_PER_TYPE })] }),
        "alpha",
        1_000_000,
      ),
    ).toBe(false)
  })

  it("deducts the price and increments owned and total purchases", () => {
    const before = state()
    const after = buyMiner(before, 1, "alpha")

    expect(after.balance).toBe(900)
    expect(after.islands[0].miners[0].owned).toBe(2)
    expect(after.islands[0].totalPurchases).toBe(1)
  })

  it("returns the same state when the purchase is invalid", () => {
    const before = state({ balance: 0 })
    expect(buyMiner(before, 1, "alpha")).toBe(before)
  })

  it("unlocks the next island when the required purchases are reached", () => {
    const before = state({
      islands: [
        island({ id: 1, totalPurchases: 119, requiredPurchases: 120 }),
        island({ id: 2, unlocked: false }),
      ],
    })

    const after = buyMiner(before, 1, "alpha")

    expect(after.islands[0].totalPurchases).toBe(120)
    expect(after.islands[1].unlocked).toBe(true)
  })

  it("does not unlock the next island before the requirement is met", () => {
    const before = state({
      islands: [
        island({ id: 1, totalPurchases: 0, requiredPurchases: 120 }),
        island({ id: 2, unlocked: false }),
      ],
    })

    const after = buyMiner(before, 1, "alpha")
    expect(after.islands[1].unlocked).toBe(false)
  })
})

describe("collecting earnings", () => {
  it("adds the floored earnings to the balance and resets the island", () => {
    const before = state({
      islands: [island({ currentEarnings: 42.9 })],
    })
    const after = collectIsland(before, 1)

    expect(after.balance).toBe(1042)
    expect(after.islands[0].currentEarnings).toBe(0)
  })

  it("does nothing when there is less than one coin to collect", () => {
    const before = state({ islands: [island({ currentEarnings: 0.99 })] })
    expect(collectIsland(before, 1)).toBe(before)
  })

  it("does nothing for an unknown island", () => {
    const before = state()
    expect(collectIsland(before, 99)).toBe(before)
  })
})

describe("unlock progress", () => {
  it("reports progress towards the next island", () => {
    const progress = getUnlockProgress(
      island({ totalPurchases: 60, requiredPurchases: 120 }),
    )
    expect(progress).toEqual({
      current: 60,
      required: 120,
      remaining: 60,
      progress: 50,
      complete: false,
    })
  })

  it("marks the requirement as complete", () => {
    const progress = getUnlockProgress(
      island({ totalPurchases: 120, requiredPurchases: 120 }),
    )
    expect(progress.complete).toBe(true)
  })
})
