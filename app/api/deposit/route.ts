import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method } = await req.json();
    const email = auth.email;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!method) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');
    const deposits = db.collection('deposits');
    const wallets = db.collection('wallets');

    // CRITICAL: Validate that the wallet for this method is configured and enabled
    const walletConfig = await wallets.findOne({ name: method.toUpperCase() });

    if (!walletConfig || !walletConfig.enabled || !walletConfig.address?.trim()) {
      return NextResponse.json({
        error: `Deposits via ${method} are not available. Admin has not configured this wallet yet.`
      }, { status: 400 });
    }

    // Get user
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate coins to receive ($1 = 1000 coins)
    const coinsToAdd = amount * 1000;

    // Validate minimum deposit
    const minDepositUSD = walletConfig.minDepositUSD || 5;
    if (amount < minDepositUSD) {
      return NextResponse.json({
        error: `Minimum deposit for ${method} is $${minDepositUSD} USD`
      }, { status: 400 });
    }

    // IMMEDIATELY credit balance (so user sees it right away)
    await users.updateOne(
      { email },
      { $inc: { balance: coinsToAdd } }
    );

    // Create deposit request (pending verification)
    const depositRequest = {
      id: Date.now(),
      email,
      amountUSD: amount,
      coinsReceived: coinsToAdd,
      method,
      walletAddress: walletConfig.address, // Record which wallet was used
      date: new Date().toISOString().split('T')[0],
      status: 'pending_verification', // pending_verification, verified, rejected
      creditedImmediately: true, // Flag: balance was already credited
      createdAt: new Date()
    };

    await deposits.insertOne(depositRequest);

    // Add to user's transactions
    await users.updateOne(
      { email },
      {
        $push: {
          transactions: {
            id: depositRequest.id,
            type: 'deposit',
            amount: coinsToAdd,
            method,
            date: depositRequest.date,
            status: 'pending_verification',
            creditedImmediately: true
          }
        }
      }
    );

    return NextResponse.json({
      success: true,
      coinsAdded: coinsToAdd,
      newBalance: (user.balance || 0) + coinsToAdd,
      deposit: depositRequest
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
