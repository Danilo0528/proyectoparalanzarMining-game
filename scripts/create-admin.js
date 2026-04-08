#!/usr/bin/env node

/**
 * Script to create the first admin user
 * Run with: node scripts/create-admin.js <email> <password>
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://naofumiiwatana46_db_user:ThI1m8hqmSd3TVLj@globingminer.qgvn8z2.mongodb.net/Globingminer?retryWrites=true&w=majority';

async function createAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node create-admin.js <email> <password>');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('Globingminer');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      // Update existing user to admin
      const result = await users.updateOne(
        { email },
        { 
          $set: { 
            role: 'admin',
            isVerified: true
          } 
        }
      );
      
      console.log(`✅ Updated user ${email} to admin role`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newAdmin = {
        email,
        password: hashedPassword,
        balance: 500,
        islands: [],
        claims: {},
        achievements: [],
        transactions: [],
        lastTick: Date.now(),
        createdAt: new Date(),
        role: 'admin',
        isVerified: true,
      };

      await users.insertOne(newAdmin);
      console.log(`✅ Created admin user: ${email}`);
    }

    console.log('\n🎉 Admin user ready!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\nYou can now login at http://localhost:3000');
    console.log('The admin dashboard will be available after login.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Get email and password from command line args
const email = process.argv[2];
const password = process.argv[3];

createAdmin(email, password);
