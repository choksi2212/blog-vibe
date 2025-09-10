#!/usr/bin/env node

/**
 * Promote a user to admin (Node.js version)
 *
 * Usage (interactive):
 *   node scripts/promote-admin-node.js
 *
 * Usage (non-interactive):
 *   node scripts/promote-admin-node.js --uid=FIREBASE_UID --email=user@example.com
 *
 * Requirements:
 * - .env.local with MONGODB_URI=...
 */

const path = require('path')
const fs = require('fs')
const readline = require('readline')
const { MongoClient } = require('mongodb')

// Load env (re-uses the existing helper if available)
try {
  require('./load-env')
} catch (_) {
  // fallback: try to load .env.local if helper not present
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath })
  }
}

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'devnovate_blog'
const COLLECTION = 'users'

function parseArg(key) {
  const prefix = `--${key}=`
  const found = process.argv.find((a) => a.startsWith(prefix))
  return found ? found.slice(prefix.length) : undefined
}

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()) }))
}

async function main() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local or your environment.')
    process.exit(1)
  }

  // Prefer CLI args; fall back to interactive prompts
  let uid = parseArg('uid')
  let email = parseArg('email')

  if (!uid) uid = await prompt('Enter Firebase UID to promote: ')
  if (!uid) {
    console.error('❌ UID is required.')
    process.exit(1)
  }

  if (typeof email === 'undefined') {
    email = await prompt('Enter email associated with this UID (press Enter to skip): ')
  }

  const now = new Date()
  const setFields = { role: 'admin', updatedAt: now }
  if (email && email.trim().length > 0) setFields.email = email.trim()
  const setOnInsert = { uid, createdAt: now }

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  try {
    console.log('⏳ Connecting to MongoDB...')
    await client.connect()
    const db = client.db(DB_NAME)
    const users = db.collection(COLLECTION)

    console.log(`⏳ Promoting UID=${uid} to admin...`)
    await users.updateOne(
      { uid },
      { $set: setFields, $setOnInsert: setOnInsert },
      { upsert: true },
    )

    const doc = await users.findOne({ uid })
    console.log('✅ Ensured user has role=admin')
    console.log(JSON.stringify(doc, null, 2))
  } catch (err) {
    console.error('❌ Operation failed:', err?.message || err)
    process.exitCode = 1
  } finally {
    await client.close().catch(() => {})
  }
}

main()


