"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import WalletsTab from "@/components/tabs/wallets-tab"

interface AdminDashboardProps {
  email: string
  token: string
  onLogout: () => void
}

interface UserData {
  email: string
  balance: number
  role: string
  createdAt: string
  lastSync?: string
  flagged?: boolean
  flagReason?: string
  islands?: any[]
  transactions?: any[]
}

interface DepositRequest {
  id: number
  email: string
  amountUSD: number
  coinsReceived: number
  method: string
  date: string
  status: "pending_verification" | "verified" | "rejected"
  creditedImmediately: boolean
  notes?: string
}

interface WithdrawalRequest {
  id: number
  email: string
  amount: number
  method: string
  address: string
  date: string
  status: "pending" | "approved" | "completed" | "rejected"
  paymentStatus?: "pending_payment" | "paid"
  txHash?: string
  currency?: string
  cryptoAmount?: number
}

export default function AdminDashboard({ email, token, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"users" | "withdrawals" | "deposits" | "wallets" | "economy">("users")
  const [users, setUsers] = useState<UserData[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [deposits, setDeposits] = useState<DepositRequest[]>([])
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState("")

  // Economy stats
  const [economyStats, setEconomyStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    flaggedUsers: 0
  })

  useEffect(() => {
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
        setWithdrawals(usersData.withdrawals || [])
        setDeposits(usersData.deposits || [])

        // Fetch wallets
        const walletsRes = await fetch('/api/admin/wallets', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (walletsRes.ok) {
          const walletsData = await walletsRes.json()
          setWallets(walletsData.wallets || [])
        }
        
        // Calculate stats
        setEconomyStats({
          totalUsers: usersData.users?.length || 0,
          totalBalance: usersData.users?.reduce((sum: number, u: UserData) => sum + (u.balance || 0), 0) || 0,
          totalWithdrawals: usersData.withdrawals?.filter((w: any) => w.status === 'approved').length || 0,
          pendingWithdrawals: usersData.withdrawals?.filter((w: any) => w.status === 'pending').length || 0,
          flaggedUsers: usersData.users?.filter((u: UserData) => u.flagged).length || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveWithdrawal = async (withdrawalId: number) => {
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawalId,
          action: 'approve'
        })
      })

      if (res.ok) {
        alert('✅ Withdrawal approved! Now you must send payment manually to the user.')
        fetchData()
      } else {
        alert('Failed to approve withdrawal')
      }
    } catch (error) {
      alert('Error approving withdrawal')
    }
  }

  const handleMarkAsPaid = async (withdrawalId: number) => {
    const txHash = prompt('Enter transaction hash (optional, for your records):')

    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawalId,
          action: 'mark_paid',
          txHash: txHash || undefined
        })
      })

      if (res.ok) {
        alert('✅ Withdrawal marked as PAID!')
        fetchData()
      } else {
        alert('Failed to mark withdrawal as paid')
      }
    } catch (error) {
      alert('Error marking withdrawal as paid')
    }
  }

  const handleRejectWithdrawal = async (withdrawalId: number) => {
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawalId,
          action: 'reject'
        })
      })

      if (res.ok) {
        alert('Withdrawal rejected and balance refunded to user')
        fetchData()
      } else {
        alert('Failed to reject withdrawal')
      }
    } catch (error) {
      alert('Error rejecting withdrawal')
    }
  }

  const handleVerifyDeposit = async (depositId: number) => {
    const notes = prompt('Add notes (optional):')

    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          depositId,
          action: 'verify',
          notes: notes || ''
        })
      })

      if (res.ok) {
        alert('✅ Deposit verified! Payment confirmed.')
        fetchData()
      } else {
        alert('Failed to verify deposit')
      }
    } catch (error) {
      alert('Error verifying deposit')
    }
  }

  const handleRejectDeposit = async (depositId: number) => {
    const notes = prompt('Reason for rejection (optional):')

    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          depositId,
          action: 'reject',
          notes: notes || 'Payment not received'
        })
      })

      if (res.ok) {
        alert('❌ Deposit rejected. Coins have been revoked from user balance.')
        fetchData()
      } else {
        alert('Failed to reject deposit')
      }
    } catch (error) {
      alert('Error rejecting deposit')
    }
  }

  const handleSaveWallet = async (walletId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          walletId,
          updates
        })
      })

      if (res.ok) {
        alert('✅ Wallet saved successfully!')
        fetchData()
      } else {
        alert('Failed to save wallet')
      }
    } catch (error) {
      alert('Error saving wallet')
    }
  }

  const handleChangeUserRole = async (userEmail: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userEmail,
          role: newRole
        })
      })

      if (res.ok) {
        alert(`User role changed to ${newRole}`)
        fetchData()
      } else {
        alert('Failed to change user role')
      }
    } catch (error) {
      alert('Error changing user role')
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchEmail.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4a534] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-[#4a3728]">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 100%)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 md:px-8 bg-[#4a3728] text-white">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm opacity-70">Logged in as: {email}</p>
        </div>
        
        <div className="flex gap-2">
          {["users", "withdrawals", "deposits", "wallets", "economy"].map(tab => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-bold uppercase ${
                activeTab === tab
                  ? "bg-[#d4a534] text-[#4a3728]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab}
            </Button>
          ))}
          <Button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users" value={economyStats.totalUsers} icon="👥" />
          <StatCard label="Total Balance" value={economyStats.totalBalance.toLocaleString()} icon="💰" />
          <StatCard label="Pending Withdrawals" value={economyStats.pendingWithdrawals} icon="⏳" color="yellow" />
          <StatCard label="Flagged Users" value={economyStats.flaggedUsers} icon="🚩" color="red" />
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white/80 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#4a3728]">User Management</h2>
              <Input
                type="text"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#c4a574]">
                    <th className="text-left p-2 text-[#4a3728]">Email</th>
                    <th className="text-left p-2 text-[#4a3728]">Balance</th>
                    <th className="text-left p-2 text-[#4a3728]">Role</th>
                    <th className="text-left p-2 text-[#4a3728]">Status</th>
                    <th className="text-left p-2 text-[#4a3728]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} className="border-b border-[#e8d5b0] hover:bg-[#f5e6c8]/30">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 font-bold">{user.balance?.toLocaleString() || 0}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === 'admin' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-2">
                        {user.flagged && (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-red-500 text-white">
                            🚩 Flagged
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleChangeUserRole(user.email, user.role === 'admin' ? 'user' : 'admin')}
                            className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600"
                          >
                            Change Role
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === "withdrawals" && (
          <div className="bg-white/80 rounded-lg p-6 shadow-lg">
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Flujo de Pagos Manuales</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-900">
                <li><strong>PENDING:</strong> Usuario solicita retiro → Espera tu aprobación</li>
                <li><strong>APPROVED:</strong> Tú apruebas → Ahora debes enviar el pago manualmente</li>
                <li><strong>COMPLETED:</strong> Envías el pago → Marcas como "Paid" en el sistema</li>
              </ol>
              <p className="mt-2 text-xs text-yellow-700">💡 <strong>Importante:</strong> Todos los pagos deben ser verificados y enviados por ti personalmente</p>
            </div>

            <h2 className="text-xl font-bold text-[#4a3728] mb-4">Withdrawal Requests</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#c4a574]">
                    <th className="text-left p-2 text-[#4a3728]">User</th>
                    <th className="text-left p-2 text-[#4a3728]">Amount</th>
                    <th className="text-left p-2 text-[#4a3728]">Method</th>
                    <th className="text-left p-2 text-[#4a3728]">Address</th>
                    <th className="text-left p-2 text-[#4a3728]">Date</th>
                    <th className="text-left p-2 text-[#4a3728]">Status</th>
                    <th className="text-left p-2 text-[#4a3728]">Payment</th>
                    <th className="text-left p-2 text-[#4a3728]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-b border-[#e8d5b0] hover:bg-[#f5e6c8]/30">
                      <td className="p-2 text-sm">{withdrawal.email}</td>
                      <td className="p-2 font-bold">{withdrawal.amount.toLocaleString()}</td>
                      <td className="p-2">{withdrawal.method}</td>
                      <td className="p-2 text-xs font-mono">{withdrawal.address}</td>
                      <td className="p-2 text-sm">{withdrawal.date}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          withdrawal.status === 'pending' ? 'bg-yellow-500 text-white' :
                          withdrawal.status === 'approved' ? 'bg-blue-500 text-white' :
                          withdrawal.status === 'completed' ? 'bg-green-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {withdrawal.paymentStatus === 'pending_payment' && (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-orange-500 text-white">
                            ⏳ Pending Payment
                          </span>
                        )}
                        {withdrawal.paymentStatus === 'paid' && (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">
                            ✅ Paid
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {withdrawal.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {withdrawal.status === 'approved' && withdrawal.paymentStatus === 'pending_payment' && (
                          <div className="flex flex-col gap-2">
                            <div className="text-xs text-orange-600 font-bold mb-1">
                              💸 Send payment manually
                            </div>
                            <Button
                              onClick={() => handleMarkAsPaid(withdrawal.id)}
                              className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600"
                            >
                              Mark as Paid
                            </Button>
                          </div>
                        )}
                        {withdrawal.status === 'completed' && (
                          <span className="text-xs text-green-600">✅ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#6b5344]">
                        No withdrawal requests yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deposits Tab */}
        {activeTab === "deposits" && (
          <div className="bg-white/80 rounded-lg p-6 shadow-lg">
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">💰 Flujo de Depósitos con Acreditación Inmediata</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-900">
                <li><strong>Usuario deposita:</strong> Se acreditan monedas INMEDIATAMENTE (usuario ve su balance)</li>
                <li><strong>Tú verificas:</strong> Revisas si el pago llegó realmente</li>
                <li><strong>Decides:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>✅ <strong>VERIFICAR:</strong> Pago llegó → Se mantiene el balance</li>
                    <li>❌ <strong>RECHAZAR:</strong> No llegó nada → Se REVIERTE el balance (se quitan las monedas)</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-2 text-xs text-blue-700">💡 <strong>Ventaja:</strong> El usuario ve su balance al instante (no se asusta), pero tú puedes revertir si es fraude</p>
            </div>

            <h2 className="text-xl font-bold text-[#4a3728] mb-4">Deposit Requests</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#c4a574]">
                    <th className="text-left p-2 text-[#4a3728]">User</th>
                    <th className="text-left p-2 text-[#4a3728]">USD</th>
                    <th className="text-left p-2 text-[#4a3728]">Coins</th>
                    <th className="text-left p-2 text-[#4a3728]">Method</th>
                    <th className="text-left p-2 text-[#4a3728]">Date</th>
                    <th className="text-left p-2 text-[#4a3728]">Status</th>
                    <th className="text-left p-2 text-[#4a3728]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-[#e8d5b0] hover:bg-[#f5e6c8]/30">
                      <td className="p-2 text-sm">{deposit.email}</td>
                      <td className="p-2 font-bold">${deposit.amountUSD}</td>
                      <td className="p-2 text-green-600 font-bold">+{deposit.coinsReceived.toLocaleString()}</td>
                      <td className="p-2">{deposit.method}</td>
                      <td className="p-2 text-sm">{deposit.date}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          deposit.status === 'pending_verification' ? 'bg-yellow-500 text-white' :
                          deposit.status === 'verified' ? 'bg-green-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {deposit.status === 'pending_verification' ? '⏳ Pending' :
                           deposit.status === 'verified' ? '✅ Verified' : '❌ Rejected'}
                        </span>
                      </td>
                      <td className="p-2">
                        {deposit.status === 'pending_verification' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleVerifyDeposit(deposit.id)}
                              className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600"
                            >
                              ✅ Verify
                            </Button>
                            <Button
                              onClick={() => handleRejectDeposit(deposit.id)}
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600"
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        )}
                        {deposit.status === 'verified' && (
                          <span className="text-xs text-green-600">✅ Confirmed</span>
                        )}
                        {deposit.status === 'rejected' && (
                          <div className="text-xs text-red-600">
                            <div>❌ Rejected</div>
                            <div className="text-[10px] text-gray-500">Balance revoked</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {deposits.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#6b5344]">
                        No deposit requests yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wallets Tab */}
        {activeTab === "wallets" && (
          <WalletsTab wallets={wallets} onSaveWallet={handleSaveWallet} token={token} />
        )}

        {/* Economy Tab */}
        {activeTab === "economy" && (
          <EconomyTab token={token} />
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon, color = "green" }: {
  label: string;
  value: string | number;
  icon: string;
  color?: "green" | "yellow" | "red";
}) {
  const colorClasses = {
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600"
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">{typeof value === 'number' ? value : 0}</span>
        </div>
      </div>
      <p className="text-sm text-[#6b5344]">{label}</p>
    </div>
  )
}

function EconomyTab({ token }: { token: string }) {
  const [config, setConfig] = useState({
    coinsToUSD: 2000,
    usdToCoins: 1000,
    minWithdrawal: 50,
    maxWithdrawalPerDay: 10000,
    maxWithdrawalPerWeek: 50000,
    maxEarningsPerHour: 5000,
    maxMinersPerType: 10,
    minMinerGlobal: 1,
    minerEarningMultiplier: 1.0,
    offlineEarningCap: 86400,
    dailyBonusAmount: 100,
    watchAdAmount: 25,
    socialShareAmount: 50,
    luckyWheelAmount: 75,
    suspiciousBalanceIncreaseThreshold: 10000,
    maxAccountPerIP: 3,
    requireEmailVerification: false,
    withdrawalFeePercentage: 0.05,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [token])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/economy', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Failed to fetch economy config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/economy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      })

      if (res.ok) {
        alert('Economy configuration saved successfully!')
      } else {
        alert('Failed to save economy configuration')
      }
    } catch (error) {
      alert('Error saving economy configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading economy settings...</div>
  }

  return (
    <div className="bg-white/80 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#4a3728]">Economy Configuration</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Conversion Rates */}
        <div className="p-4 bg-[#f5e6c8] rounded-lg">
          <h3 className="font-bold text-[#4a3728] mb-4">Conversion Rates</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b5344]">Coins to USD (2000 coins = $1)</label>
              <Input
                type="number"
                value={config.coinsToUSD}
                onChange={(e) => setConfig({ ...config, coinsToUSD: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">USD to Coins ($1 = 1000 coins)</label>
              <Input
                type="number"
                value={config.usdToCoins}
                onChange={(e) => setConfig({ ...config, usdToCoins: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Withdrawal Limits */}
        <div className="p-4 bg-[#f5e6c8] rounded-lg">
          <h3 className="font-bold text-[#4a3728] mb-4">Withdrawal Limits</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b5344]">Minimum Withdrawal (coins)</label>
              <Input
                type="number"
                value={config.minWithdrawal}
                onChange={(e) => setConfig({ ...config, minWithdrawal: parseInt(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-gray-600 mt-1">Minimum coins required to withdraw</p>
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Max Per Day</label>
              <Input
                type="number"
                value={config.maxWithdrawalPerDay}
                onChange={(e) => setConfig({ ...config, maxWithdrawalPerDay: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Max Per Week</label>
              <Input
                type="number"
                value={config.maxWithdrawalPerWeek}
                onChange={(e) => setConfig({ ...config, maxWithdrawalPerWeek: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Miner Settings */}
        <div className="p-4 bg-[#f5e6c8] rounded-lg">
          <h3 className="font-bold text-[#4a3728] mb-4">Miner Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b5344]">Min Miner Level Global (1-12)</label>
              <Input
                type="number"
                min="1"
                max="12"
                value={config.minMinerGlobal}
                onChange={(e) => setConfig({ ...config, minMinerGlobal: parseInt(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-gray-600 mt-1">Minimum miner level required to start earning</p>
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Earning Multiplier (1.0 = base rate)</label>
              <Input
                type="number"
                step="0.1"
                value={config.minerEarningMultiplier}
                onChange={(e) => setConfig({ ...config, minerEarningMultiplier: parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Max Miners Per Type</label>
              <Input
                type="number"
                value={config.maxMinersPerType}
                onChange={(e) => setConfig({ ...config, maxMinersPerType: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Offline Earning Cap (seconds)</label>
              <Input
                type="number"
                value={config.offlineEarningCap}
                onChange={(e) => setConfig({ ...config, offlineEarningCap: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Bonus Settings */}
        <div className="p-4 bg-[#f5e6c8] rounded-lg">
          <h3 className="font-bold text-[#4a3728] mb-4">Bonus Amounts</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b5344]">Daily Bonus</label>
              <Input
                type="number"
                value={config.dailyBonusAmount}
                onChange={(e) => setConfig({ ...config, dailyBonusAmount: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Watch Ad</label>
              <Input
                type="number"
                value={config.watchAdAmount}
                onChange={(e) => setConfig({ ...config, watchAdAmount: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Social Share</label>
              <Input
                type="number"
                value={config.socialShareAmount}
                onChange={(e) => setConfig({ ...config, socialShareAmount: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Lucky Wheel</label>
              <Input
                type="number"
                value={config.luckyWheelAmount}
                onChange={(e) => setConfig({ ...config, luckyWheelAmount: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="p-4 bg-[#f5e6c8] rounded-lg">
          <h3 className="font-bold text-[#4a3728] mb-4">Fees & Anti-Fraud</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#6b5344]">Withdrawal Fee (0.05 = 5%)</label>
              <Input
                type="number"
                step="0.01"
                value={config.withdrawalFeePercentage}
                onChange={(e) => setConfig({ ...config, withdrawalFeePercentage: parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#6b5344]">Suspicious Balance Threshold</label>
              <Input
                type="number"
                value={config.suspiciousBalanceIncreaseThreshold}
                onChange={(e) => setConfig({ ...config, suspiciousBalanceIncreaseThreshold: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
