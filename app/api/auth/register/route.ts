import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, uid } = await request.json()
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

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
