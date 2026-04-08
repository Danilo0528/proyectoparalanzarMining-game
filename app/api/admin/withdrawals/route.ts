import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// POST: Approve or reject withdrawal (MANUAL VERIFICATION REQUIRED)
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { withdrawalId, action, txHash } = await req.json();

    if (!withdrawalId || !action) {
      return NextResponse.json({ error: 'Withdrawal ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject', 'mark_paid'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const withdrawals = db.collection('withdrawals');
    const users = db.collection('users');

    const withdrawal = await withdrawals.findOne({ id: withdrawalId });

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Admin approves the withdrawal - payment must be made manually
      await withdrawals.updateOne(
        { id: withdrawalId },
        {
          $set: {
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: auth.email,
            paymentStatus: 'pending_payment', // Admin still needs to send payment
            currency: mapMethodToCurrency(withdrawal.method),
            cryptoAmount: withdrawal.amount / 2000 // 2000 coins = $1
          }
        }
      );

      console.log(`✅ Withdrawal APPROVED: ${withdrawal.amount} coins by ${auth.email}`);
      console.log(`📧 User: ${withdrawal.email}`);
      console.log(`💰 Method: ${withdrawal.method}`);
      console.log(`📍 Address: ${withdrawal.address}`);
      console.log(`⚠️  ADMIN MUST NOW SEND PAYMENT MANUALLY`);

    } else if (action === 'mark_paid') {
      // Admin marks withdrawal as paid (after sending payment manually)
      await withdrawals.updateOne(
        { id: withdrawalId },
        {
          $set: {
            status: 'completed',
            paymentStatus: 'paid',
            paidAt: new Date(),
            paidBy: auth.email,
            txHash: txHash || null, // Optional: transaction hash for reference
          }
        }
      );

      console.log(`✅ Withdrawal MARKED AS PAID: ${withdrawal.amount} coins by ${auth.email}`);
      if (txHash) {
        console.log(`🔗 Transaction Hash: ${txHash}`);
      }

    } else if (action === 'reject') {
      // Update withdrawal status
      await withdrawals.updateOne(
        { id: withdrawalId },
        { $set: { status: 'rejected', rejectedAt: new Date(), rejectedBy: auth.email } }
      );

      // Refund balance to user
      await users.updateOne(
        { email: withdrawal.email },
        { $inc: { balance: withdrawal.amount } }
      );

      console.log(`Withdrawal rejected: ${withdrawal.amount} coins refunded to ${withdrawal.email}`);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Helper function to map payment method to currency
function mapMethodToCurrency(method: string): string {
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
