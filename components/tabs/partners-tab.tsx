"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Link2, Share2, UserPlus, Users, Wallet } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { buildReferralLink } from "@/lib/game/referral"
import { ArcadeCard, CoinAmount, EmptyState, SectionHeading, StatTile } from "@/components/game/ui"

interface PartnersTabProps {
  email: string
}

const LEVELS = [
  { level: 1, percentage: 7, description: "Direct referrals" },
  { level: 2, percentage: 3, description: "Referrals of your referrals" },
  { level: 3, percentage: 1, description: "Third-level referrals" },
]

export default function PartnersTab({ email }: PartnersTabProps) {
  const [copied, setCopied] = useState(false)
  const [referralData, setReferralData] = useState<any>({
    referrals: [],
    referralEarnings: 0,
    totalReferrals: 0,
  })
  const [loading, setLoading] = useState(true)
  const [referralLink, setReferralLink] = useState("")

  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.origin : "https://melqo.app"
    setReferralLink(buildReferralLink(host, email))
  }, [email])

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem("melqo-token")
        const res = await fetch("/api/referral", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setReferralData(data)
        }
      } catch {
        // Keep the empty state when the request fails.
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success("Referral link copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy the link")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-arcade-gold border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Partners"
        title="Invite miners, earn together"
        description="Share your link and earn commission from every referral, three levels deep."
        icon={Users}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={UserPlus}
          label="Total referrals"
          value={referralData.totalReferrals || 0}
          tone="cyan"
        />
        <StatTile
          icon={Wallet}
          label="Referral earnings"
          value={<CoinAmount value={Number(referralData.referralEarnings || 0).toFixed(0)} />}
          tone="gold"
        />
        <StatTile
          icon={Share2}
          label="Top commission"
          value="7%"
          hint="Level 1 direct referrals"
          tone="violet"
        />
      </div>

      <ArcadeCard className="p-5 md:p-6">
        <SectionHeading
          eyebrow="Your link"
          title="Share and grow"
          description="Every player who joins from this link is tracked to your account."
          icon={Link2}
        />

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-arcade-border bg-black/30 px-3 py-2.5">
            <Link2 className="h-4 w-4 shrink-0 text-arcade-muted" />
            <span className="truncate text-sm text-arcade-text">{referralLink}</span>
          </div>
          <Button
            type="button"
            onClick={handleCopy}
            className="arcade-cta h-11 shrink-0 rounded-xl px-5 text-sm font-bold"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </ArcadeCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ArcadeCard className="p-5 md:p-6">
          <SectionHeading
            eyebrow="Program"
            title="Commission levels"
            description="The more your network mines, the more you earn."
            icon={Share2}
          />

          <div className="mt-4 space-y-3">
            {LEVELS.map((level) => (
              <div
                key={level.level}
                className="flex items-center justify-between gap-3 rounded-xl border border-arcade-border bg-black/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-arcade-gold/30 bg-arcade-gold/10 font-display text-arcade-gold">
                    {level.level}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-arcade-text">Level {level.level}</p>
                    <p className="text-xs text-arcade-muted">{level.description}</p>
                  </div>
                </div>
                <span className="font-display text-xl text-arcade-gold">{level.percentage}%</span>
              </div>
            ))}
          </div>
        </ArcadeCard>

        <ArcadeCard className="p-5 md:p-6">
          <SectionHeading
            eyebrow="Network"
            title="Your referrals"
            description="Players who joined with your link."
            icon={Users}
          />

          <div className="mt-4">
            {referralData.referrals && referralData.referrals.length > 0 ? (
              <ul className="divide-y divide-arcade-border/60">
                {referralData.referrals.map((referral: any, index: number) => (
                  <li key={index} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-arcade-violet to-arcade-cyan text-xs font-bold text-white">
                        {String(referral.email || "?").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-arcade-text">
                          {referral.email}
                        </p>
                        <p className="text-xs text-arcade-muted">
                          Level {referral.level} · Joined{" "}
                          {new Date(referral.referredAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <CoinAmount
                      value={`+${Number(referral.earnings || 0).toLocaleString()}`}
                      className="text-sm text-arcade-green"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={UserPlus}
                title="No referrals yet"
                description="Share your link to start building your mining network."
              />
            )}
          </div>
        </ArcadeCard>
      </div>
    </div>
  )
}
