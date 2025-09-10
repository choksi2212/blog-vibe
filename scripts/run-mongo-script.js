// Run a MongoDB script with MONGODB_URI loaded from .env.local
// Usage: node scripts/run-mongo-script.js scripts/03-seed-data.js

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// load .env.local
require('./load-env')

const scriptPath = process.argv[2]
if (!scriptPath) {
  console.error('Usage: node scripts/run-mongo-script.js <path-to-mongo-script.js>')
  process.exit(1)
}

const absScript = path.isAbsolute(scriptPath) ? scriptPath : path.join(process.cwd(), scriptPath)

if (!fs.existsSync(absScript)) {
  console.error(`Script not found: ${absScript}`)
  process.exit(1)
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set. Add it to .env.local in the project root.')
  process.exit(1)
}

try {
  const cmd = `mongosh "${uri}" --file "${absScript}"`
  execSync(cmd, { stdio: 'inherit' })
} catch (e) {
  console.error('Failed running mongosh:', e.message)
  process.exit(1)
}
