import { defaultEconomyConfig } from "@/lib/economy-config"

export const COINS_PER_USD = defaultEconomyConfig.coinsToUSD
export const COINS_PER_DEPOSIT_USD = defaultEconomyConfig.usdToCoins

export function coinsToUsd(coins: number, rate = COINS_PER_USD): number {
  if (!Number.isFinite(coins) || rate <= 0) return 0
  return coins / rate
}

export function usdToCoins(usd: number, rate = COINS_PER_DEPOSIT_USD): number {
  if (!Number.isFinite(usd) || rate <= 0) return 0
  return usd * rate
}

export function usdToCrypto(usd: number, cryptoPrice: number): number {
  if (!Number.isFinite(usd) || !Number.isFinite(cryptoPrice) || cryptoPrice <= 0) {
    return 0
  }
  return usd / cryptoPrice
}

export function findWalletForMethod<
  T extends { name: string; network?: string },
>(
  wallets: T[],
  methodName: string,
  methodToWallet: Record<string, string>,
): T | undefined {
  const walletName = methodToWallet[methodName] || methodName

  if (methodName === "TETHER TRC20") {
    return wallets.find(
      (wallet) =>
        wallet.name.toLowerCase() === "usdt" && wallet.network === "TRC20",
    )
  }
  if (methodName === "TETHER BEP20") {
    return wallets.find(
      (wallet) =>
        wallet.name.toLowerCase() === "usdt" && wallet.network === "BEP20",
    )
  }

  return wallets.find(
    (wallet) => wallet.name.toLowerCase() === walletName.toLowerCase(),
  )
}
