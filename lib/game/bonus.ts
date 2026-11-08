export interface BonusDefinition {
  id: number
  name: string
  amount: number
  cooldownHours: number
}

export interface BonusStatus {
  canClaim: boolean
  msLeft: number
  timeLeftLabel: string | null
  progress: number
}

export const BONUSES: BonusDefinition[] = [
  { id: 1, name: "Daily Bonus", amount: 100, cooldownHours: 24 },
  { id: 2, name: "Watch Ad", amount: 25, cooldownHours: 1 },
  { id: 3, name: "Social Share", amount: 50, cooldownHours: 12 },
  { id: 4, name: "Lucky Wheel", amount: 75, cooldownHours: 6 },
]

const HOUR_MS = 60 * 60 * 1000

export function getBonusStatus(
  claims: Record<number, number>,
  bonus: BonusDefinition,
  now: number = Date.now(),
): BonusStatus {
  const cooldownMs = bonus.cooldownHours * HOUR_MS
  const lastClaim = claims[bonus.id] ?? 0
  const elapsed = now - lastClaim
  const msLeft = cooldownMs - elapsed

  if (lastClaim <= 0 || msLeft <= 0) {
    return { canClaim: true, msLeft: 0, timeLeftLabel: null, progress: 100 }
  }

  const hours = Math.floor(msLeft / HOUR_MS)
  const minutes = Math.floor((msLeft % HOUR_MS) / (60 * 1000))

  return {
    canClaim: false,
    msLeft,
    timeLeftLabel: `${hours}h ${minutes}m left`,
    progress: Math.min(100, Math.max(0, (elapsed / cooldownMs) * 100)),
  }
}

export function claimBonus(
  claims: Record<number, number>,
  balance: number,
  bonus: BonusDefinition,
  now: number = Date.now(),
): { claims: Record<number, number>; balance: number; claimed: boolean } {
  const status = getBonusStatus(claims, bonus, now)
  if (!status.canClaim) {
    return { claims, balance, claimed: false }
  }

  return {
    claims: { ...claims, [bonus.id]: now },
    balance: balance + bonus.amount,
    claimed: true,
  }
}
