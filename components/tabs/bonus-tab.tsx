"use client"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { Button } from "@/components/ui/button"

interface BonusTabProps {
  balance: number
  setBalance: (balance: number) => void
}

export default function BonusTab({ balance, setBalance }: BonusTabProps) {
  // Store claims as { bonusId: timestamp_of_last_claim }
  const [claims, setClaims] = usePersistentState<Record<number, number>>("melqo-claims", {})
  
  const bonuses = [
    { id: 1, name: "Daily Bonus", amount: 100, icon: "calendar", cooldownHours: 24 },
    { id: 2, name: "Watch Ad", amount: 25, icon: "play", cooldownHours: 1 },
    { id: 3, name: "Social Share", amount: 50, icon: "share", cooldownHours: 12 },
    { id: 4, name: "Lucky Wheel", amount: 75, icon: "wheel", cooldownHours: 6 },
  ]

  const handleClaim = (bonusId: number, amount: number, cooldownHours: number) => {
    const now = Date.now()
    const lastClaimTime = claims[bonusId] || 0
    const cooldownMs = cooldownHours * 60 * 60 * 1000

    if (now - lastClaimTime >= cooldownMs) {
      setBalance(balance + amount)
      setClaims(prev => ({ ...prev, [bonusId]: now }))
    }
  }

  const getTimeLeft = (bonusId: number, cooldownHours: number) => {
    const lastClaimTime = claims[bonusId] || 0
    const cooldownMs = cooldownHours * 60 * 60 * 1000
    const timeLeftMs = cooldownMs - (Date.now() - lastClaimTime)
    
    if (timeLeftMs <= 0) return null

    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m left`
  }

  const [achievements, setAchievements] = usePersistentState("melqo-achievements", [
    { id: 1, name: "First Miner", description: "Log in for the first time", reward: 50, claimed: false },
    { id: 2, name: "Wealthy", description: "Reach 1,000 balance", reward: 100, claimed: false },
  ])

  // Real-time achievement unlock check
  const handleClaimAchievement = (achievementId: number, reward: number) => {
    setBalance(balance + reward)
    setAchievements(prev => prev.map(a => a.id === achievementId ? { ...a, claimed: true } : a))
  }

  return (
    <div className="space-y-6">
      {/* Daily Bonuses */}
      <div 
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
          border: "3px solid #c4a574",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <h2 className="text-2xl font-bold text-[#4a3728] mb-4">Daily Bonuses</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bonuses.map(bonus => {
            const timeLeft = getTimeLeft(bonus.id, bonus.cooldownHours)
            const canClaim = !timeLeft

            return (
              <div 
                key={bonus.id}
                className="p-4 rounded-lg bg-[#e8d5b0]/50 border-2 border-[#c4a574] flex flex-col items-center relative overflow-hidden"
              >
                {!canClaim && <div className="absolute inset-0 bg-[#e8d5b0]/70 z-10 flex items-center justify-center flex-col font-bold text-[#4a3728] backdrop-blur-[1px]"><span className="text-xs">Wait</span><span>{timeLeft}</span></div>}
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#f5d742] to-[#d4a534] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#4a3728">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#4a3728] text-center">{bonus.name}</h3>
                <div className="flex items-center gap-1 my-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#d4a534">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="font-bold text-[#4a3728]">{bonus.amount}</span>
                </div>
                <Button
                  onClick={() => handleClaim(bonus.id, bonus.amount, bonus.cooldownHours)}
                  className="w-full bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold rounded-full border-2 border-[#a67c00]"
                >
                  Claim
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div 
        className="p-6 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
          border: "3px solid #c4a574",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <h2 className="text-2xl font-bold text-[#4a3728] mb-4">Achievements</h2>
        <div className="space-y-3">
          {achievements.map(achievement => {
             // Logic to check if unlockable
             const isMet = (achievement.id === 1) || (achievement.id === 2 && balance >= 1000);
             return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                  achievement.claimed 
                    ? "bg-[#d4a534]/20 border-[#d4a534]" 
                    : "bg-[#e8d5b0]/50 border-[#c4a574]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.claimed 
                      ? "bg-gradient-to-b from-[#f5d742] to-[#d4a534]" 
                      : "bg-[#c4a574]/50"
                  }`}>
                    {achievement.claimed ? "✔" : "🔒"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4a3728]">{achievement.name}</h3>
                    <p className="text-sm text-[#6b5344]">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!achievement.claimed ? (
                     <Button 
                        disabled={!isMet} 
                        onClick={() => handleClaimAchievement(achievement.id, achievement.reward)}
                        className="bg-green-500 hover:bg-green-600 border-2 border-green-700 text-white font-bold h-8 text-xs disabled:opacity-30 disabled:pointer-events-none"
                     >
                       {isMet ? `Claim +${achievement.reward}` : "Locked"}
                     </Button>
                  ) : (
                    <span className="font-bold text-[#4a3728] opacity-50">Claimed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
