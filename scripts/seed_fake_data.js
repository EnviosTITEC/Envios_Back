#!/usr/bin/env node
/*
 Simple seeder for users + addresses. Usage:
  node scripts/seed_fake_data.js 10

 It reads MONGODB_URI from .env or environment and inserts N mock users and 1-3 addresses each.
*/
const mongoose = require('mongoose');
const fs = require('fs');
// use dotenv to parse .env reliably
try { require('dotenv').config(); } catch (e) { /* ignore if not installed */ }

// Prefer env var parsed by dotenv, fallback to simple file parse
function loadMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  if (fs.existsSync('.env')) {
    const line = fs.readFileSync('.env', 'utf8').split(/\r?\n/).find(l => l.startsWith('MONGODB_URI='));
    if (line) return line.split('=')[1].replace(/^\"|\"$/g, '');
  }
  return null;
}

const MONGODB_URI = loadMongoUri();
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment or .env');
  process.exit(1);
}

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const addressSchema = new Schema({
  street: String,
  number: String,
  comune: String,
  province: String,
  region: String,
  postalCode: String,
  references: String,
  user_id: String,
}, { collection: 'addresses', timestamps: true });

const User = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressSchema);

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndStr(len = 6){ return Math.random().toString(36).slice(2, 2+len); }

async function run(n) {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'test', useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGODB_URI);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }

  const users = [];
  for (let i=0;i<n;i++){
    const u = await User.create({
      name: 'User'+rndStr(4),
      lastName: 'Last'+rndStr(4),
      email: `user${Date.now()}${i}@example.com`,
      password: 'password',
    });
    users.push(u);
  }

  for (const u of users) {
    // create exactly 2 addresses per user
    for (let j=0;j<2;j++){
      await Address.create({
        street: ['Av. Siempre Viva','Calle Falsa','Pasaje 1'][randInt(0,2)],
        number: String(randInt(1,999)),
        comune: ['Springfield','Santiago','Valparaiso'][randInt(0,2)],
        province: ['Provincia A','Provincia B'][randInt(0,1)],
        region: 'Región X',
        postalCode: String(1000000 + randInt(0,899999)),
        references: 'Cerca de X',
        user_id: u._id.toString(),
      });
    }
  }

  console.log(`Inserted ${users.length} users and their addresses.`);
  await mongoose.disconnect();
}

const n = parseInt(process.argv[2] || '5', 10);
run(n).catch(err => { console.error(err); process.exit(2); });
