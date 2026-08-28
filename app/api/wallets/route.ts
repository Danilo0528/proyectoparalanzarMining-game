import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET: Get enabled wallets for users (public endpoint)
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('Globingminer');
    const wallets = db.collection('wallets');

    const allWallets = await wallets.find({}).toArray();

    console.log('=== WALLETS IN DB ===');
    allWallets.forEach(w => {
      console.log(`ID: ${w.id}, Name: ${w.name}, Enabled: ${w.enabled}, HasAddress: ${!!w.address?.trim()}`);
    });
    console.log('=====================');

    // Return only enabled wallets with addresses
    const enabledWallets = allWallets.filter(w => {
      const isEnabled = w.enabled === true;
      const hasAddress = w.address && w.address.trim().length > 0;
      return isEnabled && hasAddress;
    });

    console.log(`Enabled wallets: ${enabledWallets.length}`);
    enabledWallets.forEach(w => console.log(`  - ${w.name}: ${w.address?.substring(0, 20)}...`));

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
