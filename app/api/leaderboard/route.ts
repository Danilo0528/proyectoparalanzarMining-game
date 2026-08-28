import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');

    const topUsers = await users
      .find({ role: { $ne: 'admin' }, flagged: { $ne: true } })
      .sort({ balance: -1 })
      .limit(10)
      .project({ email: 1, balance: 1, _id: 0 })
      .toArray();

    // Mask emails for privacy (e.g., test@example.com -> t***@example.com)
    const maskedUsers = topUsers.map(user => {
      const parts = user.email.split('@');
      const name = parts[0];
      const domain = parts[1];
      const maskedName = name.length > 2 
        ? name.substring(0, 2) + '*'.repeat(name.length - 2) 
        : name[0] + '*';
        
      return {
        email: `${maskedName}@${domain}`,
        balance: user.balance || 0
      };
    });

    return NextResponse.json({ users: maskedUsers });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
