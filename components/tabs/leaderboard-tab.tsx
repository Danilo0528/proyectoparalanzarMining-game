"use client"

import { useEffect, useState } from "react"
import { Crown, Medal, RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArcadeCard, CoinAmount, EmptyState, SectionHeading } from "@/components/game/ui"
import { cn } from "@/lib/utils"

interface LeaderboardUser {
  email: string
  balance: number
}

interface LeaderboardTabProps {
  currentEmail?: string
}

const PODIUM_ORDER = [1, 0, 2]

export default function LeaderboardTab({ currentEmail }: LeaderboardTabProps) {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/leaderboard")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch {
      // Leave the previous list in place on failure.
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Hall of fame"
        title="Top miners"
        description="The wealthiest miners in the network. Climb the ranks."
        icon={Trophy}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={fetchLeaderboard}
            className="h-9 gap-2 border-arcade-border bg-arcade-raised text-xs text-arcade-muted"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-arcade-gold border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No miners ranked yet"
          description="Be the first to build a mining empire and claim the top spot."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
            {PODIUM_ORDER.map((podiumIndex) => {
              const user = topThree[podiumIndex]
              if (!user) return <div key={podiumIndex} className="hidden sm:block" />

              const rank = podiumIndex + 1
              const isFirst = rank === 1
              const isCurrent = currentEmail && user.email === currentEmail

              return (
                <ArcadeCard
                  key={user.email}
                  raised={isFirst}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-5 text-center",
                    isFirst && "border-arcade-gold/50 sm:-translate-y-3",
                    isCurrent && "ring-2 ring-arcade-cyan/60",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black",
                      rank === 1 && "bg-arcade-gold text-[#3b2600]",
                      rank === 2 && "bg-slate-300 text-slate-900",
                      rank === 3 && "bg-[#c0803a] text-white",
                    )}
                  >
                    {rank}
                  </span>

                  {isFirst ? (
                    <Crown className="absolute -top-4 h-8 w-8 text-arcade-gold drop-shadow-[0_0_12px_rgba(247,183,51,0.8)]" />
                  ) : null}

                  <span
                    className={cn(
                      "mt-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-2xl text-white",
                      rank === 1 && "from-arcade-gold-soft to-arcade-gold text-[#3b2600]",
                      rank === 2 && "from-slate-300 to-slate-500 text-slate-900",
                      rank === 3 && "from-[#e0a45e] to-[#a8642a]",
                    )}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </span>

                  <p className="max-w-full truncate text-sm font-semibold text-arcade-text">
                    {user.email}
                  </p>
                  {isFirst ? <Medal className="h-4 w-4 text-arcade-gold" /> : null}
                  <CoinAmount
                    value={user.balance.toLocaleString()}
                    className="text-lg text-arcade-gold"
                  />
                  {isCurrent ? (
                    <span className="rounded-full border border-arcade-cyan/40 bg-arcade-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-arcade-cyan">
                      You
                    </span>
                  ) : null}
                </ArcadeCard>
              )
            })}
          </div>

          {rest.length > 0 ? (
            <ArcadeCard className="divide-y divide-arcade-border/60 p-2">
              {rest.map((user, index) => {
                const rank = index + 4
                const isCurrent = currentEmail && user.email === currentEmail

                return (
                  <div
                    key={user.email}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl px-3 py-3",
                      isCurrent && "bg-arcade-cyan/5",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-arcade-border bg-arcade-raised text-xs font-bold text-arcade-muted">
                        #{rank}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-arcade-violet to-arcade-cyan text-xs font-bold text-white">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-arcade-text">
                          {user.email}
                        </p>
                        {isCurrent ? (
                          <p className="text-[10px] font-bold uppercase tracking-wider text-arcade-cyan">
                            You
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <CoinAmount
                      value={user.balance.toLocaleString()}
                      className="shrink-0 text-sm text-arcade-text"
                    />
                  </div>
                )
              })}
            </ArcadeCard>
          ) : null}
        </>
      )}
    </div>
  )
}
