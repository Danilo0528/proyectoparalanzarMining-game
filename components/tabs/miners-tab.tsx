"use client"

import Image from "next/image"
import { ArrowUpRight, Coins, Lock, Pickaxe, Sparkles, Timer, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  canBuyMiner,
  getIncomeRates,
  getMinerRoiDays,
  getTotalMinersOwned,
  getUnlockProgress,
  MAX_MINERS_PER_TYPE,
} from "@/lib/game/mining"
import type { IslandData, MinerData } from "@/lib/game/types"
import {
  ArcadeCard,
  CoinAmount,
  ProgressBar,
  RarityBadge,
  SectionHeading,
  StatTile,
} from "@/components/game/ui"

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
  balance,
}: MinersTabProps) {
  const earningsRate = getIncomeRates(islands)
  const totalMiners = getTotalMinersOwned(islands)
  const nextIsland = currentIsland
    ? islands.find((island) => island.id === currentIsland.id + 1)
    : undefined
  const unlock = currentIsland ? getUnlockProgress(currentIsland) : undefined
  const currentEarnings = Math.floor(currentIsland?.currentEarnings || 0)
  const capacity = currentIsland?.maxCapacity || 2000

  return (
    <div className="space-y-6">
      <ArcadeCard className="overflow-hidden">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[220px] overflow-hidden md:min-h-[320px]">
            <Image
              src="/images/mine-entrance.png"
              alt="Mine entrance"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/35 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#070b14]/10 md:to-[#0d1424]" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-arcade-green/30 bg-black/50 px-3 py-1.5 text-xs font-semibold text-arcade-green backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arcade-green opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-arcade-green" />
              </span>
              Mining active
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-arcade-gold">
                  Active sector
                </p>
                <h1 className="font-display text-2xl text-arcade-text md:text-3xl">
                  {currentIsland?.name ?? "Mine #1"}
                </h1>
              </div>
              <span className="rounded-full border border-arcade-border bg-black/50 px-3 py-1 text-xs text-arcade-muted backdrop-blur">
                {currentIsland?.miners.filter((miner) => miner.owned > 0).length ?? 0}/{currentIsland?.miners.length ?? 0} hired
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-arcade-muted">
                  Idle earnings
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-4xl tabular-nums text-arcade-gold text-glow-gold md:text-5xl">
                    {currentEarnings.toLocaleString()}
                  </span>
                  <span className="text-sm text-arcade-muted">coins</span>
                </div>
                <p className="mt-1 text-xs text-arcade-muted">
                  Capacity {capacity.toLocaleString()} coins
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-arcade-gold/30 bg-arcade-gold/10 text-arcade-gold">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>

            <ProgressBar
              value={currentIsland?.currentEarnings || 0}
              max={capacity}
              tone="gold"
              label="Storage"
            />

            <Button
              type="button"
              onClick={() => currentIsland && onCollect(currentIsland.id)}
              disabled={currentEarnings < 1}
              className="arcade-cta h-14 w-full rounded-xl font-display text-base uppercase tracking-[0.18em]"
            >
              <Pickaxe className="h-5 w-5" />
              Collect {currentEarnings > 0 ? currentEarnings.toLocaleString() : ""}
            </Button>

            <p className="text-center text-xs text-arcade-muted">
              {currentIsland && nextIsland && unlock
                ? unlock.complete
                  ? "New sector ready to unlock."
                  : `${unlock.remaining} more hires to unlock ${nextIsland.name}.`
                : "Recruit miners to grow your income."}
            </p>
          </div>
        </div>
      </ArcadeCard>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ArcadeCard className="p-4 md:p-5">
          <SectionHeading
            eyebrow="Universe"
            title="Mining sectors"
            description="Every sector holds a richer crew and a bigger storage tank."
            icon={Pickaxe}
          />

          <div className="arcade-scroll mt-4 flex gap-3 overflow-x-auto pb-2">
            {islands.map((island) => {
              const active = selectedIsland === island.id
              const progress = getUnlockProgress(island)

              return (
                <button
                  key={island.id}
                  type="button"
                  onClick={() => island.unlocked && setSelectedIsland(island.id)}
                  disabled={!island.unlocked}
                  aria-pressed={active}
                  className={cn(
                    "relative flex w-[112px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center transition-all",
                    active
                      ? "border-arcade-gold/60 bg-arcade-gold/10 shadow-[0_0_28px_-10px_rgba(247,183,51,0.8)]"
                      : "border-arcade-border bg-black/20 hover:border-arcade-gold/30 hover:bg-white/5",
                    !island.unlocked && "opacity-70",
                  )}
                >
                  <span className="relative flex h-12 w-12 items-center justify-center">
                    {island.unlocked ? (
                      <Image
                        src="/images/mine-icon.png"
                        alt=""
                        width={48}
                        height={48}
                        className="h-11 w-11 object-contain"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-arcade-border bg-arcade-raised text-arcade-muted">
                        <Lock className="h-5 w-5" />
                      </span>
                    )}
                  </span>
                  <span className="font-display text-xs text-arcade-text">{island.name}</span>
                  <span className={cn("text-[10px]", active ? "text-arcade-gold" : "text-arcade-muted")}>
                    {island.unlocked ? `${island.totalPurchases} hires` : "Locked"}
                  </span>
                  {!island.unlocked ? (
                    <span className="mt-1 h-1 w-full overflow-hidden rounded-full bg-black/50">
                      <span
                        className="block h-full rounded-full bg-arcade-violet"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {nextIsland && unlock && !unlock.complete ? (
            <div className="mt-4 rounded-2xl border border-arcade-border bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-arcade-muted">
                  <Lock className="h-3.5 w-3.5" />
                  Next unlock: <span className="text-arcade-text">{nextIsland.name}</span>
                </span>
                <span className="font-semibold text-arcade-violet">
                  {unlock.current}/{unlock.required}
                </span>
              </div>
              <ProgressBar value={unlock.current} max={unlock.required} tone="violet" />
            </div>
          ) : null}
        </ArcadeCard>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <StatTile
            icon={TrendingUp}
            label="Per hour"
            value={<CoinAmount value={earningsRate.perHour.toFixed(1)} />}
            tone="green"
          />
          <StatTile
            icon={Timer}
            label="Per day"
            value={<CoinAmount value={earningsRate.perDay.toFixed(1)} />}
            tone="gold"
          />
          <StatTile
            icon={ArrowUpRight}
            label="Per month"
            value={<CoinAmount value={earningsRate.perMonth.toFixed(1)} />}
            tone="violet"
          />
          <StatTile
            icon={Users}
            label="Crew"
            value={`${totalMiners} miners`}
            hint={`${islands.filter((island) => island.unlocked).length}/${islands.length} sectors open`}
            tone="cyan"
          />
        </div>
      </div>

      <div>
        <SectionHeading
          eyebrow="Recruitment"
          title="Build your crew"
          description={`Each hire adds passive income. Max ${MAX_MINERS_PER_TYPE} of each miner per sector.`}
          icon={Users}
          action={
            <span className="rounded-full border border-arcade-border bg-arcade-raised px-3 py-1 text-xs text-arcade-muted">
              Balance <span className="font-semibold text-arcade-gold">{balance.toLocaleString()}</span>
            </span>
          }
        />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {currentIsland?.miners.map((miner) => (
            <MinerCard
              key={miner.id}
              miner={miner}
              minerImage={getMinerImage(miner.id)}
              canBuy={canBuyMiner(currentIsland, miner.id, balance)}
              onBuy={() => currentIsland && onBuyMiner(currentIsland.id, miner.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MinerCard({
  miner,
  minerImage,
  canBuy,
  onBuy,
}: {
  miner: MinerData
  minerImage: string
  canBuy: boolean
  onBuy: () => void
}) {
  const maxed = miner.owned >= MAX_MINERS_PER_TYPE
  const roiDays = getMinerRoiDays(miner)

  return (
    <ArcadeCard className="group relative flex flex-col overflow-hidden p-3 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl border border-arcade-border bg-gradient-to-b from-arcade-raised to-black/40">
        <Image
          src={minerImage}
          alt={miner.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute left-2 top-2 rounded-full border border-arcade-border bg-black/60 px-2 py-0.5 text-[10px] font-bold text-arcade-text backdrop-blur">
          {miner.owned}/{MAX_MINERS_PER_TYPE}
        </span>
        <RarityBadge percentage={miner.percentage} className="absolute right-2 top-2" />
        <span className="absolute bottom-2 left-2 font-display text-sm text-white drop-shadow">
          {miner.name}
        </span>
        <span className="absolute bottom-2 right-2 rounded-full bg-arcade-gold/90 px-1.5 py-0.5 text-[10px] font-black text-[#3b2600]">
          {miner.percentage}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-arcade-muted">Per day</p>
          <CoinAmount value={miner.perDay.toLocaleString()} className="text-sm text-arcade-text" />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-arcade-muted">Break even</p>
          <span className="font-display text-sm text-arcade-cyan">
            {Number.isFinite(roiDays) ? `${roiDays.toFixed(1)}d` : "—"}
          </span>
        </div>
      </div>

      <div className="mt-2.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-arcade-gold-soft to-arcade-gold"
            style={{ width: `${(miner.owned / MAX_MINERS_PER_TYPE) * 100}%` }}
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={onBuy}
        disabled={!canBuy}
        className="arcade-cta mt-3 h-9 w-full rounded-lg text-xs font-bold"
      >
        {maxed ? (
          "MAXED"
        ) : (
          <>
            <Coins className="h-3.5 w-3.5" />
            Hire · {miner.price.toLocaleString()}
          </>
        )}
      </Button>
    </ArcadeCard>
  )
}
