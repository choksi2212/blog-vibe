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

    const blogs = await db.collection("blogs").find({ authorId: decodedToken.uid }).sort({ createdAt: -1 }).toArray()

    // Get author details
    const author = await db.collection("users").findOne({ uid: decodedToken.uid })

    const blogsWithAuthor = blogs.map((blog) => ({
      ...blog,
      author: {
        displayName: author?.profile?.displayName || "Anonymous",
        email: author?.email || "",
      },
    }))

    return NextResponse.json({ blogs: blogsWithAuthor })
  } catch (error) {
    console.error("User blogs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
