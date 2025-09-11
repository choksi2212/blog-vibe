import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { rateLimit } from "@/lib/security"
import { z } from "zod"
import { writeAudit } from "@/lib/audit"

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request.headers, 'auth:register', 10, 10 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    const body = await request.json()
    const schema = z.object({
      email: z.string().email(),
      uid: z.string().min(1),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 })
    }
    const { email, uid } = parsed.data
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)

    if (decodedToken.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ uid })

    if (existingUser) {
      return NextResponse.json({ user: existingUser })
    }

    // Create new user
    const newUser = {
      uid,
      email,
      role: "user",
      createdAt: new Date(),
      profile: {
        displayName: email.split("@")[0],
        bio: "",
        avatar: "",
      },
    }

    await db.collection("users").insertOne(newUser)

    // Trigger welcome email via internal API (previous behavior)
    try {
      await fetch(`${process.env.NEXTAUTH_URL || "https://blog-vibe-wine.vercel.app"}/api/notifications/welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userName: newUser.profile.displayName,
        }),
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail registration if email fails
    }

    writeAudit({ type: "user.register", actorId: uid, actorEmail: email, resource: "user", resourceId: uid })
    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
