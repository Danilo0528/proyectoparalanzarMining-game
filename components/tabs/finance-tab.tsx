"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  CheckCircle2,
  Copy,
  Link2,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  COINS_PER_DEPOSIT_USD,
  COINS_PER_USD,
  coinsToUsd,
  findWalletForMethod,
  usdToCoins,
  usdToCrypto,
} from "@/lib/game/finance"
import { ArcadeCard, CoinAmount, EmptyState, SectionHeading } from "@/components/game/ui"

interface FinanceTabProps {
  balance: number
  setBalance: (balance: number) => void
  email: string
  token: string
}

const PAYMENT_METHODS = [
  { id: "faucetpay", name: "FAUCETPAY", cryptoPrice: 1, symbol: "FP", color: "#136AF4" },
  { id: "trx", name: "TRX", cryptoPrice: 0.12, symbol: "TRX", color: "#EB3A39" },
  { id: "ton", name: "TON", cryptoPrice: 6.5, symbol: "TON", color: "#0098EA" },
  { id: "binance", name: "BINANCE BEP20", cryptoPrice: 600, symbol: "BNB", color: "#F3BA2F" },
  { id: "dogecoin", name: "DOGECOIN", cryptoPrice: 0.15, symbol: "Ð", color: "#C2A633" },
  { id: "litecoin", name: "LITECOIN", cryptoPrice: 85, symbol: "Ł", color: "#345D9D" },
  { id: "bitcoin", name: "BITCOIN", cryptoPrice: 65000, symbol: "₿", color: "#F7931A" },
  { id: "tether_trc20", name: "TETHER TRC20", cryptoPrice: 1, symbol: "₮", color: "#26A17B" },
  { id: "tether_bep20", name: "TETHER BEP20", cryptoPrice: 1, symbol: "₮", color: "#26A17B" },
]

const METHOD_TO_WALLET: Record<string, string> = {
  BITCOIN: "Bitcoin",
  DOGECOIN: "Dogecoin",
  LITECOIN: "Litecoin",
  TRX: "Tron",
  TON: "Toncoin",
  "BINANCE BEP20": "BNB",
  "TETHER TRC20": "USDT",
  "TETHER BEP20": "USDT",
  FAUCETPAY: "Bitcoin",
}

type Method = (typeof PAYMENT_METHODS)[0]
type Mode = "topup" | "payout"

