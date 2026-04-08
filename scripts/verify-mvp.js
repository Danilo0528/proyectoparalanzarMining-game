#!/usr/bin/env node

/**
 * Verification script - Checks all MVP features are working
 * Run with: node scripts/verify-mvp.js
 */

const http = require('http');

const BASE_URL = 'localhost:3000';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function verify() {
  console.log('🔍 Verifying MVP Features...\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: Server is running
  console.log('1️⃣  Checking if server is running...');
  try {
    const res = await makeRequest('/');
    if (res.status === 200) {
      console.log('   ✅ Server is running (HTTP 200)\n');
      passed++;
    } else {
      console.log(`   ❌ Server returned HTTP ${res.status}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ Cannot reach server: ${error.message}\n`);
    failed++;
  }

  // Test 2: Login API exists
  console.log('2️⃣  Checking login API...');
  try {
    const res = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123', action: 'login' })
    });
    const data = JSON.parse(res.data);
    if (res.status === 401 || data.error) {
      console.log('   ✅ Login API endpoint exists (auth working)\n');
      passed++;
    } else {
      console.log('   ⚠️  Login API responded unexpectedly\n');
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ Login API error: ${error.message}\n`);
    failed++;
  }

  // Test 3: Admin user exists
  console.log('3️⃣  Checking admin user...');
  try {
    const { MongoClient } = require('mongodb');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://naofumiiwatana46_db_user:ThI1m8hqmSd3TVLj@globingminer.qgvn8z2.mongodb.net/Globingminer?retryWrites=true&w=majority';
    const client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    const db = client.db('Globingminer');
    const users = db.collection('users');
    const admin = await users.findOne({ role: 'admin' });
    
    if (admin) {
      console.log(`   ✅ Admin user exists: ${admin.email}\n`);
      passed++;
    } else {
      console.log('   ⚠️  No admin user found. Create one with: node scripts/create-admin.js\n');
      failed++;
    }
    
    await client.close();
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}\n`);
    failed++;
  }

  // Test 4: Check if all components exist
  console.log('4️⃣  Checking required files...');
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'lib/mongodb.ts',
    'lib/auth.ts',
    'lib/payment-api.ts',
    'lib/economy-config.ts',
    'app/api/auth/login/route.ts',
    'app/api/sync/route.ts',
    'app/api/withdraw/route.ts',
    'app/api/admin/users/route.ts',
    'app/api/admin/withdrawals/route.ts',
    'app/api/admin/economy/route.ts',
    'components/login-page.tsx',
    'components/game-dashboard.tsx',
    'components/admin-dashboard.tsx',
    'components/tabs/finance-tab.tsx',
    'scripts/create-admin.js'
  ];

  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ Missing: ${file}`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log('   ✅ All required files exist\n');
    passed++;
  } else {
    console.log('');
    failed++;
  }

  // Test 5: Environment variables
  console.log('5️⃣  Checking environment variables...');
  const envFile = require('fs').readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  
  if (envFile.includes('MONGODB_URI')) {
    console.log('   ✅ MONGODB_URI configured');
    passed++;
  } else {
    console.log('   ❌ MONGODB_URI not configured');
    failed++;
  }

  if (envFile.includes('JWT_SECRET')) {
    console.log('   ✅ JWT_SECRET configured\n');
    passed++;
  } else {
    console.log('   ⚠️  JWT_SECRET not configured (using default)\n');
  }

  // Summary
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('═══════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 ALL CHECKS PASSED! MVP is ready to launch!\n');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@melqo.com');
    console.log('   Password: admin123\n');
    console.log('🌐 Access: http://localhost:3000\n');
  } else {
    console.log('⚠️  Some checks failed. Review the issues above.\n');
  }
}

verify().catch(console.error);
