import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Check if user is admin
    const user = await db.collection("users").findOne({ uid: decodedToken.uid })
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { action, reason } = await request.json()

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const updateData: any = { updatedAt: new Date() }

    switch (action) {
      case "approve":
        updateData.status = "published"
        break
      case "reject":
        updateData.status = "rejected"
        if (reason) {
          updateData.rejectionReason = reason
        }
        break
      case "hide":
        updateData.status = "hidden"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // Send email notification to author
    if (action === "approve" || action === "reject") {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/blog-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogId: params.id,
            authorId: blog.authorId,
            status: updateData.status,
            blogTitle: blog.title,
            reason: reason || undefined,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: `Blog ${action}d successfully`,
      status: updateData.status,
    })
  } catch (error) {
    console.error("Admin blog action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Admin blog deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
