import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// GET: Get user's referral data
export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');

    const user = await users.findOne({ email: auth.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get referrals from user document
    const referrals = user.referrals || [];
    const referralEarnings = user.referralEarnings || 0;

    return NextResponse.json({
      referralCode: user.email, // Use email as referral code
      referrals,
      referralEarnings,
      totalReferrals: referrals.length
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
