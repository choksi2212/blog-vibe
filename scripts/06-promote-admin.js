// Promote a specific Firebase user UID to admin in MongoDB
// This script upserts the user in devnovate_blog.users with role: "admin"

const dbName = "devnovate_blog"
const dbRef = db.getSiblingDB(dbName)

// Provided UID from the user
const ADMIN_UID = "R1130b5kuzQAzFOi2Wj4xlNoHFN2"

const now = new Date()

const existing = dbRef.users.findOne({ uid: ADMIN_UID })
if (existing) {
  dbRef.users.updateOne(
    { uid: ADMIN_UID },
    {
      $set: {
        role: "admin",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
  )
  print(`✅ Updated existing user ${ADMIN_UID} to role=admin`)
} else {
  dbRef.users.updateOne(
    { uid: ADMIN_UID },
    {
      $set: {
        uid: ADMIN_UID,
        email: "",
        role: "admin",
        profile: {
          displayName: "Admin User",
          bio: "Platform administrator",
          avatar: "",
        },
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  )
  print(`✅ Inserted new admin user with uid=${ADMIN_UID}`)
}

const doc = dbRef.users.findOne({ uid: ADMIN_UID })
printjson(doc)

