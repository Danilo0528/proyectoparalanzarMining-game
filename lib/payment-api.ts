// FaucetPay API Integration
// Documentation: https://faucetpay.io/page/api

const FAUCETPAY_API_KEY = process.env.FAUCETPAY_API_KEY || '';
const FAUCETPAY_API_BASE = 'https://faucetpay.io/api/v1';

export interface FaucetPayWithdrawal {
  amount: number; // in satoshis/smallest unit
  to: string; // wallet address
  currency: string; // BTC, ETH, DOGE, LTC, TRX, TON, etc.
  referrer?: string;
}

export interface FaucetPayResponse {
  status: number; // 200 for success
  status_text: string;
  payout_id?: number;
  balance?: number;
  error?: string;
}

/**
 * Send payment via FaucetPay
 * Supports: BTC, ETH, DOGE, LTC, TRX, TON, USDT (TRC20/BEP20)
 */
export async function sendFaucetPayWithdrawal(
  withdrawal: FaucetPayWithdrawal
): Promise<FaucetPayResponse> {
  try {
    const params = new URLSearchParams({
      api_key: FAUCETPAY_API_KEY,
      amount: withdrawal.amount.toString(),
      to: withdrawal.to,
      currency: withdrawal.currency,
    });

    const response = await fetch(`${FAUCETPAY_API_BASE}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('FaucetPay withdrawal error:', error);
    return {
      status: 500,
      status_text: error.message || 'Unknown error',
      error: error.message,
    };
  }
}

/**
 * Check FaucetPay balance
 */
export async function checkFaucetPayBalance(currency: string): Promise<{ balance?: number; error?: string }> {
  try {
    const params = new URLSearchParams({
      api_key: FAUCETPAY_API_KEY,
      currency,
    });

    const response = await fetch(`${FAUCETPAY_API_BASE}/balance?${params}`);
    const data = await response.json();

    if (data.status === 200) {
      return { balance: data.balance };
    } else {
      return { error: data.status_text };
    }
  } catch (error: any) {
    console.error('FaucetPay balance check error:', error);
    return { error: error.message };
  }
}

/**
 * Convert coin amount to smallest unit (satoshis, etc.)
 */
export function convertToSmallestUnit(amount: number, currency: string): number {
  const multipliers: Record<string, number> = {
    'BTC': 100000000, // 1 BTC = 100,000,000 satoshis
    'ETH': 1000000000000000000, // 1 ETH = 10^18 wei
    'DOGE': 100000000, // 1 DOGE = 100,000,000 koinu
    'LTC': 100000000, // 1 LTC = 100,000,000 litoshis
    'TRX': 1000000, // 1 TRX = 1,000,000 sun
    'TON': 1000000000, // 1 TON = 10^9 nanotons
    'USDT': 1000000, // 1 USDT = 10^6 (6 decimals)
  };

  const multiplier = multipliers[currency.toUpperCase()] || 1;
  return Math.floor(amount * multiplier);
}

/**
 * Map payment method name to FaucetPay currency code
 */
export function mapMethodToCurrency(method: string): string {
  const mapping: Record<string, string> = {
    'FAUCETPAY': 'BTC',
    'BITCOIN': 'BTC',
    'DOGECOIN': 'DOGE',
    'LITECOIN': 'LTC',
    'TRX': 'TRX',
    'TON': 'TON',
    'BINANCE BEP20': 'USDT',
    'TETHER TRC20': 'USDT',
    'TETHER BEP20': 'USDT',
  };

  return mapping[method.toUpperCase()] || 'BTC';
}
