// Revoke All Admin Access Script
// This script removes admin privileges from all users
// Run with: node scripts/06-revoke-all-admins.js

const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function revokeAllAdmins() {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI environment variable is not set")
    console.log("Please set your MongoDB connection string in a .env.local file:")
    console.log("MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devnovate_blog")
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    console.log("🔐 Connecting to MongoDB...")
    await client.connect()
    console.log("✅ Connected to MongoDB")
    
    const db = client.db("devnovate_blog")
    
    // Find all current admin users
    console.log("🔍 Finding all admin users...")
    const adminUsers = await db.collection("users").find({ role: "admin" }).toArray()
    console.log(`📊 Found ${adminUsers.length} admin users:`)
    
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.uid})`)
    })
    
    if (adminUsers.length === 0) {
      console.log("ℹ️  No admin users found. Nothing to revoke.")
      return
    }
    
    // Confirm before proceeding
    console.log("\n⚠️  WARNING: This will revoke admin access from ALL users!")
    console.log("Only users promoted using the promote-admin-node.js script will have admin access.")
    console.log("\nPress Ctrl+C to cancel, or wait 5 seconds to continue...")
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Revoke admin access from all users
    console.log("\n🔐 Revoking admin access from all users...")
    const result = await db.collection("users").updateMany(
      { role: "admin" },
      { $set: { role: "user" } }
    )
    
    console.log(`✅ Successfully revoked admin access from ${result.modifiedCount} users`)
    
    // Verify the changes
    console.log("🔍 Verifying changes...")
    const remainingAdmins = await db.collection("users").find({ role: "admin" }).toArray()
    
    if (remainingAdmins.length === 0) {
      console.log("✅ All admin access has been successfully revoked")
      console.log("📋 Next steps:")
      console.log("  1. Use 'node scripts/promote-admin-node.js' to promote specific users to admin")
      console.log("  2. Only those users will have access to the admin panel")
    } else {
      console.log(`⚠️  Warning: ${remainingAdmins.length} users still have admin access`)
      remainingAdmins.forEach(user => {
        console.log(`  - ${user.email} (${user.uid})`)
      })
    }
    
    console.log("📝 Admin revocation completed successfully")
    
  } catch (error) {
    console.error("❌ Error revoking admin access:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔐 MongoDB connection closed")
  }
}

// Run the script
revokeAllAdmins()
