"use client"


import { Button } from "@/components/ui/button"
import type { IslandData } from "@/components/game-dashboard"
import Image from "next/image"

// Map miner base names to their images
const minerImages: Record<string, string> = {
  alpha: "/images/miners/alpha.png",
  dragon: "/images/miners/dragon.png",
  hawk: "/images/miners/hawk.png",
  killer: "/images/miners/killer.png",
  pugilist: "/images/miners/pugilist.png",
  romeo: "/images/miners/romeo.png",
  shooter: "/images/miners/shooter.png",
  warrior: "/images/miners/warrior.png",
  casanova: "/images/miners/casanova.png",
  chieftain: "/images/miners/chieftain.png",
  detector: "/images/miners/detector.png",
  beast: "/images/miners/beast.png",
}

// Get the base miner name (remove number suffix like "alpha2" -> "alpha")
function getMinerImage(minerId: string): string {
  const baseName = minerId.replace(/\d+$/, "")
  return minerImages[baseName] || "/images/miners/alpha.png"
}

interface MinersTabProps {
  islands: IslandData[]
  selectedIsland: number
  setSelectedIsland: (id: number) => void
  currentIsland: IslandData | undefined
  onCollect: (islandId: number) => void
  onBuyMiner: (islandId: number, minerId: string) => void
  balance: number
}

