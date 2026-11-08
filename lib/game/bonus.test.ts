import { describe, expect, it } from "vitest"
import { BONUSES, claimBonus, getBonusStatus } from "./bonus"

const HOUR = 60 * 60 * 1000
const NOW = Date.UTC(2026, 0, 1)
const daily = BONUSES[0]

describe("bonus cooldowns", () => {
  it("is claimable when there is no previous claim", () => {
    const status = getBonusStatus({}, daily, NOW)
    expect(status.canClaim).toBe(true)
    expect(status.timeLeftLabel).toBeNull()
  })

  it("is not claimable during the cooldown", () => {
    const status = getBonusStatus({ [daily.id]: NOW - HOUR }, daily, NOW)

    expect(status.canClaim).toBe(false)
    expect(status.timeLeftLabel).toBe("23h 0m left")
    expect(status.progress).toBeCloseTo((1 / 24) * 100)
  })

  it("becomes claimable again once the cooldown has elapsed", () => {
    const status = getBonusStatus({ [daily.id]: NOW - 24 * HOUR }, daily, NOW)
    expect(status.canClaim).toBe(true)
  })
})

describe("claiming bonuses", () => {
  it("credits the balance and records the claim timestamp", () => {
    const result = claimBonus({}, 100, daily, NOW)

    expect(result.claimed).toBe(true)
    expect(result.balance).toBe(200)
    expect(result.claims[daily.id]).toBe(NOW)
  })

  it("does not reward a second claim during the cooldown", () => {
    const result = claimBonus({ [daily.id]: NOW }, 100, daily, NOW)

    expect(result.claimed).toBe(false)
    expect(result.balance).toBe(100)
    expect(result.claims[daily.id]).toBe(NOW)
  })
})
