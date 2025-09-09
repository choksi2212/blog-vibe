import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"
import { rateLimit, verifyRecaptcha } from "@/lib/security"
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
      recaptchaToken: z.string().optional(),
    })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 })
    }
    const { email, uid, recaptchaToken } = parsed.data

    // reCAPTCHA (opt-in via RECAPTCHA_SECRET_KEY)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null
    const recaptcha = await verifyRecaptcha(recaptchaToken, ip)
    if (!recaptcha.success) {
      // Temporary diagnostics to help debug environment issues; minimal info and only in non-production
      if (process.env.NODE_ENV !== 'production') {
        console.warn('reCAPTCHA failed', { action: recaptcha.action, score: recaptcha.score })
      }
      return NextResponse.json(
        process.env.NODE_ENV !== 'production'
          ? { error: "reCAPTCHA verification failed", action: recaptcha.action, score: recaptcha.score }
          : { error: "reCAPTCHA verification failed" },
        { status: 400 }
      )
    }
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

    try {
      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
