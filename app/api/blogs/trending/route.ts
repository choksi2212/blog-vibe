import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Get trending blogs based on likes and views in the last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const blogs = await db
      .collection("blogs")
      .find({
        status: "published",
        createdAt: { $gte: oneWeekAgo },
      })
      .sort({
        likes: -1,
        views: -1,
        createdAt: -1,
      })
      .limit(limit)
      .toArray()

    // Get author details for each blog
    const blogsWithAuthors = await Promise.all(
      blogs.map(async (blog) => {
        const author = await db.collection("users").findOne({ uid: blog.authorId })
        return {
          ...blog,
          author: {
            displayName: author?.profile?.displayName || "Anonymous",
            email: author?.email || "",
          },
        }
      }),
    )

    return NextResponse.json({ blogs: blogsWithAuthors })
  } catch (error) {
    console.error("Trending blogs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
