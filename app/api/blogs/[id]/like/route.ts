import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { rateLimit } from "@/lib/security"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rl = rateLimit(request.headers, 'likes:get', 60, 5 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ liked: false }, { status: 429 })
    }
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ liked: false })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    const like = await db.collection("likes").findOne({
      blogId: id,
      userId: decodedToken.uid,
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    return NextResponse.json({ liked: false })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rl = rateLimit(request.headers, 'likes:post', 30, 5 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if blog exists
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await db.collection("likes").findOne({
      blogId: id,
      userId: decodedToken.uid,
    })

    if (existingLike) {
      // Unlike
      await db.collection("likes").deleteOne({
        blogId: id,
        userId: decodedToken.uid,
      })
      await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $inc: { likes: -1 } })
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await db.collection("likes").insertOne({
        blogId: id,
        userId: decodedToken.uid,
        createdAt: new Date(),
      })
      await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
