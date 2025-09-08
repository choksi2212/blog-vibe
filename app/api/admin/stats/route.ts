import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if user is admin
    const user = await db.collection("users").findOne({ uid: decodedToken.uid })
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get blog statistics
    const [totalBlogs, pendingBlogs, publishedBlogs, totalUsers, viewsAggregation] = await Promise.all([
      db.collection("blogs").countDocuments(),
      db.collection("blogs").countDocuments({ status: "pending" }),
      db.collection("blogs").countDocuments({ status: "published" }),
      db.collection("users").countDocuments(),
      db
        .collection("blogs")
        .aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }])
        .toArray(),
    ])

    const totalViews = viewsAggregation[0]?.totalViews || 0

    return NextResponse.json({
      totalBlogs,
      pendingBlogs,
      publishedBlogs,
      totalUsers,
      totalViews,
    })
  } catch (error) {
    console.error("Admin stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
