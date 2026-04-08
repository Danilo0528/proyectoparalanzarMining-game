"use client"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Image from "next/image"

interface FinanceTabProps {
  balance: number
  setBalance: (balance: number) => void
  email: string
  token: string
}

const PAYMENT_METHODS = [
  { id: 'faucetpay', name: 'FAUCETPAY', cryptoPrice: 1 }, 
  { id: 'trx', name: 'TRX', cryptoPrice: 0.12 },
  { id: 'ton', name: 'TON', cryptoPrice: 6.5 },
  { id: 'binance', name: 'BINANCE BEP20', cryptoPrice: 600 },
  { id: 'dogecoin', name: 'DOGECOIN', cryptoPrice: 0.15 },
  { id: 'litecoin', name: 'LITECOIN', cryptoPrice: 85 },
  { id: 'bitcoin', name: 'BITCOIN', cryptoPrice: 65000 },
  { id: 'tether_trc20', name: 'TETHER TRC20', cryptoPrice: 1 },
  { id: 'tether_bep20', name: 'TETHER BEP20', cryptoPrice: 1 },
]

export default function FinanceTab({ balance, setBalance, email, token }: FinanceTabProps) {
  const [activeView, setActiveView] = useState<"list" | "payout_detail" | "topup_detail" | "wallets">("list")
  const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null)
  const [wallets, setWallets] = useState<any[]>([])

  const [transactions, setTransactions] = usePersistentState<any[]>("melqo-transactions", [])

  // Fetch enabled wallets from backend
  useEffect(() => {
    fetch('/api/wallets')
      .then(res => res.json())
      .then(data => setWallets(data.wallets || []))
      .catch(err => console.error('Failed to fetch wallets:', err))
  }, [])

  // Detailed view state
  const [payoutInput, setPayoutInput] = useState("")
  const [payoutAddress, setPayoutAddress] = useState("")

  const handleMethodClick = (method: typeof PAYMENT_METHODS[0], type: "topup" | "payout") => {
    setSelectedMethod(method)
    setActiveView(type === "topup" ? "topup_detail" : "payout_detail")
    setPayoutInput("")
    setPayoutAddress("")
  }

  const handlePayout = async () => {
    const amount = parseFloat(payoutInput)
    if (isNaN(amount) || amount < 50) {
      alert("Minimum withdrawal is 50 coins.")
      return
    }
    if (amount > balance) {
      alert("Insufficient balance.")
      return
    }
    if (!payoutAddress) {
      alert("Please enter a payout address.")
      return
    }

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod?.name,
          address: payoutAddress
        })
      })

      const data = await res.json()

      if (data.success) {
        // Update local balance
        setBalance(balance - amount)

        // Add to local transactions list
        setTransactions([{
          id: Date.now(),
          type: "withdraw",
          amount,
          method: selectedMethod?.name,
          address: payoutAddress,
          date: new Date().toISOString().split('T')[0],
          status: "pending"
        }, ...transactions])

        alert(`Withdrawal request for ${amount} coins via ${selectedMethod?.name} submitted!`)
        setActiveView("list")
      } else {
        alert(data.error || "Withdrawal failed")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleTopup = async () => {
    const amount = parseFloat(payoutInput)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    // Map payment method names to wallet names in DB
    const methodToWalletName: Record<string, string> = {
      'BITCOIN': 'Bitcoin',
      'DOGECOIN': 'Dogecoin',
      'LITECOIN': 'Litecoin',
      'TRX': 'Tron',
      'TON': 'Toncoin',
      'BINANCE BEP20': 'BNB',
      'TETHER TRC20': 'USDT',
      'TETHER BEP20': 'USDT',
      'FAUCETPAY': 'Bitcoin',
    }

    // Check if wallet is configured before attempting deposit (with name mapping)
    const walletName = methodToWalletName[selectedMethod?.name] || selectedMethod?.name
    const selectedWallet = wallets.find(w =>
      w.name.toLowerCase() === walletName.toLowerCase()
    )
    if (!selectedWallet || !selectedWallet.enabled || !selectedWallet.address?.trim()) {
      alert(`⚠️ Deposits via ${selectedMethod?.name} are not available yet. Admin has not configured this wallet.`)
      return
    }

    // Check minimum deposit
    const minDeposit = selectedWallet.minDepositUSD || 5
    if (amount < minDeposit) {
      alert(`Minimum deposit for ${selectedMethod?.name} is $${minDeposit} USD`)
      return
    }

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod?.name
        })
      })

      const data = await res.json()

      if (data.success) {
        // Update local balance (already credited in database)
        setBalance(balance + data.coinsAdded)

        // Add to local transactions list
        setTransactions([{
          id: Date.now(),
          type: "deposit",
          amount: data.coinsAdded,
          method: selectedMethod?.name,
          date: new Date().toISOString().split('T')[0],
          status: "pending_verification"
        }, ...transactions])

        alert(`✅ ${data.coinsAdded.toLocaleString()} gold coins credited to your account!\n\n⏳ Your deposit is pending admin verification.`)
        setActiveView("list")
      } else {
        alert(data.error || "Top-up failed")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const renderRibbon = (title: string) => (
    <div className="relative flex justify-center mb-4 md:mb-6">
      <div 
        className="px-10 py-2 inline-block relative shadow-md"
        style={{
          background: "linear-gradient(to right, #f4ecd8, #e8d5b0, #f4ecd8)",
          borderTop: "1px solid #fff",
          clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)"
        }}
      >
        <h2 className="text-lg md:text-xl font-bold text-[#5c442c] uppercase tracking-wider">{title}</h2>
      </div>
    </div>
  )

  const renderConversionRate = (rateText: string) => (
    <div 
        className="p-3 text-center mb-6 shadow-sm relative overflow-hidden"
        style={{
            background: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.04\\'/%3E%3C/svg%3E'), #fdf7ec",
            borderTop: "3px solid #d6c19f",
            borderBottom: "3px solid #d6c19f",
            clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)"
        }}
    >
      <span className="text-xs text-[#8c745c] block mb-1">Conversion rate</span>
      <span className="text-lg font-black text-[#5c442c] flex items-center justify-center gap-2">
        {rateText}
      </span>
    </div>
  )

  if (activeView === "payout_detail" && selectedMethod) {
    const giveGold = parseFloat(payoutInput) || 0
    const getUSD = giveGold / 2000
    const getCrypto = getUSD / selectedMethod.cryptoPrice

    // Check if the user has a total transactions sum to display "TOTAL PAID"
    const totalPaid = transactions.filter(t => t.type === "withdraw").reduce((acc, t) => acc + (t.amount / 2000), 0)

    return (
      <div className="flex flex-col md:flex-row h-full gap-8 relative animate-in fade-in zoom-in duration-300">
        
        {/* Left background miner image styling */}
        <div className="hidden md:flex md:w-5/12 relative min-h-[400px] rounded-xl overflow-hidden items-end justify-center">
            {/* The background character concept from the reference */}
           <Image src="/images/mine-entrance.png" alt="Miner Context" fill className="object-cover scale-150 transform translate-y-12 opacity-90" />
           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f5e6c8] to-transparent h-1/3"></div>
        </div>

        {/* Right side parchment form */}
        <div className="w-full md:w-7/12 p-6 md:p-8 rounded-sm shadow-2xl relative border border-[#c4a574]/40" style={{ 
          background: "linear-gradient(135deg, rgba(232, 213, 176, 0.95), rgba(245, 230, 200, 0.95)), url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.08\\'/%3E%3C/svg%3E')",
          boxShadow: "inset 0 0 20px rgba(92, 68, 44, 0.1), 0 10px 30px rgba(0,0,0,0.15)",
          clipPath: "polygon(1% 0, 99% 2%, 100% 98%, 0 100%)" // Slightly irregular edges for paper feel
        }}>
          
          <Button variant="ghost" onClick={() => setActiveView("list")} className="absolute top-4 left-4 text-[#5c442c] hover:bg-[#d6c19f]/30">
              ← Back
          </Button>

          <div className="flex justify-end mb-6 pt-2">
            <span className="text-sm font-black text-[#5c442c] uppercase bg-white/40 px-3 py-1 rounded-sm border border-[#d6c19f] shadow-sm">
                Total Paid: <span className="text-green-700">${totalPaid.toFixed(2)}</span>
            </span>
          </div>

          <div className="space-y-6 max-w-sm mx-auto">
            <div>
              <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">You give</label>
              <div className="bg-[#fef9f0] flex items-center p-2 rounded-sm shadow-inner relative group">
                <span className="text-2xl mr-3 opacity-90 pl-2">🪙</span>
                <Input 
                  type="number" 
                  value={payoutInput} 
                  onChange={e => setPayoutInput(e.target.value)}
                  placeholder="2000"
                  className="border-0 bg-transparent text-xl font-bold text-[#5c442c] w-full focus-visible:ring-0 shadow-none px-0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">You get</label>
              <div className="bg-[#d6c19f]/20 flex items-center p-2 rounded-sm opacity-80 shadow-inner">
                <span className="text-2xl mr-3 font-bold text-green-700 pl-2">$</span>
                <span className="text-xl font-bold text-[#5c442c] block w-full">{getUSD.toFixed(4)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">Get {selectedMethod.name} coins:</label>
              <div className="bg-[#d6c19f]/20 flex items-center p-2 rounded-sm opacity-80 shadow-inner">
                <div className="w-8 h-8 rounded-full bg-[#f5d742] mr-3 flex items-center justify-center text-[#5c442c] font-black italic text-[10px] ml-1 shadow-sm">B</div>
                <span className="text-xl font-bold text-[#5c442c] block w-full">{getCrypto.toFixed(8)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">My address:</label>
              <div className="bg-[#d6c19f]/20 flex items-center p-1 rounded-sm shadow-inner group transition-all">
                <div className="p-2 mr-2">
                  <div className="w-6 h-6 rounded-full bg-[#f5d742] flex items-center justify-center text-[#5c442c] font-bold text-[8px] shadow-sm">💰</div>
                </div>
                <Input 
                  value={payoutAddress}
                  onChange={e => setPayoutAddress(e.target.value)}
                  placeholder="SET PAYOUT ADDRESS."
                  className="border-0 bg-transparent uppercase font-bold text-[#5c442c] focus-visible:ring-0 shadow-none text-sm placeholder:text-[#8c745c]"
                />
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <Button 
                onClick={handlePayout}
                className="bg-gradient-to-r from-[#f5d742] via-[#e6c229] to-[#d4a534] hover:brightness-110 text-[#5c442c] font-black uppercase tracking-wider px-10 py-6 rounded-full shadow-lg border-b-4 border-[#a67c00] active:border-b-0 active:translate-y-1 transition-all"
              >
                Pay out
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Map payment method names to wallet names in DB
  const methodToWalletName: Record<string, string> = {
    'BITCOIN': 'Bitcoin',
    'DOGECOIN': 'Dogecoin',
    'LITECOIN': 'Litecoin',
    'TRX': 'Tron',
    'TON': 'Toncoin',
    'BINANCE BEP20': 'BNB',
    'TETHER TRC20': 'USDT',
    'TETHER BEP20': 'USDT',
    'FAUCETPAY': 'Bitcoin',
  }

  if (activeView === "topup_detail" && selectedMethod) {
    const giveUSD = parseFloat(payoutInput) || 0
    const getGold = giveUSD * 1000

    // Find the configured wallet for this method (mapped name)
    const walletName = methodToWalletName[selectedMethod.name] || selectedMethod.name
    const configuredWallet = wallets.find(w =>
      w.name.toLowerCase() === walletName.toLowerCase()
    )
    const isWalletConfigured = configuredWallet && configuredWallet.enabled && configuredWallet.address?.trim()

    return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300 py-8">
        <div className="w-full max-w-md bg-[#e8d5b0] p-6 md:p-8 rounded-sm shadow-2xl relative" style={{
            background: "linear-gradient(135deg, rgba(232, 213, 176, 0.95), rgba(245, 230, 200, 0.95))",
            boxShadow: "inset 0 0 20px rgba(92, 68, 44, 0.1), 0 10px 30px rgba(0,0,0,0.15)",
            clipPath: "polygon(0 0, 100% 2%, 99% 100%, 1% 98%)"
          }}>
            <Button variant="ghost" onClick={() => setActiveView("list")} className="absolute top-4 left-4 text-[#5c442c] hover:bg-[#d6c19f]/30">
                ← Back
            </Button>

            <h3 className="text-2xl font-black text-[#5c442c] mb-4 mt-4 uppercase text-center">{selectedMethod.name} Top Up</h3>

            {/* Wallet Address Section */}
            {isWalletConfigured ? (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
                <p className="text-sm font-bold text-green-800 mb-2">📍 Send payment to this address:</p>
                <div className="p-3 bg-white rounded-lg border border-green-300">
                  <p className="font-mono text-xs text-[#4a3728] break-all select-all">
                    {configuredWallet.address}
                  </p>
                </div>
                {configuredWallet.network && (
                  <p className="text-xs text-green-700 mt-2">🌐 Network: <strong>{configuredWallet.network}</strong></p>
                )}
                {configuredWallet.minDepositUSD && (
                  <p className="text-xs text-green-700 mt-1">💰 Minimum: <strong>${configuredWallet.minDepositUSD} USD</strong></p>
                )}
                {configuredWallet.instructions && (
                  <p className="text-xs text-green-700 mt-1">📝 {configuredWallet.instructions}</p>
                )}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <p className="text-sm font-bold text-yellow-800">⚠️ This wallet is not configured yet.</p>
                <p className="text-xs text-yellow-700 mt-1">Please choose another payment method or contact support.</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">You send ($)</label>
                <div className="bg-[#fef9f0] flex items-center p-2 rounded-sm shadow-inner relative group">
                  <span className="text-2xl mr-3 font-bold text-green-700 pl-2">$</span>
                  <Input
                    type="number"
                    value={payoutInput}
                    onChange={e => setPayoutInput(e.target.value)}
                    placeholder="10"
                    className="border-0 bg-transparent text-xl font-bold text-[#5c442c] w-full focus-visible:ring-0 shadow-none px-0"
                  />
                </div>
              </div>

               <div>
                <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">You receive (🪙)</label>
                <div className="bg-[#d6c19f]/20 flex items-center p-2 rounded-sm opacity-80 shadow-inner">
                  <span className="text-2xl mr-3 pl-2">🪙</span>
                  <span className="text-xl font-bold text-[#5c442c] block w-full">{getGold.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-8 flex justify-center">
                <Button
                  onClick={handleTopup}
                  disabled={!isWalletConfigured}
                  className="w-full bg-gradient-to-r from-[#f5d742] via-[#e6c229] to-[#d4a534] hover:brightness-110 text-[#5c442c] font-black uppercase tracking-wider py-6 rounded-full shadow-lg border-b-4 border-[#a67c00] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWalletConfigured ? '✅ I Already Sent Payment' : '⚠️ Wallet Not Configured'}
                </Button>
              </div>

              <p className="text-xs text-center text-[#6b5344] mt-2">
                💡 After clicking, coins will be credited immediately. Admin will verify your deposit.
              </p>
            </div>
          </div>
        </div>
      )
  }

  // Active View = List
  if (activeView === "wallets") {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
        <Button
          variant="ghost"
          onClick={() => setActiveView("list")}
          className="mb-4 text-[#5c442c] hover:bg-[#d6c19f]/30"
        >
          ← Back
        </Button>

        <div className="p-6 bg-[#f5e6c8] rounded-lg border-2 border-[#c4a574]">
          <h2 className="text-2xl font-bold text-[#4a3728] mb-4">💼 Wallet Addresses for Deposits</h2>
          <p className="text-sm text-[#6b5344] mb-6">
            Send your payment to any of these wallets. After sending, your coins will be credited immediately.
            Admin will verify your deposit.
          </p>

          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="p-4 bg-white rounded-lg border-2 border-[#c4a574] shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-[#4a3728]">
                      {wallet.name} {wallet.network && `(${wallet.network})`}
                    </h3>
                    <p className="text-xs text-gray-600">Min: ${wallet.minDepositUSD} USD</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    ✅ Active
                  </span>
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Wallet Address:</p>
                  <p className="font-mono text-sm text-[#4a3728] break-all select-all">
                    {wallet.address}
                  </p>
                </div>

                {wallet.instructions && (
                  <p className="mt-2 text-xs text-[#6b5344] italic">
                    📝 {wallet.instructions}
                  </p>
                )}

                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  💡 After sending payment, your coins will be credited automatically.
                  Admin will verify your deposit.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative pb-10">

      {/* TOP UP Column */}
      <div className="relative">
        {renderRibbon("TOP UP")}
        {renderConversionRate("$1 = 1 000 🪙")}

        {/* View Wallets Button */}
        {wallets.length > 0 && (
          <Button
            onClick={() => setActiveView("wallets")}
            className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3"
          >
            💼 View Wallet Addresses ({wallets.length} available)
          </Button>
        )}

        <div className="space-y-1">
          {PAYMENT_METHODS.map(method => (
            <button
              key={`topup-${method.id}`}
              onClick={() => handleMethodClick(method, "topup")}
              className="w-full bg-[#fdf9f0] border-b border-[#e8d5b0] hover:bg-[#fffdf7] group transition-colors flex items-center p-3 relative shadow-sm"
              style={{
                clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)"
              }}
            >
              <div className="w-8 h-8 mr-4 flex-shrink-0 relative overflow-hidden">
                 {/* Fake crypto icon simulation */}
                 <div className="absolute inset-0 bg-[#4a90e2] rotate-12 rounded-sm group-hover:rotate-45 transition-transform"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px] tracking-tighter">C</div>
              </div>
              <span className="font-bold text-[#5c442c] text-sm md:text-base flex-1 text-left tracking-wide">{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PAY OUT Column */}
      <div className="relative mt-8 md:mt-0">
        {renderRibbon("PAY OUT")}
        {renderConversionRate("2 000 🪙 = $1")}

        <div className="space-y-1">
          {PAYMENT_METHODS.map(method => (
            <button 
              key={`payout-${method.id}`}
              onClick={() => handleMethodClick(method, "payout")}
              className="w-full bg-[#fdf9f0] border-b border-[#e8d5b0] hover:bg-[#fffdf7] group transition-colors flex items-center p-3 relative shadow-sm"
              style={{
                clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)"
              }}
            >
              <div className="w-8 h-8 mr-4 flex-shrink-0 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#e05634] rounded-full group-hover:scale-110 transition-transform"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px] tracking-tighter">C</div>
              </div>
              <span className="font-bold text-[#5c442c] text-sm md:text-base flex-1 text-left tracking-wide">{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
