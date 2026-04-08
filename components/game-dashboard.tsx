"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import MinersTab from "@/components/tabs/miners-tab"
import BonusTab from "@/components/tabs/bonus-tab"
import FinanceTab from "@/components/tabs/finance-tab"
import PartnersTab from "@/components/tabs/partners-tab"

interface GameDashboardProps {
  balance: number
  setBalance: (balance: number) => void
  email: string
  token: string
  onLogout: () => void
}

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

const initialIslands: IslandData[] = [
  {
    id: 1,
    name: "Mine #1",
    unlocked: true,
    requiredPurchases: 120,
    totalPurchases: 0,
    maxCapacity: 2000,
    currentEarnings: 0,
    miners: [
      { id: "alpha", name: "Alpha", percentage: 60, perDay: 5, price: 10, owned: 0 },
      { id: "dragon", name: "Dragon", percentage: 60, perDay: 10, price: 20, owned: 0 },
      { id: "hawk", name: "Hawk", percentage: 60, perDay: 15, price: 30, owned: 0 },
      { id: "killer", name: "Killer", percentage: 60, perDay: 20, price: 40, owned: 0 },
      { id: "pugilist", name: "Pugilist", percentage: 60, perDay: 25, price: 50, owned: 0 },
      { id: "romeo", name: "Romeo", percentage: 60, perDay: 38, price: 75, owned: 0 },
      { id: "shooter", name: "Shooter", percentage: 60, perDay: 50, price: 100, owned: 0 },
      { id: "warrior", name: "Warrior", percentage: 60, perDay: 75, price: 150, owned: 0 },
      { id: "casanova", name: "Casanova", percentage: 65, perDay: 100, price: 200, owned: 0 },
      { id: "chieftain", name: "Chieftain", percentage: 65, perDay: 125, price: 250, owned: 0 },
      { id: "detector", name: "Detector", percentage: 65, perDay: 250, price: 500, owned: 0 },
      { id: "beast", name: "Beast", percentage: 65, perDay: 500, price: 1000, owned: 0 },
    ]
  },
  {
    id: 2,
    name: "Mine #2",
    unlocked: false,
    requiredPurchases: 120,
    totalPurchases: 0,
    maxCapacity: 3000,
    currentEarnings: 0,
    miners: [
      { id: "alpha2", name: "Alpha", percentage: 65, perDay: 8, price: 15, owned: 0 },
      { id: "dragon2", name: "Dragon", percentage: 65, perDay: 15, price: 30, owned: 0 },
      { id: "hawk2", name: "Hawk", percentage: 65, perDay: 22, price: 45, owned: 0 },
      { id: "killer2", name: "Killer", percentage: 65, perDay: 30, price: 60, owned: 0 },
      { id: "pugilist2", name: "Pugilist", percentage: 65, perDay: 38, price: 75, owned: 0 },
      { id: "romeo2", name: "Romeo", percentage: 65, perDay: 55, price: 110, owned: 0 },
      { id: "shooter2", name: "Shooter", percentage: 65, perDay: 75, price: 150, owned: 0 },
      { id: "warrior2", name: "Warrior", percentage: 65, perDay: 110, price: 220, owned: 0 },
      { id: "casanova2", name: "Casanova", percentage: 70, perDay: 150, price: 300, owned: 0 },
      { id: "chieftain2", name: "Chieftain", percentage: 70, perDay: 185, price: 375, owned: 0 },
      { id: "detector2", name: "Detector", percentage: 70, perDay: 375, price: 750, owned: 0 },
      { id: "beast2", name: "Beast", percentage: 70, perDay: 750, price: 1500, owned: 0 },
    ]
  },
  {
    id: 3,
    name: "Mine #3",
    unlocked: false,
    requiredPurchases: 120,
    totalPurchases: 0,
    maxCapacity: 4000,
    currentEarnings: 0,
    miners: [
      { id: "alpha3", name: "Alpha", percentage: 70, perDay: 12, price: 22, owned: 0 },
      { id: "dragon3", name: "Dragon", percentage: 70, perDay: 22, price: 44, owned: 0 },
      { id: "hawk3", name: "Hawk", percentage: 70, perDay: 33, price: 66, owned: 0 },
      { id: "killer3", name: "Killer", percentage: 70, perDay: 45, price: 90, owned: 0 },
      { id: "pugilist3", name: "Pugilist", percentage: 70, perDay: 56, price: 112, owned: 0 },
      { id: "romeo3", name: "Romeo", percentage: 70, perDay: 82, price: 165, owned: 0 },
      { id: "shooter3", name: "Shooter", percentage: 70, perDay: 112, price: 225, owned: 0 },
      { id: "warrior3", name: "Warrior", percentage: 70, perDay: 165, price: 330, owned: 0 },
      { id: "casanova3", name: "Casanova", percentage: 75, perDay: 225, price: 450, owned: 0 },
      { id: "chieftain3", name: "Chieftain", percentage: 75, perDay: 278, price: 560, owned: 0 },
      { id: "detector3", name: "Detector", percentage: 75, perDay: 560, price: 1125, owned: 0 },
      { id: "beast3", name: "Beast", percentage: 75, perDay: 1125, price: 2250, owned: 0 },
    ]
  },
  {
    id: 4,
    name: "Mine #4",
    unlocked: false,
    requiredPurchases: 120,
    totalPurchases: 0,
    maxCapacity: 5000,
    currentEarnings: 0,
    miners: [
      { id: "alpha4", name: "Alpha", percentage: 75, perDay: 18, price: 33, owned: 0 },
      { id: "dragon4", name: "Dragon", percentage: 75, perDay: 33, price: 66, owned: 0 },
      { id: "hawk4", name: "Hawk", percentage: 75, perDay: 50, price: 99, owned: 0 },
      { id: "killer4", name: "Killer", percentage: 75, perDay: 68, price: 135, owned: 0 },
      { id: "pugilist4", name: "Pugilist", percentage: 75, perDay: 84, price: 168, owned: 0 },
      { id: "romeo4", name: "Romeo", percentage: 75, perDay: 123, price: 247, owned: 0 },
      { id: "shooter4", name: "Shooter", percentage: 75, perDay: 168, price: 337, owned: 0 },
      { id: "warrior4", name: "Warrior", percentage: 75, perDay: 247, price: 495, owned: 0 },
      { id: "casanova4", name: "Casanova", percentage: 80, perDay: 337, price: 675, owned: 0 },
      { id: "chieftain4", name: "Chieftain", percentage: 80, perDay: 417, price: 840, owned: 0 },
      { id: "detector4", name: "Detector", percentage: 80, perDay: 840, price: 1687, owned: 0 },
      { id: "beast4", name: "Beast", percentage: 80, perDay: 1687, price: 3375, owned: 0 },
    ]
  },
  {
    id: 5,
    name: "Mine #5",
    unlocked: false,
    requiredPurchases: 120,
    totalPurchases: 0,
    maxCapacity: 6000,
    currentEarnings: 0,
    miners: [
      { id: "alpha5", name: "Alpha", percentage: 80, perDay: 27, price: 50, owned: 0 },
      { id: "dragon5", name: "Dragon", percentage: 80, perDay: 50, price: 99, owned: 0 },
      { id: "hawk5", name: "Hawk", percentage: 80, perDay: 75, price: 148, owned: 0 },
      { id: "killer5", name: "Killer", percentage: 80, perDay: 102, price: 202, owned: 0 },
      { id: "pugilist5", name: "Pugilist", percentage: 80, perDay: 126, price: 252, owned: 0 },
      { id: "romeo5", name: "Romeo", percentage: 80, perDay: 185, price: 370, owned: 0 },
      { id: "shooter5", name: "Shooter", percentage: 80, perDay: 252, price: 505, owned: 0 },
      { id: "warrior5", name: "Warrior", percentage: 80, perDay: 370, price: 742, owned: 0 },
      { id: "casanova5", name: "Casanova", percentage: 85, perDay: 505, price: 1012, owned: 0 },
      { id: "chieftain5", name: "Chieftain", percentage: 85, perDay: 625, price: 1260, owned: 0 },
      { id: "detector5", name: "Detector", percentage: 85, perDay: 1260, price: 2531, owned: 0 },
      { id: "beast5", name: "Beast", percentage: 85, perDay: 2531, price: 5062, owned: 0 },
    ]
  },
]

