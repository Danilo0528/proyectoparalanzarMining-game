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

// Map frontend method names to wallet names in database
const METHOD_TO_WALLET: Record<string, string> = {
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

export default function FinanceTab({ balance, setBalance, email, token }: FinanceTabProps) {
  const [activeView, setActiveView] = useState<"list" | "payout_detail" | "topup_detail">("list")
  const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null)
  const [wallets, setWallets] = useState<any[]>([])
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [transactions, setTransactions] = usePersistentState<any[]>("melqo-transactions", [])
  const [payoutInput, setPayoutInput] = useState("")
  const [payoutAddress, setPayoutAddress] = useState("")
  const [txHash, setTxHash] = useState("")
  const [depositLoading, setDepositLoading] = useState(false)

  // Fetch enabled wallets from backend
  useEffect(() => {
    setWalletsLoading(true)
    fetch('/api/wallets')
      .then(res => res.json())
      .then(data => {
        setWallets(data.wallets || [])
        setWalletsLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch wallets:', err)
        setWalletsLoading(false)
      })
  }, [])

  // Helper: find wallet by payment method
  const findWallet = (methodName: string) => {
    const walletName = METHOD_TO_WALLET[methodName] || methodName
    
    // For USDT, we need to match the specific network
    if (methodName === 'TETHER TRC20') {
      return wallets.find(w => w.name.toLowerCase() === 'usdt' && w.network === 'TRC20')
    }
    if (methodName === 'TETHER BEP20') {
      return wallets.find(w => w.name.toLowerCase() === 'usdt' && w.network === 'BEP20')
    }
    
    return wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase())
  }

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
        setBalance(balance - amount)
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

    const wallet = findWallet(selectedMethod?.name || '')
    if (!wallet || !wallet.address?.trim()) {
      alert(`⚠️ Deposits via ${selectedMethod?.name} are not available yet. Admin has not configured this wallet.`)
      return
    }

    if (!txHash.trim()) {
      alert("Please enter the Transaction Hash / TxID or sender wallet address.")
      return
    }

    const minDeposit = wallet.minDepositUSD || 5
    if (amount < minDeposit) {
      alert(`Minimum deposit for ${selectedMethod?.name} is $${minDeposit} USD`)
      return
    }

    setDepositLoading(true)

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod?.name,
          txHash: txHash.trim()
        })
      })

      const data = await res.json()

      if (data.success) {
        setBalance(balance + data.coinsAdded)
        setTransactions([{
          id: Date.now(),
          type: "deposit",
          amount: data.coinsAdded,
          method: selectedMethod?.name,
          txHash: txHash.trim(),
          date: new Date().toISOString().split('T')[0],
          status: "pending_verification"
        }, ...transactions])

        alert(`✅ ${data.coinsAdded.toLocaleString()} gold coins will be credited within 1-3 minutes!\n\n⏳ Your deposit is being verified by admin.`)
        setActiveView("list")
        setTxHash("")
      } else {
        alert(data.error || "Top-up failed")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setDepositLoading(false)
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

  const renderCoinIcon = (method: any, type: "topup" | "payout") => {
    const CoinSvg = () => {
      switch (method.id) {
        case 'bitcoin': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#F7931A"/>
            <path d="M21.841 13.916c.38-2.545-1.523-3.905-4.086-4.793l.835-3.35-2.037-.507-.812 3.255c-.535-.133-1.085-.259-1.636-.381l.823-3.3-2.037-.507-.834 3.351c-.443-.102-.876-.201-1.285-.306l.001-.005-2.809-.7-1.12 1.54s1.512.348 1.482.37c.827.206.977.754.952 1.189l-1.905 7.64c-.033.093-.086.236-.255.234.025.029-1.482-.37-1.482-.37l-1.022 1.573 2.658.662c.5.125.992.257 1.487.385l-.841 3.376 2.037.507.834-3.35c.548.146 1.09.284 1.62.416l-.828 3.324 2.036.507.842-3.377c3.425.65 6.002.392 7.07-2.673.859-2.463-.092-3.882-1.815-4.814 1.295-.298 2.27-.84 2.531-2.14zM18.82 18.25c-.687 2.766-5.32 1.309-6.822.935L12.63 16.63c1.501.374 5.518-.088 6.19 1.62zm.685-4.87c-.624 2.51-4.493 1.242-5.753.928l.582-2.336c1.26.314 5.811.144 5.171 1.408z" fill="#FFF"/>
          </svg>
        );
        case 'dogecoin': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#C2A633"/>
            <text x="16" y="21" fontSize="16" fontFamily="Arial" fontWeight="bold" fill="#FFF" textAnchor="middle">Ð</text>
          </svg>
        );
        case 'litecoin': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#345D9D"/>
            <path d="M11.66 21.942l2.674-10.457h2.646l-1.928 7.5c2.404-.792 5.093-1.656 7.498-2.433l-.69 2.684-9.35 3.018-2.613-.263 1.763-7.05h-1.916l.666-2.585h1.914l-.664 2.585h.002z" fill="#FFF"/>
          </svg>
        );
        case 'trx': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#EB3A39"/>
            <path d="M9.544 11.233L15.7 6.13a.625.625 0 01.8 0l6.155 5.103a.625.625 0 01.077.886l-6.233 7.854a.625.625 0 01-1.026-.008L9.467 12.12a.625.625 0 01.077-.887zm1.68 1.487l4.312-3.578v6.924L11.224 12.72zm9.155 0l-4.312 3.346v-6.924l4.312 3.578zM16.536 21.68v-7.8l5.352 2.673-5.352 5.127zm-.832 0l-5.352-5.127 5.352-2.673v7.8z" fill="#FFF"/>
          </svg>
        );
        case 'ton': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#0098EA"/>
            <path d="M16 6.5L6.5 16l4 4 5.5-11 5.5 11 4-4-9.5-9.5zM16 25l-4-4 4 2 4-2-4 4z" fill="#FFF"/>
          </svg>
        );
        case 'binance': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
            <path d="M11.835 15l4.162-4.161L20.16 15h2.825l-6.988-6.987L9.01 15h2.825zm0 1.99H9.01l6.988 6.988L22.986 16.99H20.16L15.998 21.15l-4.163-4.16z" fill="#FFF"/>
            <path d="M13.684 15.996L15.997 13.683l2.314 2.313-2.314 2.313-2.313-2.313z" fill="#FFF"/>
          </svg>
        );
        case 'tether_trc20':
        case 'tether_bep20':
          return (
            <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.818 13.064v4.321h2.247v1.89h-5.918v-1.89h2.246v-4.321c-2.736-.184-4.887-.938-4.887-1.848 0-.91 2.15-1.664 4.887-1.848v-2.03h1.425v2.03c2.736.184 4.887.938 4.887 1.848 0 .91-2.15 1.664-4.887 1.848z" fill="#FFF"/>
            </svg>
          );
        case 'faucetpay': return (
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#136AF4"/>
            <text x="16" y="21" fontSize="14" fontFamily="Arial" fontWeight="bold" fill="#FFF" textAnchor="middle">FP</text>
          </svg>
        );
        default: return (
          <div className="w-full h-full relative overflow-hidden rounded-full">
            <div className={`absolute inset-0 ${type === 'topup' ? 'bg-[#4a90e2]' : 'bg-[#e05634]'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px] tracking-tighter">C</div>
          </div>
        );
      }
    };

    return (
      <div className="w-8 h-8 mr-4 flex-shrink-0 relative flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm rounded-full">
        <CoinSvg />
      </div>
    );
  }

  // PAYOUT DETAIL VIEW
  if (activeView === "payout_detail" && selectedMethod) {
    const giveGold = parseFloat(payoutInput) || 0
    const getUSD = giveGold / 2000
    const getCrypto = getUSD / selectedMethod.cryptoPrice
    const totalPaid = transactions.filter(t => t.type === "withdraw").reduce((acc, t) => acc + (t.amount / 2000), 0)

    return (
      <div className="flex flex-col md:flex-row h-full gap-8 relative animate-in fade-in zoom-in duration-300">
        <div className="hidden md:flex md:w-5/12 relative min-h-[400px] rounded-xl overflow-hidden items-end justify-center">
           <Image src="/images/mine-entrance.png" alt="Miner Context" fill className="object-cover scale-150 transform translate-y-12 opacity-90" />
           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f5e6c8] to-transparent h-1/3"></div>
        </div>

        <div className="w-full md:w-7/12 p-6 md:p-8 rounded-sm shadow-2xl relative border border-[#c4a574]/40" style={{
          background: "linear-gradient(135deg, rgba(232, 213, 176, 0.95), rgba(245, 230, 200, 0.95)), url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.08\\'/%3E%3C/svg%3E')",
          boxShadow: "inset 0 0 20px rgba(92, 68, 44, 0.1), 0 10px 30px rgba(0,0,0,0.15)",
          clipPath: "polygon(1% 0, 99% 2%, 100% 98%, 0 100%)"
        }}>
          <Button variant="ghost" onClick={() => setActiveView("list")} className="absolute top-4 left-4 text-[#5c442c] hover:bg-[#d6c19f]/30">← Back</Button>

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
                <Input type="number" value={payoutInput} onChange={e => setPayoutInput(e.target.value)} placeholder="2000" className="border-0 bg-transparent text-xl font-bold text-[#5c442c] w-full focus-visible:ring-0 shadow-none px-0" />
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
                <Input value={payoutAddress} onChange={e => setPayoutAddress(e.target.value)} placeholder="SET PAYOUT ADDRESS." className="border-0 bg-transparent uppercase font-bold text-[#5c442c] focus-visible:ring-0 shadow-none text-sm placeholder:text-[#8c745c]" />
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <Button onClick={handlePayout} className="bg-gradient-to-r from-[#f5d742] via-[#e6c229] to-[#d4a534] hover:brightness-110 text-[#5c442c] font-black uppercase tracking-wider px-10 py-6 rounded-full shadow-lg border-b-4 border-[#a67c00] active:border-b-0 active:translate-y-1 transition-all">
                Pay out
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TOPUP DETAIL VIEW
  if (activeView === "topup_detail" && selectedMethod) {
    const giveUSD = parseFloat(payoutInput) || 0
    const getGold = giveUSD * 1000

    // Show loading while wallets are being fetched
    if (walletsLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#d4a534] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#4a3728] font-bold">Loading wallet addresses...</p>
          </div>
        </div>
      )
    }

    const wallet = findWallet(selectedMethod.name)
    const isWalletConfigured = wallet && wallet.address?.trim()

    return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300 py-8">
        <div className="w-full max-w-md bg-[#e8d5b0] p-6 md:p-8 rounded-sm shadow-2xl relative" style={{
            background: "linear-gradient(135deg, rgba(232, 213, 176, 0.95), rgba(245, 230, 200, 0.95))",
            boxShadow: "inset 0 0 20px rgba(92, 68, 44, 0.1), 0 10px 30px rgba(0,0,0,0.15)",
            clipPath: "polygon(0 0, 100% 2%, 99% 100%, 1% 98%)"
          }}>
            <Button variant="ghost" onClick={() => setActiveView("list")} className="absolute top-4 left-4 text-[#5c442c] hover:bg-[#d6c19f]/30">← Back</Button>

            <h3 className="text-2xl font-black text-[#5c442c] mb-4 mt-4 uppercase text-center">{selectedMethod.name} Top Up</h3>

            {isWalletConfigured ? (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
                <p className="text-sm font-bold text-green-800 mb-2">📍 Send payment to this address:</p>
                <div className="p-3 bg-white rounded-lg border border-green-300">
                  <p className="font-mono text-xs text-[#4a3728] break-all select-all">{wallet.address}</p>
                </div>
                {wallet.network && <p className="text-xs text-green-700 mt-2">🌐 Network: <strong>{wallet.network}</strong></p>}
                {wallet.minDepositUSD && <p className="text-xs text-green-700 mt-1">💰 Minimum: <strong>${wallet.minDepositUSD} USD</strong></p>}
                {wallet.instructions && <p className="text-xs text-green-700 mt-1">📝 {wallet.instructions}</p>}
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
                  <Input type="number" value={payoutInput} onChange={e => setPayoutInput(e.target.value)} placeholder="10" className="border-0 bg-transparent text-xl font-bold text-[#5c442c] w-full focus-visible:ring-0 shadow-none px-0" />
                </div>
              </div>

               <div>
                <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">You receive (🪙)</label>
                <div className="bg-[#d6c19f]/20 flex items-center p-2 rounded-sm opacity-80 shadow-inner">
                  <span className="text-2xl mr-3 pl-2">🪙</span>
                  <span className="text-xl font-bold text-[#5c442c] block w-full">{getGold.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#5c442c] block mb-2 px-1">Transaction Hash / TxID / From Address</label>
                <div className="bg-[#fef9f0] flex items-center p-2 rounded-sm shadow-inner relative group border border-[#c4a574]">
                  <span className="text-lg mr-2 pl-2">🔗</span>
                  <Input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="0x..." className="border-0 bg-transparent text-sm font-bold text-[#5c442c] w-full focus-visible:ring-0 shadow-none px-0" />
                </div>
                <p className="text-[10px] text-[#6b5344] mt-1 ml-1">Required to verify your payment!</p>
              </div>

              <div className="pt-6 flex justify-center">
                <Button
                  onClick={handleTopup}
                  disabled={!isWalletConfigured || depositLoading}
                  className="w-full bg-gradient-to-r from-[#f5d742] via-[#e6c229] to-[#d4a534] hover:brightness-110 text-[#5c442c] font-black uppercase tracking-wider py-6 rounded-full shadow-lg border-b-4 border-[#a67c00] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading ? '⏳ Processing...' : isWalletConfigured ? '✅ I Already Sent Payment' : '⚠️ Wallet Not Configured'}
                </Button>
              </div>

              <p className="text-xs text-center text-[#6b5344] mt-2">
                💡 Coins will be credited within 1-3 minutes after admin verification.
              </p>
            </div>
          </div>
        </div>
      )
  }


  // MAIN LIST VIEW
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative pb-10">

      {/* TOP UP Column */}
      <div className="relative">
        {renderRibbon("TOP UP")}
        {renderConversionRate("$1 = 1 000 🪙")}

        <div className="space-y-1">
          {PAYMENT_METHODS.map(method => (
            <button
              key={`topup-${method.id}`}
              onClick={() => handleMethodClick(method, "topup")}
              className="w-full bg-[#fdf9f0] border-b border-[#e8d5b0] hover:bg-[#fffdf7] group transition-colors flex items-center p-3 relative shadow-sm"
              style={{ clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)" }}
            >
              {renderCoinIcon(method, "topup")}
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
              style={{ clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)" }}
            >
              {renderCoinIcon(method, "payout")}
              <span className="font-bold text-[#5c442c] text-sm md:text-base flex-1 text-left tracking-wide">{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
