"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function PartnersTab() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://melqo.game/ref/USER123"

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referrals = [
    { id: 1, username: "Player_42", level: 1, earnings: 25, date: "2026-04-05" },
    { id: 2, username: "GoldMiner", level: 1, earnings: 15, date: "2026-04-04" },
    { id: 3, username: "CryptoKing", level: 2, earnings: 8, date: "2026-04-03" },
  ]

  const levels = [
    { level: 1, percentage: 7, description: "Direct referrals" },
    { level: 2, percentage: 3, description: "Referrals of your referrals" },
    { level: 3, percentage: 1, description: "3rd level referrals" },
  ]

  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <div 
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
          border: "3px solid #c4a574",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <h2 className="text-2xl font-bold text-[#4a3728] mb-4">Your Referral Link</h2>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/60 rounded-lg px-4 py-3 border border-[#c4a574]">
            <span className="text-[#4a3728] text-sm md:text-base truncate block">{referralLink}</span>
          </div>
          <Button
            onClick={handleCopy}
            className="bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold rounded-lg border-2 border-[#a67c00]"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#e8d5b0]/50 rounded-lg border-2 border-[#c4a574]">
            <p className="text-2xl font-bold text-[#d4a534]">3</p>
            <p className="text-sm text-[#6b5344]">Total Referrals</p>
          </div>
          <div className="p-3 bg-[#e8d5b0]/50 rounded-lg border-2 border-[#c4a574]">
            <p className="text-2xl font-bold text-[#d4a534]">48</p>
            <p className="text-sm text-[#6b5344]">Total Earnings</p>
          </div>
          <div className="p-3 bg-[#e8d5b0]/50 rounded-lg border-2 border-[#c4a574]">
            <p className="text-2xl font-bold text-[#d4a534]">2</p>
            <p className="text-sm text-[#6b5344]">Active Today</p>
          </div>
        </div>
      </div>

      {/* Referral Levels */}
      <div 
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
          border: "3px solid #c4a574",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <h2 className="text-2xl font-bold text-[#4a3728] mb-4">Referral Program</h2>
        <div className="space-y-3">
          {levels.map(level => (
            <div 
              key={level.level}
              className="p-4 rounded-lg bg-[#e8d5b0]/50 border-2 border-[#c4a574] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#f5d742] to-[#d4a534] flex items-center justify-center">
                  <span className="text-xl font-bold text-[#4a3728]">{level.level}</span>
                </div>
                <div>
                  <p className="font-bold text-[#4a3728]">Level {level.level}</p>
                  <p className="text-sm text-[#6b5344]">{level.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#d4a534]">{level.percentage}%</p>
                <p className="text-xs text-[#6b5344]">Commission</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral List */}
      <div 
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
          border: "3px solid #c4a574",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <h2 className="text-2xl font-bold text-[#4a3728] mb-4">Your Referrals</h2>
        {referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map(ref => (
              <div 
                key={ref.id}
                className="p-4 rounded-lg bg-[#e8d5b0]/50 border-2 border-[#c4a574] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c4a574] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#4a3728">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 14c-6 0-8 3-8 6v2h16v-2c0-3-2-6-8-6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#4a3728]">{ref.username}</p>
                    <p className="text-xs text-[#6b5344]">Level {ref.level} - Joined {ref.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#d4a534">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="font-bold text-[#4a3728]">+{ref.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4" fill="#c4a574">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <p className="text-[#6b5344]">No referrals yet. Share your link to start earning!</p>
          </div>
        )}
      </div>
    </div>
  )
}
