import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { defaultEconomyConfig } from '@/lib/economy-config';

// GET: Get economy configuration
export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const config = db.collection('economy_config');

    const currentConfig = await config.findOne({});
    
    if (!currentConfig) {
      // Return default config
      return NextResponse.json(defaultEconomyConfig);
    }

    return NextResponse.json(currentConfig.config);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Update economy configuration
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newConfig = await req.json();
    
    if (!newConfig) {
      return NextResponse.json({ error: 'Configuration is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const config = db.collection('economy_config');

    // Validate critical values
    if (newConfig.minerEarningMultiplier <= 0) {
      return NextResponse.json({ error: 'Miner earning multiplier must be positive' }, { status: 400 });
    }

    if (newConfig.withdrawalFeePercentage < 0 || newConfig.withdrawalFeePercentage > 1) {
      return NextResponse.json({ error: 'Withdrawal fee must be between 0 and 1' }, { status: 400 });
    }

    await config.updateOne(
      {},
      { $set: { config: newConfig, updatedAt: new Date(), updatedBy: auth.email } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, config: newConfig });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
