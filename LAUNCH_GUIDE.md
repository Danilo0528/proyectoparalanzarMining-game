# 🎮 Melqo - MVP Launch Ready!

## ✅ Implementation Complete

### 🔐 Security Features
- ✅ **JWT Authentication** - Secure login with password hashing (bcrypt)
- ✅ **Token-based API** - All requests require valid JWT tokens
- ✅ **Role-based Access** - User and Admin roles
- ✅ **Anti-fraud Detection** - Suspicious balance increase flagging
- ✅ **Password Validation** - Minimum 6 characters, confirmation on registration

### 💰 Payment System
- ✅ **FaucetPay Integration** - Automatic crypto payments (BTC, ETH, DOGE, LTC, TRX, TON, USDT)
- ✅ **Withdrawal Requests** - Users can request withdrawals via multiple methods
- ✅ **Admin Approval System** - All withdrawals require admin approval
- ✅ **Automatic Payments** - If FaucetPay API key is configured, payments are automatic
- ✅ **Balance Validation** - Prevents withdrawal if insufficient balance
- ✅ **Transaction History** - All transactions are recorded in MongoDB

### 👨‍💼 Admin Dashboard
- ✅ **User Management** - View all users, search, change roles
- ✅ **Withdrawal Management** - Approve/reject withdrawal requests
- ✅ **Economy Control** - Adjust conversion rates, limits, bonuses, fees
- ✅ **Statistics** - Total users, balance, withdrawals, flagged accounts
- ✅ **Anti-fraud Monitoring** - View flagged users and suspicious activity

### 🎮 Game Features
- ✅ **5 Mines/Islands** - Progressive unlock system
- ✅ **12 Miners per Mine** - Different earning rates
- ✅ **Offline Earnings** - Players earn while away (24h cap)
- ✅ **Bonus System** - Daily bonus, watch ads, social share, lucky wheel
- ✅ **Auto-sync** - Player data syncs to MongoDB every 60 seconds

### 💎 Economy System
- ✅ **Configurable Conversion** - 2000 coins = $1 (adjustable)
- ✅ **Withdrawal Limits** - Daily and weekly limits
- ✅ **Earning Multipliers** - Global control over earning rates
- ✅ **Withdrawal Fees** - Configurable percentage fee
- ✅ **Top-up System** - Users can purchase coins (50% house edge)

## 🚀 How to Launch

### 1. Start the Development Server
```bash
cd /home/kirito/Documentos/proyectoparalanzar
npm run dev
```

The server is already running on http://localhost:3000

### 2. Create Admin Account
First, register a normal account, then manually change it to admin in MongoDB:

```javascript
// In MongoDB Compass or Shell:
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 3. Configure FaucetPay (Optional)
To enable automatic crypto payments:

1. Create account at https://faucetpay.io
2. Get your API key from https://faucetpay.io/api
3. Add it to `.env.local`:
   ```
   FAUCETPAY_API_KEY="your-api-key-here"
   ```
4. Restart the server

### 4. Test the Full Flow

**Registration → Play → Withdraw → Admin Approval**

1. **Register**: Go to http://localhost:3000, click "Create an account"
2. **Play**: Buy miners, earn coins
3. **Withdraw**: Go to Finance tab → Select payment method → Enter amount and address
4. **Admin**: Login with admin account → Go to Withdrawals tab → Approve/Reject

## 📊 MongoDB Collections

### `users`
- User accounts with balance, miners, transactions
- Fields: email, password (hashed), balance, role, islands, transactions, etc.

### `withdrawals`
- Withdrawal requests waiting for approval
- Fields: id, email, amount, method, address, status, txHash

### `economy_config`
- Economy settings adjustable by admin
- Fields: config (object with all economy parameters)

## 🔧 Environment Variables

```env
MONGODB_URI="your-mongodb-connection-string"
JWT_SECRET="your-secret-key-change-in-production"
FAUCETPAY_API_KEY="your-faucetpay-api-key" # Optional
```

## 💡 Payment Flow

### User Requests Withdrawal:
1. User enters amount and wallet address
2. System validates balance and limits
3. Balance is deducted immediately
4. Withdrawal request saved to MongoDB with status "pending"
5. Request appears in Admin Dashboard

### Admin Approves Withdrawal:
1. Admin clicks "Approve" in dashboard
2. If FaucetPay API key is set:
   - Payment is sent automatically via FaucetPay
   - Transaction hash is recorded
3. If no API key or payment fails:
   - Marked as "approved_manual" for manual processing
4. Admin can see all processed withdrawals

### Admin Rejects Withdrawal:
1. Admin clicks "Reject"
2. Balance is refunded to user automatically
3. Status changed to "rejected"

## 🎯 Economy Balance

### Default Settings:
- **2000 coins = $1 USD** (withdrawal rate)
- **$1 = 1000 coins** (purchase rate - 50% house edge)
- **Minimum withdrawal**: 50 coins
- **Daily limit**: 10,000 coins
- **Weekly limit**: 50,000 coins
- **Withdrawal fee**: 5%

All these can be adjusted in the Admin Dashboard → Economy tab

## 🛡️ Anti-Fraud Features

1. **Balance Validation**: Flags suspicious balance increases (>10,000 coins per sync)
2. **Rate Limiting**: Max earnings per hour configurable
3. **Withdrawal Limits**: Daily and weekly caps
4. **Transaction Logging**: All transactions recorded
5. **Flag System**: Admin can see flagged users

## 📈 Next Steps After Launch

1. **Monitor Withdrawals**: Check admin dashboard daily
2. **Adjust Economy**: Use economy tab to balance earnings
3. **Add FaucetPay**: Enable automatic payments with API key
4. **Email Verification**: Enable in economy config
5. **Analytics**: Add tracking for user behavior
6. **Backup**: Regular MongoDB backups

## 🎉 You're Ready to Launch!

The MVP is complete with:
- ✅ Secure authentication
- ✅ Real payment integration (FaucetPay)
- ✅ Admin control panel
- ✅ Anti-fraud protection
- ✅ Balanced economy system
- ✅ Full withdrawal workflow

Just register users, let them play, and manage withdrawals from the admin panel!