export default function MinersTab({
  islands,
  selectedIsland,
  setSelectedIsland,
  currentIsland,
  onCollect,
  onBuyMiner,
  balance
}: MinersTabProps) {
  // Calculate total earnings rate from all owned miners across all islands
  const calculateEarningsRate = () => {
    let totalPerDay = 0
    
    islands.forEach(island => {
      if (island.unlocked) {
        island.miners.forEach(miner => {
          if (miner.owned > 0) {
            totalPerDay += miner.perDay * miner.owned
          }
        })
      }
    })
    
    return {
      perHour: totalPerDay / 24,
      perDay: totalPerDay,
      perMonth: totalPerDay * 30
    }
  }

  const earningsRate = calculateEarningsRate()

  return (
    <div className="space-y-6">
      {/* Islands Selection */}
      <div className="flex justify-center gap-3 flex-wrap">
        {islands.map((island) => (
          <button
            key={island.id}
            onClick={() => island.unlocked && setSelectedIsland(island.id)}
            disabled={!island.unlocked}
            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg transition-all ${
              selectedIsland === island.id
                ? "ring-4 ring-[#d4a534] scale-105"
                : ""
            } ${!island.unlocked ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
            style={{
              background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
              border: "3px solid #c4a574",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            {island.unlocked ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                  src="/images/mine-icon.png"
                  alt={island.name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <span className="text-xs font-bold text-[#4a3728] mt-1">{island.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#6b5344]" fill="currentColor">
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
                </svg>
                <span className="text-xs font-bold text-[#6b5344] mt-1">{island.name}</span>
              </div>
            )}
            
            {/* Progress indicator for current island */}
            {island.unlocked && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 bg-[#4a3728] px-2 py-0.5 rounded-full">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#d4a534">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="text-xs text-[#d4a534] font-bold">{island.totalPurchases}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mine Panel and Earnings */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mine Panel */}
        <div 
          className="flex-1 p-4 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
            border: "3px solid #c4a574",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          <div className="flex gap-4">
            {/* Mine Image */}
            <div className="relative w-32 h-40 md:w-40 md:h-48 flex-shrink-0">
              <Image
                src="/images/mine-entrance.png"
                alt="Mine Entrance"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#4a3728]/90 px-3 py-1 rounded-full text-sm font-bold text-[#f5d742]">
                {Math.floor(currentIsland?.currentEarnings || 0)}/{currentIsland?.maxCapacity || 2000}
              </div>
            </div>

            {/* Miners Grid */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#4a3728] mb-2">{currentIsland?.name}</h3>
              <div className="grid grid-cols-6 gap-1">
                {currentIsland?.miners.map((miner) => (
                  <div 
                    key={miner.id}
                    className="flex flex-col items-center p-1 rounded bg-[#e8d5b0]/50"
                    title={`${miner.name}: ${miner.owned}/10`}
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-[#4a3728]/10 flex items-center justify-center overflow-hidden">
                      {miner.owned > 0 ? (
                        <Image
                          src={getMinerImage(miner.id)}
                          alt={miner.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-[#6b5344]">0</span>
                      )}
                    </div>
                    <span className="text-[8px] text-[#6b5344] truncate w-full text-center">{miner.name}</span>
                    <span className="text-[8px] text-[#d4a534] font-bold">{miner.owned}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Panel */}
        <div 
          className="w-full md:w-48 p-4 rounded-lg flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
            border: "3px solid #c4a574",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          <div className="text-sm text-[#6b5344] flex items-center gap-1">
            Month: 
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#d4a534"><circle cx="12" cy="12" r="10" /></svg>
            <span className="text-[#d4a534] font-bold">{earningsRate.perMonth.toFixed(1)}</span>
          </div>
          <div className="text-sm text-[#6b5344] flex items-center gap-1">
            Day: 
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#d4a534"><circle cx="12" cy="12" r="10" /></svg>
            <span className="text-[#d4a534] font-bold">{earningsRate.perDay.toFixed(1)}</span>
          </div>
          <div className="text-sm text-[#6b5344] flex items-center gap-1">
            Hour: 
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#d4a534"><circle cx="12" cy="12" r="10" /></svg>
            <span className="text-[#d4a534] font-bold">{earningsRate.perHour.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#d4a534">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-2xl font-bold text-[#4a3728]">{(currentIsland?.currentEarnings || 0).toFixed(4)}</span>
          </div>
          
          <Button
            onClick={() => currentIsland && onCollect(currentIsland.id)}
            disabled={(currentIsland?.currentEarnings || 0) < 1}
            className="mt-4 w-full bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold rounded-full border-2 border-[#a67c00] disabled:opacity-50"
          >
            COLLECT
          </Button>
        </div>
      </div>

      {/* Miners Store */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {currentIsland?.miners.map((miner) => (
          <MinerCard
            key={miner.id}
            miner={miner}
            minerImage={getMinerImage(miner.id)}
            onBuy={() => onBuyMiner(currentIsland.id, miner.id)}
            canBuy={balance >= miner.price && miner.owned < 10}
          />
        ))}
      </div>
    </div>
  )
}

interface MinerCardProps {
  miner: {
    id: string
    name: string
    percentage: number
    perDay: number
    price: number
    owned: number
  }
  minerImage: string
  onBuy: () => void
  canBuy: boolean
}

function MinerCard({ miner, minerImage, onBuy, canBuy }: MinerCardProps) {
  return (
    <div 
      className="p-3 rounded-lg relative"
      style={{
        background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
        border: "3px solid #c4a574",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-[#4a3728]">{miner.name.toUpperCase()}</span>
        <span className="text-xs text-[#d4a534] font-bold">{miner.percentage}%</span>
      </div>

      {/* Owned counter */}
      <div className="absolute top-2 left-2 bg-[#4a3728] text-[#f5e6c8] text-xs px-1.5 py-0.5 rounded-full">
        {miner.owned}
      </div>

      {/* Miner Image */}
      <div className="flex justify-center mb-3">
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-[#e8d5b0]">
          <Image
            src={minerImage}
            alt={miner.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-[#6b5344]">Per day:</span>
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#d4a534">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="font-bold text-[#4a3728]">{miner.perDay}</span>
        </div>
      </div>

      {/* Buy Button */}
      <Button
        onClick={onBuy}
        disabled={!canBuy}
        className="w-full bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold rounded-full border-2 border-[#a67c00] disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1" fill="#4a3728">
          <circle cx="12" cy="12" r="10" />
        </svg>
        {miner.price}
      </Button>
    </div>
  )
}
