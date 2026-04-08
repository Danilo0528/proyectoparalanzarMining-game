import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: Request) {
  try {
    const { email, password, action } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Globingminer');
    const users = db.collection('users');

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        email,
        password: hashedPassword,
        balance: 500,
        islands: [],
        claims: {},
        achievements: [],
        transactions: [],
        lastTick: Date.now(),
        createdAt: new Date(),
        role: 'user', // 'user' or 'admin'
        isVerified: true,
      };

      await users.insertOne(newUser);

      // Generate token
      const token = jwt.sign({ email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        success: true,
        token,
        user: { email, balance: 500, role: 'user' }
      });
    }

    // Login action
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate token
    const token = jwt.sign({ email, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: user.email,
        balance: user.balance || 500,
        role: user.role || 'user'
      }
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
