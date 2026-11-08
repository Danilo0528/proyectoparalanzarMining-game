"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WalletsTabProps {
  wallets: any[]
  onSaveWallet: (walletId: string, updates: any) => void
  token: string
}

export default function WalletsTab({ wallets, onSaveWallet, token }: WalletsTabProps) {
  const [editingWallet, setEditingWallet] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    address: "",
    enabled: false,
    minDepositUSD: 0,
    instructions: ""
  })

  const handleEdit = (wallet: any) => {
    setEditingWallet(wallet.id)
    setFormData({
      address: wallet.address || "",
      enabled: wallet.enabled || false,
      minDepositUSD: wallet.minDepositUSD || 0,
      instructions: wallet.instructions || ""
    })
  }

  const handleSave = () => {
    if (!editingWallet) return
    
    onSaveWallet(editingWallet, formData)
    setEditingWallet(null)
  }

  const handleCancel = () => {
    setEditingWallet(null)
  }

  return (
    <div className="arcade-card p-6">
      <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
        <h3 className="font-bold text-green-800 mb-2">💼 Configuración de Billeteras Crypto</h3>
        <p className="text-sm text-green-900">
          Configura las direcciones de wallet donde los usuarios enviarán sus depósitos.
          Solo las billeteras habilitadas serán visibles para los usuarios.
        </p>
      </div>

      <h2 className="text-xl font-bold text-arcade-text mb-4">Crypto Wallets Configuration</h2>

      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className={`border-2 rounded-lg p-4 transition-all ${
              wallet.enabled && wallet.address
                ? "border-green-400 bg-green-50"
                : "border-arcade-border bg-arcade-raised/40"
            }`}
          >
            {editingWallet === wallet.id ? (
              // Editing mode
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-arcade-text">
                      {wallet.name} {wallet.network && `(${wallet.network})`}
                    </h3>
                    <p className="text-sm text-arcade-muted">Symbol: {wallet.symbol}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                      💾 Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-arcade-text block mb-1">
                    Wallet Address *
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your wallet address..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold text-arcade-text">Enabled</span>
                  </label>

                  <div className="flex-1">
                    <label className="text-sm font-bold text-arcade-text block mb-1">
                      Min Deposit (USD)
                    </label>
                    <Input
                      type="number"
                      value={formData.minDepositUSD}
                      onChange={(e) => setFormData({ ...formData, minDepositUSD: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-arcade-text block mb-1">
                    Instructions for users (optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="e.g., Send USDT on TRC20 network only..."
                  />
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-arcade-text">
                      {wallet.name} {wallet.network && `(${wallet.network})`}
                    </h3>
                    {wallet.enabled && wallet.address ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        ✅ ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded">
                        ⏸️ INACTIVE
                      </span>
                    )}
                  </div>
                  
                  {wallet.address ? (
                    <p className="font-mono text-xs text-gray-700 mb-1">
                      {wallet.address}
                    </p>
                  ) : (
                    <p className="text-xs text-arcade-muted mb-1">No address configured</p>
                  )}
                  
                  <div className="flex gap-4 text-xs text-arcade-muted">
                    <span>Min: ${wallet.minDepositUSD || 0}</span>
                    {wallet.instructions && (
                      <span className="truncate max-w-md">{wallet.instructions}</span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleEdit(wallet)}
                  className="ml-4 bg-blue-500 hover:bg-blue-600"
                >
                  ✏️ Edit
                </Button>
              </div>
            )}
          </div>
        ))}

        {wallets.length === 0 && (
          <div className="text-center py-8 text-arcade-muted">
            Loading wallets...
          </div>
        )}
      </div>
    </div>
  )
}
