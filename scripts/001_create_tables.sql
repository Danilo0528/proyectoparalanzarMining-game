-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  balance DECIMAL(20, 4) DEFAULT 500,
  total_deposited DECIMAL(20, 4) DEFAULT 0,
  total_withdrawn DECIMAL(20, 4) DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User wallets for crypto addresses
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_type TEXT NOT NULL, -- 'TRX', 'TON', 'BNB_BEP20', 'DOGE', 'LTC', 'BTC', 'USDT_TRC20', 'USDT_BEP20', 'FAUCETPAY'
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wallet_type)
);

-- User owned miners
CREATE TABLE IF NOT EXISTS public.user_miners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  island_id INTEGER NOT NULL,
  miner_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, island_id, miner_id)
);

-- Island progress and earnings
CREATE TABLE IF NOT EXISTS public.user_islands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  island_id INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  current_earnings DECIMAL(20, 4) DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  last_collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, island_id)
);

-- Transactions history
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'withdraw', 'purchase', 'collect', 'referral_bonus'
  amount DECIMAL(20, 4) NOT NULL,
  currency TEXT, -- 'coins' or crypto type
  wallet_address TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  tx_hash TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral earnings
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL, -- 1, 2, or 3
  total_earned DECIMAL(20, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_miners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for wallets
CREATE POLICY "wallets_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wallets_insert_own" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wallets_update_own" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wallets_delete_own" ON public.wallets FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_miners
CREATE POLICY "user_miners_select_own" ON public.user_miners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_miners_insert_own" ON public.user_miners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_miners_update_own" ON public.user_miners FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_islands
CREATE POLICY "user_islands_select_own" ON public.user_islands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_islands_insert_own" ON public.user_islands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_islands_update_own" ON public.user_islands FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for referrals (can see where you're the referrer)
CREATE POLICY "referrals_select_own" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