export default function FinanceTab({ balance, setBalance, email, token }: FinanceTabProps) {
  const [activeView, setActiveView] = useState<"list" | "payout_detail" | "topup_detail">("list")
  const [mode, setMode] = useState<Mode>("topup")
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
  const [wallets, setWallets] = useState<any[]>([])
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [transactions, setTransactions] = usePersistentState<any[]>("melqo-transactions", [])
  const [amountInput, setAmountInput] = useState("")
  const [payoutAddress, setPayoutAddress] = useState("")
  const [txHash, setTxHash] = useState("")
  const [depositLoading, setDepositLoading] = useState(false)

  useEffect(() => {
    setWalletsLoading(true)
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => {
        setWallets(data.wallets || [])
        setWalletsLoading(false)
      })
      .catch(() => {
        setWalletsLoading(false)
      })
  }, [])

  const findWallet = (methodName: string) =>
    findWalletForMethod(wallets, methodName, METHOD_TO_WALLET)

  const openMethod = (method: Method) => {
    setSelectedMethod(method)
    setActiveView(mode === "topup" ? "topup_detail" : "payout_detail")
    setAmountInput("")
    setPayoutAddress("")
    setTxHash("")
  }

  const handlePayout = async () => {
    const amount = parseFloat(amountInput)
    if (isNaN(amount) || amount < 50) {
      toast.error("Minimum withdrawal is 50 coins.")
      return
    }
    if (amount > balance) {
      toast.error("Insufficient balance.")
      return
    }
    if (!payoutAddress) {
      toast.error("Please enter a payout address.")
      return
    }

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod?.name,
          address: payoutAddress,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setBalance(balance - amount)
        setTransactions([
          {
            id: Date.now(),
            type: "withdraw",
            amount,
            method: selectedMethod?.name,
            address: payoutAddress,
            date: new Date().toISOString().split("T")[0],
            status: "pending",
          },
          ...transactions,
        ])

        toast.success(`Withdrawal requested`, {
          description: `${amount.toLocaleString()} coins via ${selectedMethod?.name}.`,
        })
        setActiveView("list")
      } else {
        toast.error(data.error || "Withdrawal failed")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
  }

  const handleTopup = async () => {
    const amount = parseFloat(amountInput)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    const wallet = findWallet(selectedMethod?.name || "")
    if (!wallet || !wallet.address?.trim()) {
      toast.error(`${selectedMethod?.name} deposits are not available yet`, {
        description: "The admin has not configured this wallet.",
      })
      return
    }

    if (!txHash.trim()) {
      toast.error("Please enter the transaction hash or sender wallet address.")
      return
    }

    const minDeposit = wallet.minDepositUSD || 5
    if (amount < minDeposit) {
      toast.error(`Minimum deposit for ${selectedMethod?.name} is $${minDeposit} USD`)
      return
    }

    setDepositLoading(true)

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod?.name,
          txHash: txHash.trim(),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setBalance(balance + data.coinsAdded)
        setTransactions([
          {
            id: Date.now(),
            type: "deposit",
            amount: data.coinsAdded,
            method: selectedMethod?.name,
            txHash: txHash.trim(),
            date: new Date().toISOString().split("T")[0],
            status: "pending_verification",
          },
          ...transactions,
        ])

        toast.success(`${data.coinsAdded.toLocaleString()} coins are on the way`, {
          description: "Your deposit is being verified (usually 1–3 minutes).",
        })
        setActiveView("list")
        setTxHash("")
      } else {
        toast.error(data.error || "Top-up failed")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setDepositLoading(false)
    }
  }

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast.success("Address copied")
    } catch {
      toast.error("Could not copy the address")
    }
  }

  if (activeView === "payout_detail" && selectedMethod) {
    const giveGold = parseFloat(amountInput) || 0
    const getUsd = coinsToUsd(giveGold)
    const getCrypto = usdToCrypto(getUsd, selectedMethod.cryptoPrice)
    const totalPaid = transactions
      .filter((transaction) => transaction.type === "withdraw")
      .reduce((acc, transaction) => acc + transaction.amount / COINS_PER_USD, 0)

    return (
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => setActiveView("list")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-arcade-muted transition-colors hover:text-arcade-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to wallet
        </button>

        <ArcadeCard className="p-5 md:p-6">
          <SectionHeading
            eyebrow="Pay out"
            title={`Withdraw via ${selectedMethod.name}`}
            description="Convert mined coins into crypto."
            icon={ArrowUpFromLine}
            action={
              <span className="rounded-full border border-arcade-green/30 bg-arcade-green/10 px-3 py-1 text-xs text-arcade-green">
                Paid ${totalPaid.toFixed(2)}
              </span>
            }
          />

          <div className="mt-5 space-y-4">
            <Field label="You give (coins)">
              <Input
                type="number"
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                placeholder="2000"
                className="h-12 border-arcade-border bg-black/30 text-lg font-semibold text-arcade-text"
              />
              <p className="mt-1 text-xs text-arcade-muted">
                Minimum 50 coins · Balance {balance.toLocaleString()}
              </p>
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyValue label="You get (USD)" value={`$${getUsd.toFixed(4)}`} />
              <ReadOnlyValue
                label={`You get (${selectedMethod.name})`}
                value={getCrypto.toFixed(8)}
              />
            </div>

            <Field label="Payout address">
              <Input
                value={payoutAddress}
                onChange={(event) => setPayoutAddress(event.target.value)}
                placeholder="Enter your wallet address"
                className="h-12 border-arcade-border bg-black/30 text-sm text-arcade-text"
              />
            </Field>

            <Button
              type="button"
              onClick={handlePayout}
              className="arcade-cta h-12 w-full rounded-xl font-display text-sm uppercase tracking-[0.16em]"
            >
              Request pay out
            </Button>
          </div>
        </ArcadeCard>
      </div>
    )
  }

  if (activeView === "topup_detail" && selectedMethod) {
    const giveUsd = parseFloat(amountInput) || 0
    const getGold = usdToCoins(giveUsd)

    if (walletsLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-arcade-gold border-t-transparent" />
            <p className="text-arcade-muted">Loading wallet addresses…</p>
          </div>
        </div>
      )
    }

    const wallet = findWallet(selectedMethod.name)
    const isWalletConfigured = Boolean(wallet && wallet.address?.trim())

    return (
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => setActiveView("list")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-arcade-muted transition-colors hover:text-arcade-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to wallet
        </button>

        <ArcadeCard className="p-5 md:p-6">
          <SectionHeading
            eyebrow="Top up"
            title={`Deposit via ${selectedMethod.name}`}
            description="Send crypto and receive coins after verification."
            icon={ArrowDownToLine}
          />

          <div className="mt-5 space-y-4">
            {isWalletConfigured ? (
              <div className="rounded-2xl border border-arcade-green/30 bg-arcade-green/10 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-arcade-green">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Send payment to this address
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-arcade-border bg-black/40 p-2.5">
                  <p className="min-w-0 flex-1 break-all font-mono text-xs text-arcade-text">
                    {wallet.address}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyAddress(wallet.address)}
                    className="h-8 shrink-0 border-arcade-border bg-transparent text-arcade-muted"
                    aria-label="Copy wallet address"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-arcade-muted">
                  {wallet.network ? <span>Network: <span className="text-arcade-text">{wallet.network}</span></span> : null}
                  {wallet.minDepositUSD ? <span>Minimum: <span className="text-arcade-text">${wallet.minDepositUSD}</span></span> : null}
                </div>
                {wallet.instructions ? (
                  <p className="mt-2 text-xs text-arcade-muted">{wallet.instructions}</p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-arcade-gold/30 bg-arcade-gold/10 p-4 text-sm text-arcade-gold">
                This wallet is not configured yet. Choose another method or contact support.
              </div>
            )}

            <Field label="You send (USD)">
              <Input
                type="number"
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                placeholder="10"
                className="h-12 border-arcade-border bg-black/30 text-lg font-semibold text-arcade-text"
              />
            </Field>

            <ReadOnlyValue
              label="You receive"
              value={<CoinAmount value={getGold.toLocaleString()} className="text-lg text-arcade-gold" />}
            />

            <Field label="Transaction hash / TxID / from address">
              <Input
                type="text"
                value={txHash}
                onChange={(event) => setTxHash(event.target.value)}
                placeholder="0x…"
                className="h-12 border-arcade-border bg-black/30 text-sm text-arcade-text"
              />
              <p className="mt-1 text-xs text-arcade-muted">
                Required to verify your payment.
              </p>
            </Field>

            <Button
              type="button"
              onClick={handleTopup}
              disabled={!isWalletConfigured || depositLoading}
              className="arcade-cta h-12 w-full rounded-xl font-display text-sm uppercase tracking-[0.16em]"
            >
              {depositLoading
                ? "Processing…"
                : isWalletConfigured
                  ? "I already sent the payment"
                  : "Wallet not configured"}
            </Button>

            <p className="text-center text-xs text-arcade-muted">
              Coins are credited within 1–3 minutes after admin verification.
            </p>
          </div>
        </ArcadeCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Wallet"
          title="Top up & pay out"
          description="Move between crypto and coins. Deposits credit instantly after verification."
          icon={Wallet}
        />
        <div className="flex items-center gap-2 rounded-full border border-arcade-gold/30 bg-arcade-gold/10 px-4 py-2">
          <span className="text-xs uppercase tracking-wider text-arcade-muted">Balance</span>
          <CoinAmount value={balance.toLocaleString()} className="text-arcade-gold" />
        </div>
      </div>

      <div className="inline-flex w-full rounded-2xl border border-arcade-border bg-black/30 p-1 sm:w-auto">
        {(
          [
            { id: "topup" as Mode, label: "Top up", icon: ArrowDownToLine },
            { id: "payout" as Mode, label: "Pay out", icon: ArrowUpFromLine },
          ]
        ).map((item) => {
          const Icon = item.icon
          const active = mode === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              aria-pressed={active}
              className={
                active
                  ? "flex flex-1 items-center justify-center gap-2 rounded-xl bg-arcade-gold/15 px-5 py-2.5 text-sm font-semibold text-arcade-gold sm:flex-none"
                  : "flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-arcade-muted transition-colors hover:text-arcade-text sm:flex-none"
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-arcade-border bg-arcade-raised/60 px-4 py-3 text-sm">
        <span className="text-arcade-muted">
          {mode === "topup" ? "Deposit rate" : "Withdrawal rate"}
        </span>
        <span className="font-display text-arcade-gold">
          {mode === "topup" ? `$1 = ${COINS_PER_DEPOSIT_USD.toLocaleString()} coins` : `${COINS_PER_USD.toLocaleString()} coins = $1`}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PAYMENT_METHODS.map((method) => {
          const wallet = findWallet(method.name)
          const configured = Boolean(wallet && wallet.address?.trim())

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => openMethod(method)}
              className="group flex items-center gap-3 rounded-2xl border border-arcade-border bg-arcade-card/60 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-arcade-gold/40 hover:bg-white/5"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-inner"
                style={{ backgroundColor: method.color }}
              >
                {method.symbol}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-arcade-text">
                  {method.name}
                </span>
                <span className="block text-xs text-arcade-muted">
                  {mode === "topup"
                    ? configured
                      ? "Ready to receive"
                      : walletsLoading
                        ? "Checking…"
                        : "Not configured"
                    : "Withdraw to this network"}
                </span>
              </span>
              {mode === "topup" ? (
                <span
                  className={
                    configured
                      ? "h-2 w-2 rounded-full bg-arcade-green"
                      : "h-2 w-2 rounded-full bg-arcade-muted/50"
                  }
                  aria-hidden
                />
              ) : null}
              <Link2 className="h-4 w-4 shrink-0 text-arcade-muted transition-colors group-hover:text-arcade-gold" />
            </button>
          )
        })}
      </div>

      <ArcadeCard className="p-4 md:p-5">
        <SectionHeading
          eyebrow="History"
          title="Recent transactions"
          description="Your latest top-ups and payouts."
          icon={Wallet}
        />

        {transactions.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Wallet}
              title="No transactions yet"
              description="Your deposits and withdrawals will appear here once you make your first move."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-arcade-border/60">
            {transactions.slice(0, 8).map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={
                      transaction.type === "deposit"
                        ? "flex h-9 w-9 items-center justify-center rounded-xl border border-arcade-green/30 bg-arcade-green/10 text-arcade-green"
                        : "flex h-9 w-9 items-center justify-center rounded-xl border border-arcade-gold/30 bg-arcade-gold/10 text-arcade-gold"
                    }
                  >
                    {transaction.type === "deposit" ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : (
                      <ArrowUpFromLine className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-arcade-text">
                      {transaction.type === "deposit" ? "Top up" : "Payout"} · {transaction.method}
                    </p>
                    <p className="text-xs text-arcade-muted">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <CoinAmount
                    value={`${transaction.type === "deposit" ? "+" : "-"}${Number(transaction.amount).toLocaleString()}`}
                    className="text-sm text-arcade-text"
                  />
                  <p className="text-[10px] uppercase tracking-wider text-arcade-muted">
                    {transaction.status.replace("_", " ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ArcadeCard>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-arcade-muted">
        {label}
      </span>
      {children}
    </label>
  )
}

function ReadOnlyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-arcade-muted">
        {label}
      </span>
      <div className="flex h-12 items-center rounded-lg border border-arcade-border bg-black/20 px-3">
        {typeof value === "string" ? (
          <span className="text-base font-semibold text-arcade-text">{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
