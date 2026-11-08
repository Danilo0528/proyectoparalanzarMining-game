"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import GameShell from "@/components/game/game-shell"
import MinersTab from "@/components/tabs/miners-tab"
import BonusTab from "@/components/tabs/bonus-tab"
import FinanceTab from "@/components/tabs/finance-tab"
import PartnersTab from "@/components/tabs/partners-tab"
import LeaderboardTab from "@/components/tabs/leaderboard-tab"
import { usePersistentState } from "@/hooks/use-persistent-state"
import {
  applyEarningsTick,
  applyOfflineProgress,
  buyMiner,
  collectIsland,
  findIsland,
  findMiner,
  getIncomeRates,
} from "@/lib/game/mining"
import { initialIslands } from "@/lib/game/islands"
import type { IslandData, MinerData, TabType } from "@/lib/game/types"

export type { IslandData, MinerData, TabType }

interface GameDashboardProps {
  balance: number
  setBalance: (balance: number) => void
  email: string
  token: string
  onLogout: () => void
}

export default function GameDashboard({
  balance,
  setBalance,
  email,
  token,
  onLogout,
}: GameDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("miners")
  const [islands, setIslands, isIslandsInitialized] = usePersistentState<IslandData[]>(
    "melqo-islands",
    initialIslands,
  )
  const [selectedIsland, setSelectedIsland] = useState<number>(1)
  const [lastTick, setLastTick] = usePersistentState<number>("melqo-lastTick", Date.now())

  // Offline progress once on load, then a one-second earnings loop.
  useEffect(() => {
    if (!isIslandsInitialized) return

    const now = Date.now()
    const secondsPassed = Math.floor((now - lastTick) / 1000)

    if (secondsPassed > 0) {
      setIslands((prevIslands) => applyOfflineProgress(prevIslands, secondsPassed))
      setLastTick(now)
    }

    const interval = setInterval(() => {
      setLastTick(Date.now())
      setIslands((prevIslands) => prevIslands.map((island) => applyEarningsTick(island, 1)))
    }, 1000)

    return () => clearInterval(interval)
  }, [isIslandsInitialized])

  // Keep the local game state mirrored to MongoDB for account recovery.
  // State is read through refs so the interval doesn't restart every second
  // (islands change every tick) and doesn't hammer the database.
  const balanceRef = useRef(balance)
  const islandsRef = useRef(islands)
  const syncRef = useRef<(() => void) | null>(null)
  balanceRef.current = balance
  islandsRef.current = islands

  useEffect(() => {
    if (!email || !token) return

    const syncToMongo = async () => {
      try {
        const claims = JSON.parse(localStorage.getItem("melqo-claims") || "{}")
        const achievements = JSON.parse(localStorage.getItem("melqo-achievements") || "[]")
        const transactions = JSON.parse(localStorage.getItem("melqo-transactions") || "[]")

        await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            state: {
              balance: balanceRef.current,
              islands: islandsRef.current,
              claims,
              achievements,
              transactions,
              lastTick: Date.now(),
            },
          }),
        })
      } catch {
        // Local state is the source of truth; retry on the next tick.
      }
    }

    // Sync immediately on mount, then every 2 minutes.
    syncRef.current = syncToMongo
    syncToMongo()
    const syncInterval = setInterval(syncToMongo, 120000)

    return () => clearInterval(syncInterval)
  }, [email, token])

  const handleBuyMiner = (islandId: number, minerId: string) => {
    const island = findIsland(islands, islandId)
    const miner = island ? findMiner(island, minerId) : undefined

    const next = buyMiner({ balance, islands }, islandId, minerId)
    if (next.islands === islands) {
      if (miner && balance < miner.price) {
        toast.error("Not enough coins", {
          description: `You need ${miner.price.toLocaleString()} coins to hire ${miner.name}.`,
        })
      }
      return
    }

    setBalance(next.balance)
    setIslands(next.islands)
    syncRef.current?.()

    if (miner) {
      toast.success(`${miner.name} joined your mine`, {
        description: `-${miner.price.toLocaleString()} coins · +${miner.perDay} coins/day`,
      })
    }
  }

  const handleCollect = (islandId: number) => {
    const island = findIsland(islands, islandId)
    const collected = island ? Math.floor(island.currentEarnings) : 0

    const next = collectIsland({ balance, islands }, islandId)
    if (next.islands === islands) return

    setBalance(next.balance)
    setIslands(next.islands)
    syncRef.current?.()
    toast.success(`Collected ${collected.toLocaleString()} coins`, {
      description: "Your miners keep digging while you are away.",
    })
  }

  const currentIsland = findIsland(islands, selectedIsland)
  const incomeRates = getIncomeRates(islands)

  return (
    <GameShell
      balance={balance}
      incomePerSecond={incomeRates.perSecond}
      email={email}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {activeTab === "miners" && (
        <MinersTab
          islands={islands}
          selectedIsland={selectedIsland}
          setSelectedIsland={setSelectedIsland}
          currentIsland={currentIsland}
          onCollect={handleCollect}
          onBuyMiner={handleBuyMiner}
          balance={balance}
        />
      )}
      {activeTab === "bonus" && <BonusTab balance={balance} setBalance={setBalance} />}
      {activeTab === "finance" && (
        <FinanceTab balance={balance} setBalance={setBalance} email={email} token={token} />
      )}
      {activeTab === "partners" && <PartnersTab email={email} />}
      {activeTab === "leaderboard" && <LeaderboardTab currentEmail={email} />}
    </GameShell>
  )
}
