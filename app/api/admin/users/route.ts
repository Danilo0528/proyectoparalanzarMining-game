import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// GET: Fetch all users and withdrawals
export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');
    const withdrawals = db.collection('withdrawals');

    // Fetch users (exclude password field)
    const usersList = await users.find({}, { projection: { password: 0 } }).toArray();
    const withdrawalsList = await withdrawals.find({}).toArray();
    const depositsList = await db.collection('deposits').find({}).toArray();

    return NextResponse.json({
      users: usersList,
      withdrawals: withdrawalsList,
      deposits: depositsList
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Update user role
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await req.json();
    
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');

    await users.updateOne(
      { email },
      { $set: { role } }
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
