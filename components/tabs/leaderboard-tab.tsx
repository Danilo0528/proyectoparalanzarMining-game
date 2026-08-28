"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface LeaderboardUser {
  email: string;
  balance: number;
}

export default function LeaderboardTab() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300 relative pb-10">
      
      {/* Header Banner */}
      <div className="relative flex justify-center mb-6">
        <div
          className="px-12 py-3 inline-block relative shadow-md"
          style={{
            background: "linear-gradient(to right, #f4ecd8, #e8d5b0, #f4ecd8)",
            borderTop: "1px solid #fff",
            borderBottom: "2px solid #c4a574",
            clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)"
          }}
        >
          <h2 className="text-xl md:text-2xl font-black text-[#5c442c] uppercase tracking-widest">
            🏆 Top Miners 🏆
          </h2>
        </div>
      </div>

      <div 
        className="p-6 md:p-8 rounded-lg relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(232, 213, 176, 0.95), rgba(245, 230, 200, 0.95))",
          border: "3px solid #c4a574",
          boxShadow: "inset 0 0 20px rgba(92, 68, 44, 0.05), 0 10px 25px rgba(0,0,0,0.2)"
        }}
      >
        <p className="text-center text-[#6b5344] font-bold mb-6">
          The wealthiest miners globally. Compete for the top spot!
        </p>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-16 h-16 border-4 border-[#d4a534] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-transform hover:scale-[1.01] ${
                    index === 0 ? "bg-gradient-to-r from-[#fff3cd] to-[#f5d742] border-[#d4a534] shadow-md" :
                    index === 1 ? "bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] border-[#b0b0b0] shadow-sm" :
                    index === 2 ? "bg-gradient-to-r from-[#ffe8cc] to-[#ffc88a] border-[#c0803a] shadow-sm" :
                    "bg-white/60 border-[#e8d5b0] hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                      index === 0 ? "bg-[#d4a534] text-white" :
                      index === 1 ? "bg-[#9da1a3] text-white" :
                      index === 2 ? "bg-[#c0803a] text-white" :
                      "bg-[#e8d5b0] text-[#5c442c]"
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <span className="font-bold text-[#5c442c] text-lg">{user.email}</span>
                      {index === 0 && <span className="ml-2 text-xs font-bold text-[#d4a534] bg-white px-2 py-0.5 rounded-full border border-[#d4a534]">KING</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl mr-1 drop-shadow-sm">🪙</span>
                    <span className="font-black text-lg text-[#5c442c]">{user.balance.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-[#6b5344]">
                <p>No miners found yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
