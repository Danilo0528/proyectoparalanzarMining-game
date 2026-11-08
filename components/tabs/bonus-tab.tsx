"use client"

import { useEffect, useState } from "react"
import {
  CalendarCheck,
  Check,
  Disc3,
  Lock,
  PlayCircle,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react"
import { toast } from "sonner"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { Button } from "@/components/ui/button"
import { BONUSES, claimBonus, getBonusStatus } from "@/lib/game/bonus"
import type { BonusDefinition } from "@/lib/game/bonus"
import { ArcadeCard, CoinAmount, ProgressBar, SectionHeading } from "@/components/game/ui"

interface BonusTabProps {
  balance: number
  setBalance: (balance: number) => void
}

const BONUS_ICONS: Record<number, typeof CalendarCheck> = {
  1: CalendarCheck,
  2: PlayCircle,
  3: Share2,
  4: Disc3,
}

const INITIAL_ACHIEVEMENTS = [
  { id: 1, name: "First Miner", description: "Log in for the first time", reward: 50, claimed: false },
  { id: 2, name: "Wealthy", description: "Reach 1,000 balance", reward: 100, claimed: false },
]

export default function BonusTab({ balance, setBalance }: BonusTabProps) {
  const [claims, setClaims] = usePersistentState<Record<number, number>>("melqo-claims", {})
  const [achievements, setAchievements] = usePersistentState("melqo-achievements", INITIAL_ACHIEVEMENTS)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleClaim = (bonus: BonusDefinition) => {
    const result = claimBonus(claims, balance, bonus, now)
    if (!result.claimed) return

    setBalance(result.balance)
    setClaims(result.claims)
    toast.success(`${bonus.name} claimed`, {
      description: `+${bonus.amount.toLocaleString()} coins added to your balance.`,
    })
  }

  const handleClaimAchievement = (achievementId: number, reward: number) => {
    setBalance(balance + reward)
    setAchievements((prev: typeof INITIAL_ACHIEVEMENTS) =>
      prev.map((achievement) =>
        achievement.id === achievementId ? { ...achievement, claimed: true } : achievement,
      ),
    )
    toast.success("Achievement unlocked", {
      description: `+${reward.toLocaleString()} coins added to your balance.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          eyebrow="Rewards"
          title="Daily bonuses"
          description="Free coins on a timer. Claim them while your miners work."
          icon={Sparkles}
        />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {BONUSES.map((bonus) => {
            const status = getBonusStatus(claims, bonus, now)
            const Icon = BONUS_ICONS[bonus.id] ?? Sparkles

            return (
              <ArcadeCard key={bonus.id} className="relative overflow-hidden p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-arcade-gold/30 bg-arcade-gold/10 text-arcade-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CoinAmount value={`+${bonus.amount}`} className="text-sm text-arcade-gold" />
                </div>

                <h3 className="mt-3 font-display text-lg text-arcade-text">{bonus.name}</h3>
                <p className="text-xs text-arcade-muted">
                  {bonus.cooldownHours}h cooldown
                </p>

                <div className="mt-3">
                  <ProgressBar value={status.progress} max={100} tone={status.canClaim ? "green" : "violet"} />
                </div>

                <Button
                  type="button"
                  onClick={() => handleClaim(bonus)}
                  disabled={!status.canClaim}
                  className="arcade-cta mt-3 h-10 w-full rounded-lg text-xs font-bold"
                >
                  {status.canClaim ? "Claim reward" : status.timeLeftLabel}
                </Button>
              </ArcadeCard>
            )
          })}
        </div>
      </div>

      <div>
        <SectionHeading
          eyebrow="Milestones"
          title="Achievements"
          description="Unlock one-time rewards as your mining empire grows."
          icon={Trophy}
        />

        <ArcadeCard className="mt-4 divide-y divide-arcade-border/60 p-2">
          {achievements.map((achievement) => {
            const isMet = achievement.id === 1 || (achievement.id === 2 && balance >= 1000)

            return (
              <div
                key={achievement.id}
                className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      achievement.claimed
                        ? "flex h-11 w-11 items-center justify-center rounded-xl border border-arcade-green/40 bg-arcade-green/15 text-arcade-green"
                        : isMet
                          ? "flex h-11 w-11 items-center justify-center rounded-xl border border-arcade-gold/40 bg-arcade-gold/15 text-arcade-gold"
                          : "flex h-11 w-11 items-center justify-center rounded-xl border border-arcade-border bg-arcade-raised text-arcade-muted"
                    }
                  >
                    {achievement.claimed ? (
                      <Check className="h-5 w-5" />
                    ) : isMet ? (
                      <Trophy className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <h3 className="font-semibold text-arcade-text">{achievement.name}</h3>
                    <p className="text-sm text-arcade-muted">{achievement.description}</p>
                  </div>
                </div>

                {achievement.claimed ? (
                  <span className="rounded-full border border-arcade-green/30 bg-arcade-green/10 px-3 py-1 text-xs font-semibold text-arcade-green">
                    Claimed
                  </span>
                ) : (
                  <Button
                    type="button"
                    disabled={!isMet}
                    onClick={() => handleClaimAchievement(achievement.id, achievement.reward)}
                    className="arcade-cta h-9 rounded-lg px-4 text-xs font-bold"
                  >
                    {isMet ? `Claim +${achievement.reward}` : "Locked"}
                  </Button>
                )}
              </div>
            )
          })}
        </ArcadeCard>
      </div>
    </div>
  )
}
