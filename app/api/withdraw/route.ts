import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { defaultEconomyConfig } from '@/lib/economy-config';

export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method, address } = await req.json();
    const email = auth.email;

    if (!amount || !method || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');
    const withdrawals = db.collection('withdrawals');
    const economyConfig = db.collection('economy_config');

    // Get economy config for min withdrawal
    const configDoc = await economyConfig.findOne({});
    const economyConfig_data = configDoc?.config || defaultEconomyConfig;
    const minWithdrawal = economyConfig_data.minWithdrawal || 50;

    // Validate against dynamic minimum
    if (amount < minWithdrawal) {
      return NextResponse.json({
        error: `Minimum withdrawal is ${minWithdrawal} coins`
      }, { status: 400 });
    }

    // Get user
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check balance
    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Deduct balance
    await users.updateOne(
      { email },
      { $inc: { balance: -amount } }
    );

    // Create withdrawal request
    const withdrawalRequest = {
      id: Date.now(),
      email,
      amount,
      method,
      address,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date()
    };

    await withdrawals.insertOne(withdrawalRequest);

    // Add to user's transactions
    await users.updateOne(
      { email },
      {
        $push: {
          transactions: {
            id: withdrawalRequest.id,
            type: 'withdraw',
            amount,
            method,
            address,
            date: withdrawalRequest.date,
            status: 'pending'
          }
        }
      }
    );

    return NextResponse.json({
      success: true,
      withdrawal: withdrawalRequest
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
