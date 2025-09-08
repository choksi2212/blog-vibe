import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Test database connection
    await db.admin().ping()

    // Get collection stats
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Check if required collections exist
    const requiredCollections = ["users", "blogs", "comments", "likes"]
    const missingCollections = requiredCollections.filter((name) => !collectionNames.includes(name))

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "devnovate_blog",
      collections: {
        total: collections.length,
        required: requiredCollections,
        missing: missingCollections,
        available: collectionNames,
      },
      connection: "active",
    }

    if (missingCollections.length > 0) {
      health.status = "warning"
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error("Database health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
        connection: "failed",
      },
      { status: 500 },
    )
  }
}
