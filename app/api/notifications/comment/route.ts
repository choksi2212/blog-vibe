import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { blogId, commenterName, commentContent } = await request.json()

    if (!blogId || !commenterName || !commentContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Get blog and author details
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(blogId) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const author = await db.collection("users").findOne({ uid: blog.authorId })
    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    const userName = author.profile?.displayName || author.email?.split("@")[0] || "Developer"
    const template = emailTemplates.newComment(userName, blog.title, blogId, commenterName, commentContent)

    const result = await sendEmail({
      to: author.email,
      subject: template.subject,
      html: template.html,
    })

    if (result.success) {
      return NextResponse.json({ message: "Comment notification sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("Comment notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
