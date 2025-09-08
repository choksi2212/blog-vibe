import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json()

    if (!email || !userName) {
      return NextResponse.json({ error: "Email and userName are required" }, { status: 400 })
    }

    const template = emailTemplates.welcome(userName)
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    if (result.success) {
      return NextResponse.json({ message: "Welcome email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Welcome email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
