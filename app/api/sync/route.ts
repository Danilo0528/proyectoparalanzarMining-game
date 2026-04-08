import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const auth = await verifyToken(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { state } = data;
    const email = auth.email; // Use email from token, not from request

    if (!state) {
      return NextResponse.json({ error: 'State is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');

    // Validate balance changes (anti-fraud)
    const currentUser = await users.findOne({ email });
    if (currentUser) {
      const balanceDiff = (state.balance || 0) - (currentUser.balance || 0);

      // If balance increased by more than expected earnings, flag it
      const expectedMaxEarnings = 10000; // Max coins per sync interval
      if (balanceDiff > expectedMaxEarnings) {
        console.warn(`Suspicious balance increase for ${email}: +${balanceDiff}`);
        // Don't reject, but log for admin review
        state.flagged = true;
        state.flagReason = 'Suspicious balance increase';
      }
    }

    await users.updateOne(
      { email },
      {
        $set: {
          ...state,
          lastSync: new Date()
        }
      },
      { upsert: false }
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
