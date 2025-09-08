import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise
    const db = client.db("devnovate_blog")

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get author details
    const author = await db.collection("users").findOne({ uid: blog.authorId })

    const blogWithAuthor: any = {
      ...blog,
      author: {
        displayName: author?.profile?.displayName || "Anonymous",
        email: author?.email || "",
      },
    }

    // Attach comments array (seeded data may store comments count separately)
    const comments = await db
      .collection("comments")
      .find({ $or: [{ blogId: id }, { blogId: blog._id?.toString?.() }] })
      .sort({ createdAt: -1 })
      .toArray()

    blogWithAuthor.comments = Array.isArray(comments) ? comments : []

    // Increment view count if blog is published
    if (blog.status === "published") {
      await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })
    }

    return NextResponse.json({ blog: blogWithAuthor }, {
      headers: {
        // small cache to reduce load while staying fresh in dev
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Blog fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const { title, content, excerpt, tags, status } = await request.json()

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if user owns the blog
    const existingBlog = await db.collection("blogs").findOne({
      _id: new ObjectId(id),
      authorId: decodedToken.uid,
    })

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    const updateData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      tags: tags || [],
      status: status || existingBlog.status,
      updatedAt: new Date(),
    }

    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ message: "Blog updated successfully" })
  } catch (error) {
    console.error("Blog update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if user owns the blog or is admin
    const user = await db.collection("users").findOne({ uid: decodedToken.uid })
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })

    if (!blog || (blog.authorId !== decodedToken.uid && user?.role !== "admin")) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Blog deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
