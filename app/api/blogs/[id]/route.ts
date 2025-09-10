import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { rateLimit, sanitizeHtmlBasic, isValidObjectId } from "@/lib/security"
import { z } from "zod"
import { writeAudit } from "@/lib/audit"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rl = rateLimit(request.headers, 'blogs:getById', 120, 5 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }
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
    const rl = rateLimit(request.headers, 'blogs:put', 30, 10 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    const body = await request.json()
    const schema = z.object({
      title: z.string().min(1).max(300),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      tags: z.array(z.string().max(32)).max(20).optional(),
      status: z.enum(["pending", "draft", "published"]).optional(),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid blog data" }, { status: 400 })
    }
    const { title, content, excerpt, tags, status } = parsed.data

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
      content: sanitizeHtmlBasic(content),
      excerpt: sanitizeHtmlBasic(excerpt || content.substring(0, 200) + "..."),
      tags: tags || [],
      status: status || existingBlog.status,
      updatedAt: new Date(),
    }

    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // audit
    writeAudit({ type: "blog.update", actorId: decodedToken.uid, resource: "blog", resourceId: id })
    return NextResponse.json({ message: "Blog updated successfully" })
  } catch (error) {
    console.error("Blog update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rl = rateLimit(request.headers, 'blogs:delete', 20, 10 * 60 * 1000)
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

    // Check if user owns the blog or is admin
    const user = await db.collection("users").findOne({ uid: decodedToken.uid })
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })

    if (!blog || (blog.authorId !== decodedToken.uid && user?.role !== "admin")) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) })
    writeAudit({ type: "blog.delete", actorId: decodedToken.uid, resource: "blog", resourceId: id })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Blog deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
