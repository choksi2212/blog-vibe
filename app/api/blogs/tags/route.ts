import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Get all unique tags from published blogs
    const tags = await db
      .collection("blogs")
      .aggregate([
        { $match: { status: "published" } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ])
      .toArray()

    const tagNames = tags.map((tag) => tag._id)

    return NextResponse.json({ tags: tagNames })
  } catch (error) {
    console.error("Tags fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
