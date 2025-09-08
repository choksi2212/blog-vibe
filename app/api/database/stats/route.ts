import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseStats } from "@/lib/database-utils"

export async function GET(request: NextRequest) {
  try {
    const stats = await getDatabaseStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Database stats error:", error)
    return NextResponse.json({ error: "Failed to fetch database statistics" }, { status: 500 })
  }
}
