// Promote a specific Firebase user UID to admin in MongoDB
// Usage with mongosh variables (recommended):
// mongosh "<MONGODB_URI>" --file scripts/06-promote-admin.js --eval "ADMIN_UID='your-uid'; ADMIN_EMAIL='you@example.com'"

const dbName = "devnovate_blog"
const dbRef = db.getSiblingDB(dbName)

// Accept values injected via --eval or fallback to hardcoded defaults
// Do NOT leave email as empty string to avoid unique index conflicts
/* global ADMIN_UID, ADMIN_EMAIL */
const uidFromArg = (typeof ADMIN_UID !== 'undefined' && ADMIN_UID) || null
const emailFromArg = (typeof ADMIN_EMAIL !== 'undefined' && ADMIN_EMAIL) || null

if (!uidFromArg) {
  throw new Error("ADMIN_UID is required. Pass via --eval \"ADMIN_UID='your-uid'\"")
}

const now = new Date()

// Build the upsert document
const setFields = {
  role: "admin",
  updatedAt: now,
}

const setOnInsertFields = {
  uid: uidFromArg,
  createdAt: now,
}

// Only set email if provided to avoid duplicate key on empty string
if (emailFromArg && typeof emailFromArg === 'string' && emailFromArg.trim().length > 0) {
  setFields.email = emailFromArg.trim()
}

dbRef.users.updateOne(
  { uid: uidFromArg },
  {
    $set: setFields,
    $setOnInsert: setOnInsertFields,
  },
  { upsert: true },
)

print(`✅ Ensured user ${uidFromArg} has role=admin`)

const doc = dbRef.users.findOne({ uid: uidFromArg })
printjson(doc)
