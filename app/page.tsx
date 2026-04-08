"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import GameDashboard from "@/components/game-dashboard"
import AdminDashboard from "@/components/admin-dashboard"
import { usePersistentState } from "@/hooks/use-persistent-state"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn, isLoginInitialized] = usePersistentState("melqo-isLoggedIn", false)
  const [userEmail, setUserEmail] = usePersistentState("melqo-email", "")
  const [userToken, setUserToken] = usePersistentState("melqo-token", "")
  const [userRole, setUserRole] = usePersistentState("melqo-role", "user")
  const [userBalance, setUserBalance, isBalanceInitialized] = usePersistentState("melqo-balance", 500)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isLoginInitialized || !isBalanceInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4a534] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-[#4a3728]">Loading Melqo...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(email: string, token: string, role: string) => {
          setUserEmail(email)
          setUserToken(token)
          setUserRole(role)
          setIsLoggedIn(true)
        }}
      />
    )
  }

  // Show admin dashboard if user is admin
  if (userRole === 'admin') {
    return (
      <AdminDashboard
        email={userEmail}
        token={userToken}
        onLogout={() => {
          setIsLoggedIn(false)
          setUserEmail("")
          setUserToken("")
          setUserRole("user")
        }}
      />
    )
  }

  return (
    <GameDashboard
      balance={userBalance}
      setBalance={setUserBalance}
      email={userEmail}
      token={userToken}
      onLogout={() => {
        setIsLoggedIn(false)
        setUserEmail("")
        setUserToken("")
        setUserRole("user")
      }}
    />
  )
}
