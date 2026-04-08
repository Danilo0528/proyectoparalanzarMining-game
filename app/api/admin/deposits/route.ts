import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// POST: Verify or reject deposit
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { depositId, action, notes } = await req.json();
    
    if (!depositId || !action) {
      return NextResponse.json({ error: 'Deposit ID and action are required' }, { status: 400 });
    }

    if (!['verify', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const deposits = db.collection('deposits');
    const users = db.collection('users');

    const deposit = await deposits.findOne({ id: depositId });
    
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending_verification') {
      return NextResponse.json({ error: 'Deposit already processed' }, { status: 400 });
    }

    if (action === 'verify') {
      // Admin confirms payment was received - keep the credited balance
      await deposits.updateOne(
        { id: depositId },
        { 
          $set: { 
            status: 'verified',
            verifiedAt: new Date(),
            verifiedBy: auth.email,
            notes: notes || ''
          } 
        }
      );

      // Update transaction status
      await users.updateOne(
        { email: deposit.email },
        {
          $set: {
            'transactions.$[elem].status': 'verified'
          }
        },
        {
          arrayFilters: [{ 'elem.id': depositId }]
        }
      );

      console.log(`✅ Deposit VERIFIED: ${deposit.coinsReceived} coins for ${deposit.email} by ${auth.email}`);
      console.log(`💰 Payment of $${deposit.amountUSD} confirmed via ${deposit.method}`);

    } else if (action === 'reject') {
      // Admin confirms payment was NOT received - REVOKE the credited balance
      await deposits.updateOne(
        { id: depositId },
        { 
          $set: { 
            status: 'rejected',
            rejectedAt: new Date(),
            rejectedBy: auth.email,
            notes: notes || 'Payment not received'
          } 
        }
      );

      // REVOKE the credited balance
      await users.updateOne(
        { email: deposit.email },
        { $inc: { balance: -deposit.coinsReceived } }
      );

      // Update transaction status
      await users.updateOne(
        { email: deposit.email },
        {
          $set: {
            'transactions.$[elem].status': 'rejected'
          }
        },
        {
          arrayFilters: [{ 'elem.id': depositId }]
        }
      );

      console.log(`❌ Deposit REJECTED: ${deposit.coinsReceived} coins REVOKED from ${deposit.email}`);
      console.log(`💸 Balance reverted by ${auth.email}`);
      if (notes) {
        console.log(`📝 Notes: ${notes}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
