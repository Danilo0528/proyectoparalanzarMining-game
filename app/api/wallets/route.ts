import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getEnabledWallets } from '@/lib/wallet-config';

// GET: Get enabled wallets for users (public endpoint)
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('Globingminer');
    const wallets = db.collection('wallets');

    const allWallets = await wallets.find({}).toArray();
    
    // Return only enabled wallets with addresses
    const enabledWallets = allWallets.filter(w => w.enabled && w.address?.trim());

    return NextResponse.json({ 
      wallets: enabledWallets.map(w => ({
        id: w.id,
        name: w.name,
        symbol: w.symbol,
        network: w.network,
        address: w.address,
        minDepositUSD: w.minDepositUSD,
        instructions: w.instructions
      }))
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
