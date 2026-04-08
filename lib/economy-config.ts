// Economy configuration and balance controls

export interface EconomyConfig {
  // Conversion rates
  coinsToUSD: number; // 2000 coins = $1
  usdToCoins: number; // $1 = 1000 coins (house edge built in)

  // Withdrawal limits
  minWithdrawal: number; // minimum coins to withdraw
  maxWithdrawalPerDay: number; // max coins per user per day
  maxWithdrawalPerWeek: number; // max coins per user per week

  // Earning limits
  maxEarningsPerHour: number; // max coins a user can earn per hour
  maxMinersPerType: number; // max miners of each type (currently 10)
  minMinerGlobal: number; // minimum miner level required to start earning

  // Miner earnings configuration
  minerEarningMultiplier: number; // global multiplier to adjust earnings
  offlineEarningCap: number; // max seconds of offline earnings (24 hours = 86400)

  // Bonus configuration
  dailyBonusAmount: number;
  watchAdAmount: number;
  socialShareAmount: number;
  luckyWheelAmount: number;

  // Anti-fraud settings
  suspiciousBalanceIncreaseThreshold: number; // flag if balance increases more than this
  maxAccountPerIP: number; // max accounts per IP address
  requireEmailVerification: boolean;

  // Fee configuration
  withdrawalFeePercentage: number; // fee percentage (e.g., 0.05 = 5%)
}

export const defaultEconomyConfig: EconomyConfig = {
  // Conversion: 2000 coins = $1 USD
  coinsToUSD: 2000,
  // Top-up: $1 = 1000 coins (50% house edge on purchase)
  usdToCoins: 1000,

  // Withdrawal limits
  minWithdrawal: 50,
  maxWithdrawalPerDay: 10000,
  maxWithdrawalPerWeek: 50000,

  // Earning limits
  maxEarningsPerHour: 5000,
  maxMinersPerType: 10,
  minMinerGlobal: 1, // Minimum miner level to start earning

  // Miner earnings
  minerEarningMultiplier: 1.0, // 1.0 = base rate, 0.5 = half rate, etc.
  offlineEarningCap: 86400, // 24 hours

  // Bonuses
  dailyBonusAmount: 100,
  watchAdAmount: 25,
  socialShareAmount: 50,
  luckyWheelAmount: 75,

  // Anti-fraud
  suspiciousBalanceIncreaseThreshold: 10000,
  maxAccountPerIP: 3,
  requireEmailVerification: false,

  // Fees
  withdrawalFeePercentage: 0.05, // 5% withdrawal fee
};

/**
 * Calculate miner earnings with global multiplier
 */
export function calculateMinerEarnings(perDay: number, owned: number, config: EconomyConfig = defaultEconomyConfig): number {
  return (perDay * owned * config.minerEarningMultiplier) / 86400; // per second
}

/**
 * Calculate withdrawal fee
 */
export function calculateWithdrawalFee(amount: number, config: EconomyConfig = defaultEconomyConfig): number {
  return amount * config.withdrawalFeePercentage;
}

/**
 * Calculate net withdrawal amount (after fee)
 */
export function calculateNetWithdrawal(amount: number, config: EconomyConfig = defaultEconomyConfig): number {
  const fee = calculateWithdrawalFee(amount, config);
  return amount - fee;
}

/**
 * Check if withdrawal amount is within limits
 */
export function validateWithdrawalLimits(
  amount: number,
  userWithdrawalsToday: number,
  userWithdrawalsThisWeek: number,
  config: EconomyConfig = defaultEconomyConfig
): { valid: boolean; error?: string } {
  if (amount < config.minWithdrawal) {
    return { valid: false, error: `Minimum withdrawal is ${config.minWithdrawal} coins` };
  }
  
  if (userWithdrawalsToday + amount > config.maxWithdrawalPerDay) {
    return { valid: false, error: `Daily withdrawal limit exceeded (${config.maxWithdrawalPerDay} coins/day)` };
  }
  
  if (userWithdrawalsThisWeek + amount > config.maxWithdrawalPerWeek) {
    return { valid: false, error: `Weekly withdrawal limit exceeded (${config.maxWithdrawalPerWeek} coins/week)` };
  }
  
  return { valid: true };
}

/**
 * Calculate offline earnings with cap
 */
export function calculateOfflineEarnings(
  earningsPerSecond: number,
  secondsOffline: number,
  maxCapacity: number,
  currentEarnings: number,
  config: EconomyConfig = defaultEconomyConfig
): number {
  // Cap offline time
  const cappedSeconds = Math.min(secondsOffline, config.offlineEarningCap);
  
  // Calculate earnings
  const earned = earningsPerSecond * cappedSeconds;
  
  // Add to current earnings but cap at max capacity
  return Math.min(currentEarnings + earned, maxCapacity);
}
