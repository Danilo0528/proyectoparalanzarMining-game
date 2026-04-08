// Crypto Wallet Configuration
// Admin can configure wallet addresses for deposits

export interface CryptoWallet {
  id: string;
  name: string; // e.g., "Bitcoin", "Ethereum", "USDT TRC20"
  symbol: string; // e.g., "BTC", "ETH", "USDT"
  network?: string; // e.g., "TRC20", "BEP20", "ERC20"
  address: string; // Wallet address where users send funds
  qrCode?: string; // Optional QR code image URL
  enabled: boolean; // Whether this wallet is active for deposits
  minDepositUSD: number; // Minimum deposit amount in USD
  instructions?: string; // Custom instructions for users
  createdAt: Date;
  updatedAt: Date;
}

export const defaultWallets: CryptoWallet[] = [
  {
    id: 'btc-wallet',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '',
    enabled: false,
    minDepositUSD: 10,
    instructions: 'Send BTC to this address. Confirmations required: 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'eth-wallet',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC20',
    address: '',
    enabled: false,
    minDepositUSD: 10,
    instructions: 'Send ETH on ERC20 network only',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usdt-trc20',
    name: 'USDT',
    symbol: 'USDT',
    network: 'TRC20',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send USDT on TRON (TRC20) network',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usdt-bep20',
    name: 'USDT',
    symbol: 'USDT',
    network: 'BEP20',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send USDT on BSC (BEP20) network',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'trx-wallet',
    name: 'Tron',
    symbol: 'TRX',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send TRX to this address',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ton-wallet',
    name: 'Toncoin',
    symbol: 'TON',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send TON to this address',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'doge-wallet',
    name: 'Dogecoin',
    symbol: 'DOGE',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send DOGE to this address',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ltc-wallet',
    name: 'Litecoin',
    symbol: 'LTC',
    address: '',
    enabled: false,
    minDepositUSD: 5,
    instructions: 'Send LTC to this address',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'bnb-wallet',
    name: 'BNB',
    symbol: 'BNB',
    network: 'BEP20',
    address: '',
    enabled: false,
    minDepositUSD: 10,
    instructions: 'Send BNB on BSC (BEP20) network',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Get enabled wallets only
 */
export function getEnabledWallets(wallets: CryptoWallet[]): CryptoWallet[] {
  return wallets.filter(w => w.enabled && w.address.trim() !== '');
}

/**
 * Find wallet by ID
 */
export function findWalletById(wallets: CryptoWallet[], id: string): CryptoWallet | undefined {
  return wallets.find(w => w.id === id);
}

/**
 * Update wallet in array
 */
export function updateWallet(wallets: CryptoWallet[], updatedWallet: CryptoWallet): CryptoWallet[] {
  return wallets.map(w => 
    w.id === updatedWallet.id ? { ...updatedWallet, updatedAt: new Date() } : w
  );
}
