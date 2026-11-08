import { describe, expect, it } from "vitest"
import {
  coinsToUsd,
  COINS_PER_DEPOSIT_USD,
  COINS_PER_USD,
  findWalletForMethod,
  usdToCoins,
  usdToCrypto,
} from "./finance"
import { buildReferralLink } from "./referral"

describe("currency conversion", () => {
  it("converts 2000 coins into one dollar", () => {
    expect(COINS_PER_USD).toBe(2000)
    expect(coinsToUsd(2000)).toBe(1)
    expect(coinsToUsd(1000)).toBe(0.5)
  })

  it("converts one dollar into 1000 coins on deposit", () => {
    expect(COINS_PER_DEPOSIT_USD).toBe(1000)
    expect(usdToCoins(1)).toBe(1000)
    expect(usdToCoins(2.5)).toBe(2500)
  })

  it("converts dollars into a crypto amount", () => {
    expect(usdToCrypto(10, 2)).toBe(5)
    expect(usdToCrypto(10, 0)).toBe(0)
  })

  it("guards against invalid values", () => {
    expect(coinsToUsd(Number.NaN)).toBe(0)
    expect(usdToCoins(Number.POSITIVE_INFINITY)).toBe(0)
    expect(usdToCrypto(10, Number.NaN)).toBe(0)
  })
})

describe("wallet lookup", () => {
  const wallets = [
    { name: "Bitcoin", address: "bc1" },
    { name: "USDT", network: "TRC20", address: "trc" },
    { name: "USDT", network: "BEP20", address: "bep" },
  ]
  const mapping = { BITCOIN: "Bitcoin", "TETHER TRC20": "USDT", "TETHER BEP20": "USDT" }

  it("maps a method to its wallet name", () => {
    expect(findWalletForMethod(wallets, "BITCOIN", mapping)?.address).toBe("bc1")
  })

  it("matches USDT networks separately", () => {
    expect(findWalletForMethod(wallets, "TETHER TRC20", mapping)?.address).toBe("trc")
    expect(findWalletForMethod(wallets, "TETHER BEP20", mapping)?.address).toBe("bep")
  })

  it("returns undefined for an unknown method", () => {
    expect(findWalletForMethod(wallets, "DOGECOIN", mapping)).toBeUndefined()
  })
})

describe("referral links", () => {
  it("encodes the email into the referral query", () => {
    expect(buildReferralLink("https://melqo.app", "miner+one@melqo.app")).toBe(
      "https://melqo.app/?ref=miner%2Bone%40melqo.app",
    )
  })

  it("falls back to the production host", () => {
    expect(buildReferralLink("", "a@b.co")).toBe("https://melqo.app/?ref=a%40b.co")
  })
})
