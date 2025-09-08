import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if blog exists
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get user details
    const user = await db.collection("users").findOne({ uid: decodedToken.uid })

    const comment = {
      _id: new ObjectId(),
      content: content.trim(),
      author: {
        displayName: user?.profile?.displayName || "Anonymous",
        email: user?.email || "",
      },
      authorId: decodedToken.uid,
      blogId: id,
      createdAt: new Date(),
    }

    // Add comment to comments collection
    await db.collection("comments").insertOne(comment)

    // Update blog comments count
    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $inc: { comments: 1 } })

    if (blog.authorId !== decodedToken.uid) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogId: id,
            commenterName: comment.author.displayName,
            commentContent: content.trim(),
          }),
        })
      } catch (emailError) {
        console.error("Failed to send comment notification:", emailError)
        // Don't fail comment creation if email fails
      }
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
