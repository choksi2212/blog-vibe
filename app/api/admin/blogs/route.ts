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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}
    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const blogs = await db.collection("blogs").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

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

    const total = await db.collection("blogs").countDocuments(query)

    return NextResponse.json({
      blogs: blogsWithAuthors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Admin blogs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
