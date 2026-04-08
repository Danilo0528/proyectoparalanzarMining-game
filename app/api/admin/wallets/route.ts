import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { defaultWallets } from '@/lib/wallet-config';

// GET: Get all wallet configurations
export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const wallets = db.collection('wallets');

    const walletConfig = await wallets.find({}).toArray();

    // Merge configured wallets with defaults
    // Always return all 9 wallets, with configured data where available
    const mergedWallets = defaultWallets.map(defaultWallet => {
      const configured = walletConfig.find(w => w.id === defaultWallet.id);
      if (configured) {
        return { ...defaultWallet, ...configured };
      }
      return defaultWallet;
    });

    return NextResponse.json({ wallets: mergedWallets });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Update or create wallet configuration (Admin only)
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { walletId, updates } = await req.json();
    
    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const wallets = db.collection('wallets');

    // Find existing wallet or create new one
    const existingWallet = await wallets.findOne({ id: walletId });

    if (existingWallet) {
      // Update existing wallet
      await wallets.updateOne(
        { id: walletId },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date(),
            updatedBy: auth.email
          } 
        }
      );
    } else {
      // Create new wallet from defaults
      const defaultWallet = defaultWallets.find(w => w.id === walletId);
      if (!defaultWallet) {
        return NextResponse.json({ error: 'Invalid wallet ID' }, { status: 400 });
      }

      await wallets.insertOne({
        ...defaultWallet,
        ...updates,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: auth.email
      });
    }

    // Return updated wallet
    const updatedWallet = await wallets.findOne({ id: walletId });
    return NextResponse.json({ success: true, wallet: updatedWallet });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
