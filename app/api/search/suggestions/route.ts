import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Get title suggestions
    const titleSuggestions = await db
      .collection("blogs")
      .find({
        status: "published",
        title: { $regex: query, $options: "i" },
      })
      .limit(limit)
      .project({ title: 1, _id: 1 })
      .toArray()

    // Get tag suggestions
    const tagSuggestions = await db
      .collection("blogs")
      .aggregate([
        { $match: { status: "published" } },
        { $unwind: "$tags" },
        { $match: { tags: { $regex: query, $options: "i" } } },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ])
      .toArray()

    // Get author suggestions
    const authorSuggestions = await db
      .collection("users")
      .find({
        "profile.displayName": { $regex: query, $options: "i" },
      })
      .limit(limit)
      .project({ "profile.displayName": 1, uid: 1 })
      .toArray()

    const suggestions = {
      titles: titleSuggestions.map((blog) => ({
        type: "title",
        text: blog.title,
        id: blog._id,
      })),
      tags: tagSuggestions.map((tag) => ({
        type: "tag",
        text: tag._id,
        count: tag.count,
      })),
      authors: authorSuggestions.map((author) => ({
        type: "author",
        text: author.profile.displayName,
        id: author.uid,
      })),
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Search suggestions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
