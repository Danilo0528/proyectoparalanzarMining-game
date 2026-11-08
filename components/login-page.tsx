"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Eye,
  EyeOff,
  Gem,
  Lock,
  Mail,
  Pickaxe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LoginPageProps {
  onLogin: (email: string, token: string, role: string) => void
}

const STATS = [
  { icon: Users, label: "Players", value: "87,613" },
  { icon: Pickaxe, label: "New miners", value: "497" },
  { icon: ShieldCheck, label: "Online", value: "934" },
  { icon: Gem, label: "Project start", value: "28.03.2026" },
]

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const switchMode = (registering: boolean) => {
    setIsRegistering(registering)
    setError("")
  }

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          action: isRegistering ? "register" : "login",
        }),
      })
      const data = await res.json()

      if (data.success && data.token) {
        localStorage.setItem("melqo-token", data.token)
        localStorage.setItem("melqo-role", data.user.role || "user")

        if (data.user.balance) {
          localStorage.setItem("melqo-balance", JSON.stringify(data.user.balance))
        }

        onLogin(email, data.token, data.user.role || "user")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="arcade-bg arcade-grid min-h-screen">
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-6 px-4 py-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-10">
        {/* Hero */}
        <section className="relative order-2 hidden overflow-hidden rounded-3xl border border-arcade-border bg-arcade-surface lg:order-1 lg:flex lg:min-h-[640px] lg:flex-col lg:justify-between lg:p-8">
          <Image
            src="/images/bg-landscape.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/70 to-[#070b14]/20" />

          <div className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-arcade-gold/30 bg-arcade-raised">
              <Image
                src="/images/mine-icon.png"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 object-contain"
              />
            </span>
            <span className="font-display text-2xl tracking-[0.18em] text-arcade-text">
              MEL<span className="text-arcade-gold text-glow-gold">QO</span>
            </span>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-arcade-gold/30 bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-arcade-gold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Play-to-earn mining
            </span>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] text-arcade-text xl:text-5xl">
              Mine coins.
              <br />
              Build an <span className="text-arcade-gold text-glow-gold">empire.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-arcade-muted sm:text-base">
              Hire miners, upgrade your mines and turn idle time into real crypto.
              Your crew keeps digging even while you are away.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur"
                  >
                    <Icon className="mb-1 h-3.5 w-3.5 text-arcade-gold" />
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-arcade-muted">
                      {stat.label}
                    </p>
                    <p className="font-display text-sm text-arcade-text">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-arcade-muted">
            <TrendingUp className="h-4 w-4 text-arcade-green" />
            Passive income that keeps running 24/7.
          </div>

          <Image
            src="/images/miner-character.png"
            alt=""
            width={360}
            height={460}
            className="pointer-events-none absolute -bottom-2 right-0 h-[380px] w-auto object-contain opacity-95 xl:h-[440px]"
          />
        </section>

        {/* Form */}
        <section className="order-1 flex w-full flex-col items-center lg:order-2">
          <div className="mb-5 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-arcade-gold/30 bg-arcade-raised">
              <Image
                src="/images/mine-icon.png"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 object-contain"
              />
            </span>
            <span className="font-display text-2xl tracking-[0.18em] text-arcade-text">
              MEL<span className="text-arcade-gold">QO</span>
            </span>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-4 text-center lg:text-left">
              <h2 className="font-display text-2xl text-arcade-text">
                {isRegistering ? "Create your account" : "Welcome back, miner"}
              </h2>
              <p className="mt-1 text-sm text-arcade-muted">
                {isRegistering
                  ? "Start with a free crew and build your first mine."
                  : "Log in to collect your earnings and grow your crew."}
              </p>
            </div>

            <div className="arcade-card-raised p-5 sm:p-6">
              <div className="mb-5 inline-flex w-full rounded-xl border border-arcade-border bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  aria-pressed={!isRegistering}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    !isRegistering
                      ? "bg-arcade-gold/15 text-arcade-gold"
                      : "text-arcade-muted hover:text-arcade-text",
                  )}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  aria-pressed={isRegistering}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    isRegistering
                      ? "bg-arcade-gold/15 text-arcade-gold"
                      : "text-arcade-muted hover:text-arcade-text",
                  )}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-arcade-danger/40 bg-arcade-danger/10 px-3 py-2 text-sm text-arcade-danger"
                  >
                    {error}
                  </div>
                ) : null}

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-arcade-muted">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </span>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 border-arcade-border bg-black/30 text-arcade-text placeholder:text-arcade-muted/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-arcade-muted">
                    <Lock className="h-3.5 w-3.5" />
                    Password
                  </span>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete={isRegistering ? "new-password" : "current-password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 border-arcade-border bg-black/30 pr-11 text-arcade-text placeholder:text-arcade-muted/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg text-arcade-muted transition-colors hover:text-arcade-text"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {isRegistering ? (
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-arcade-muted">
                      <Lock className="h-3.5 w-3.5" />
                      Confirm password
                    </span>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="h-11 border-arcade-border bg-black/30 pr-11 text-arcade-text placeholder:text-arcade-muted/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg text-arcade-muted transition-colors hover:text-arcade-text"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </label>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="arcade-cta h-12 w-full rounded-xl font-display text-sm uppercase tracking-[0.16em]"
                >
                  {isLoading
                    ? "Processing…"
                    : isRegistering
                      ? "Create account"
                      : "Enter the mine"}
                </Button>
              </form>

              {!isRegistering ? (
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password reset is not available yet", {
                      description: "Contact support on Telegram and we will help you recover access.",
                    })
                  }
                  className="mt-3 w-full text-center text-xs text-arcade-muted underline underline-offset-4 transition-colors hover:text-arcade-text"
                >
                  Forgot your password?
                </button>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-arcade-muted">
              <a
                href="https://t.me/MelqoSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-arcade-gold"
              >
                Telegram support
              </a>
              <span className="h-3 w-px bg-arcade-border" />
              <a href="#" className="transition-colors hover:text-arcade-gold">
                Terms
              </a>
              <span className="h-3 w-px bg-arcade-border" />
              <a href="#" className="transition-colors hover:text-arcade-gold">
                Privacy
              </a>
            </div>
            <p className="mt-3 text-center text-[11px] text-arcade-muted/70">
              © {new Date().getFullYear()} Melqo Mining Game. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
