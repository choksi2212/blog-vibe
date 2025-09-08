import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { blogId, authorId, status, blogTitle, reason } = await request.json()

    if (!blogId || !authorId || !status || !blogTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Get author details
    const author = await db.collection("users").findOne({ uid: authorId })
    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
    }

    const userName = author.profile?.displayName || author.email?.split("@")[0] || "Developer"
    let template

    if (status === "published") {
      template = emailTemplates.blogApproved(userName, blogTitle, blogId)
    } else if (status === "rejected") {
      template = emailTemplates.blogRejected(userName, blogTitle, reason)
    } else {
      return NextResponse.json({ error: "Invalid status for notification" }, { status: 400 })
    }

    const result = await sendEmail({
      to: author.email,
      subject: template.subject,
      html: template.html,
    })

    if (result.success) {
      return NextResponse.json({ message: "Blog status notification sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("Blog status notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