type TabType = "miners" | "bonus" | "finance" | "partners"

import { usePersistentState } from "@/hooks/use-persistent-state"

export default function GameDashboard({ balance, setBalance, email, token, onLogout }: GameDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("miners")
  const [islands, setIslands, isIslandsInitialized] = usePersistentState<IslandData[]>("melqo-islands", initialIslands)
  const [selectedIsland, setSelectedIsland] = useState<number>(1)
  const [lastTick, setLastTick] = usePersistentState<number>("melqo-lastTick", Date.now())

  // Calculate offline earnings and start interval
  useEffect(() => {
    if (!isIslandsInitialized) return;
    
    // Offline progress check once on load
    const now = Date.now()
    const secondsPassed = Math.floor((now - lastTick) / 1000)
    
    if (secondsPassed > 0) {
      setIslands(prevIslands => {
        return prevIslands.map(island => {
          if (!island.unlocked) return island
          
          let islandPerSecond = 0
          island.miners.forEach(miner => {
            if (miner.owned > 0) {
              islandPerSecond += (miner.perDay / 86400) * miner.owned
            }
          })
          
          if (islandPerSecond > 0) {
            const earned = islandPerSecond * secondsPassed
            const newEarnings = Math.min(
              island.currentEarnings + earned,
              island.maxCapacity
            )
            return { ...island, currentEarnings: newEarnings }
          }
          return island
        })
      })
      setLastTick(now)
    }

    const interval = setInterval(() => {
      setLastTick(Date.now())
      setIslands(prevIslands => {
        return prevIslands.map(island => {
          if (!island.unlocked) return island
          
          // Calculate earnings per second for this island's miners
          let islandPerSecond = 0
          island.miners.forEach(miner => {
            if (miner.owned > 0) {
              // perDay / 86400 seconds * owned count
              islandPerSecond += (miner.perDay / 86400) * miner.owned
            }
          })
          
          // Add earnings but cap at maxCapacity
          const newEarnings = Math.min(
            island.currentEarnings + islandPerSecond,
            island.maxCapacity
          )
          
          return { ...island, currentEarnings: newEarnings }
        })
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isIslandsInitialized])

  // Auto-sync to MongoDB every 60 seconds
  useEffect(() => {
    if (!email || !token) return

    const syncToMongo = async () => {
      try {
        const claims = JSON.parse(localStorage.getItem('melqo-claims') || '{}')
        const achievements = JSON.parse(localStorage.getItem('melqo-achievements') || '[]')
        const transactions = JSON.parse(localStorage.getItem('melqo-transactions') || '[]')

        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            state: {
              balance,
              islands,
              claims,
              achievements,
              transactions,
              lastTick: Date.now()
            }
          })
        })
      } catch (e) {
        // Silent fail - local state is the source of truth
        console.warn('Auto-sync failed, will retry in 60s')
      }
    }

    const syncInterval = setInterval(syncToMongo, 60000) // every 60 seconds
    syncToMongo() // also sync immediately on mount

    return () => clearInterval(syncInterval)
  }, [email, token, balance, islands])

  const handleBuyMiner = (islandId: number, minerId: string) => {
    const island = islands.find(i => i.id === islandId)
    if (!island) return

    const miner = island.miners.find(m => m.id === minerId)
    if (!miner || balance < miner.price || miner.owned >= 10) return

    // Update balance first
    setBalance(balance - miner.price)

    // Then update islands
    setIslands(prevIslands => {
      return prevIslands.map((island, index) => {
        if (island.id === islandId) {
          const newTotalPurchases = island.totalPurchases + 1
          
          return {
            ...island,
            totalPurchases: newTotalPurchases,
            miners: island.miners.map(m => 
              m.id === minerId ? { ...m, owned: m.owned + 1 } : m
            )
          }
        }
        
        // Check if this island should be unlocked (previous island completed)
        const prevIsland = prevIslands.find(i => i.id === island.id - 1)
        if (prevIsland && prevIsland.id === islandId) {
          const newPrevTotalPurchases = prevIsland.totalPurchases + 1
          if (newPrevTotalPurchases >= prevIsland.requiredPurchases && !island.unlocked) {
            return { ...island, unlocked: true }
          }
        }
        
        return island
      })
    })
  }

  const handleCollect = (islandId: number) => {
    const island = islands.find(i => i.id === islandId)
    if (!island || island.currentEarnings < 1) return
    
    setBalance(balance + Math.floor(island.currentEarnings))
    setIslands(prevIslands => 
      prevIslands.map(i => 
        i.id === islandId ? { ...i, currentEarnings: 0 } : i
      )
    )
  }

  const currentIsland = islands.find(i => i.id === selectedIsland)

  const tabs: { id: TabType; label: string }[] = [
    { id: "miners", label: "MINERS" },
    { id: "bonus", label: "BONUS" },
    { id: "finance", label: "FINANCE" },
    { id: "partners", label: "PARTNERS" },
  ]

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/images/bg-landscape.jpg')"
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-sky-400/20 to-sky-600/30">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 md:px-8">
          {/* Balance */}
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
              border: "2px solid #c4a574",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#d4a534">
              <circle cx="12" cy="12" r="10" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#4a3728" fontWeight="bold">$</text>
            </svg>
            <span className="text-xl font-bold text-[#4a3728]">{balance.toLocaleString()}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-b from-[#f5d742] to-[#d4a534] text-[#4a3728] border-2 border-[#a67c00]"
                    : "bg-[#f5e6c8]/80 text-[#6b5344] border-2 border-[#c4a574] hover:bg-[#f5e6c8]"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Logout */}
          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-[#4a3728] hover:bg-[#f5e6c8]/50"
          >
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-8 pb-8">
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
          {activeTab === "finance" && <FinanceTab balance={balance} setBalance={setBalance} email={email} token={token} />}
          {activeTab === "partners" && <PartnersTab email={email} />}
        </main>
      </div>
    </div>
  )
}
