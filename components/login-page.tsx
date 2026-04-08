"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface LoginPageProps {
  onLogin: (email: string, token: string, role: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          action: isRegistering ? 'register' : 'login'
        })
      })
      const data = await res.json()

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('melqo-token', data.token)
        localStorage.setItem('melqo-role', data.user.role || 'user')

        if (data.user.balance) {
          localStorage.setItem('melqo-balance', JSON.stringify(data.user.balance))
        }

        onLogin(email, data.token, data.user.role || 'user')
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg-landscape.jpg')"
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-sky-600/30" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 md:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 
              className="text-4xl md:text-5xl font-bold tracking-wider"
              style={{
                color: "#d4a534",
                textShadow: "2px 2px 0 #8B4513, 4px 4px 0 #654321, 0 0 20px rgba(212, 165, 52, 0.5)"
              }}
            >
              Melqo
            </h1>
          </div>

          {/* Create Account Button */}
          <Button 
            onClick={() => setIsRegistering(true)}
            className="bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold px-6 py-2 rounded-full shadow-lg border-2 border-[#a67c00]"
          >
            Create an account
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-3 px-4 mt-2 md:mt-4">
          <StatCard icon="pickaxe" label="PLAYERS" value="87 613" />
          <StatCard icon="mouse" label="NEW PLAYERS" value="497" />
          <StatCard icon="helmet" label="ONLINE" value="934" />
          <StatCard icon="hourglass" label="PROJECT START" value="28.03.2026" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-start justify-start px-4 md:px-8 mt-8 md:mt-12">
          {/* Login Form */}
          <div 
            className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-2xl relative"
            style={{
              background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 50%, #d9c4a0 100%)",
              border: "3px solid #c4a574",
              boxShadow: "inset 0 2px 10px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-center text-[#4a3728] mb-6 tracking-wide">
                {isRegistering ? "REGISTRATION" : "AUTHORIZATION"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border-2 border-red-500 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3 border border-[#c4a574]">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4a534]" fill="currentColor">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 14c-6 0-8 3-8 6v2h16v-2c0-3-2-6-8-6z" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-[#4a3728] placeholder:text-[#6b5344]/70"
                  />
                </div>

                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3 border border-[#c4a574]">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4a534]" fill="currentColor">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M12 3a4 4 0 0 0-4 4v4h8V7a4 4 0 0 0-4-4z" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-[#4a3728] placeholder:text-[#6b5344]/70"
                  />
                </div>

                {isRegistering && (
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3 border border-[#c4a574]">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4a534]" fill="currentColor">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M12 3a4 4 0 0 0-4 4v4h8V7a4 4 0 0 0-4-4z" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-0 bg-transparent focus-visible:ring-0 text-[#4a3728] placeholder:text-[#6b5344]/70"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {!isRegistering && (
                    <button 
                      type="button"
                      className="text-sm text-[#6b5344] hover:text-[#4a3728] underline"
                    >
                      Forgot your password?
                    </button>
                  )}
                  {isRegistering && (
                    <button 
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-sm text-[#6b5344] hover:text-[#4a3728] underline"
                    >
                      Already have an account?
                    </button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-b from-[#f5d742] to-[#d4a534] hover:from-[#f5d742] hover:to-[#c49a2f] text-[#4a3728] font-bold px-8 py-2 rounded-full shadow-lg border-2 border-[#a67c00] disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : isRegistering ? "Register" : "Log in"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Miner Character */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[400px] md:w-[500px] md:h-[600px] pointer-events-none">
          <Image
            src="/images/miner-character.png"
            alt="Miner Character"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: "pickaxe" | "mouse" | "helmet" | "hourglass"
  label: string
  value: string
}

function StatCard({ icon, label, value }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "pickaxe":
        return (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#8B4513">
            <path d="M14.79,10.62L3.5,21.9L2.1,20.5L13.38,9.21C12.21,7.21 12.56,4.58 14.38,2.76L15.79,4.17C14.59,5.37 14.37,7.2 15.15,8.62L19.76,4L21.17,5.41L16.56,10C17.97,10.79 19.8,10.57 21,9.37L22.41,10.79C20.59,12.61 17.96,12.96 15.96,11.79Z" />
          </svg>
        )
      case "mouse":
        return (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#C06C84">
            <path d="M11,1.07C7.05,1.56 4,4.92 4,9H11M4,15A8,8 0 0,0 12,23A8,8 0 0,0 20,15V11H4M13,1.07V9H20C20,4.92 16.94,1.56 13,1.07Z" />
          </svg>
        )
      case "helmet":
        return (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#d4a534">
            <path d="M12,2C6.48,2 2,6.48 2,12C2,14.85 3.17,17.4 5.08,19.19L6.5,17.77C5.56,16.44 5,14.79 5,13C5,8.03 9.03,4 14,4C14.34,4 14.68,4.03 15,4.08V2.05C14,2 13,2 12,2M16,5V7.5L13.5,10L16,12.5V15C18.76,15 21,12.76 21,10C21,7.24 18.76,5 16,5Z" />
            <circle cx="12" cy="8" r="6" fill="#d4a534" />
            <ellipse cx="12" cy="12" rx="8" ry="5" fill="#d4a534" />
          </svg>
        )
      case "hourglass":
        return (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#d4a534">
            <path d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z" />
          </svg>
        )
    }
  }

  return (
    <div 
      className="flex items-center gap-3 px-4 py-2 rounded-lg min-w-[140px]"
      style={{
        background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)",
        border: "2px solid #c4a574",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      {getIcon()}
      <div className="flex flex-col">
        <span className="text-xs text-[#6b5344] font-medium">{label}</span>
        <span className="text-lg font-bold text-[#4a3728]">{value}</span>
      </div>
    </div>
  )
}
