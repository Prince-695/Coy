import { NextResponse } from "next/server"
import { DEMO_USER } from "@/lib/db/client"
import { resetDemoUserSwipes } from "@/lib/db/queries"
import { runMigrationsAndSeed } from "@/lib/db/seed"

export async function POST() {
  try {
    await resetDemoUserSwipes(DEMO_USER.id)
    await runMigrationsAndSeed()
    return NextResponse.json({ success: true, message: "Feed reset successfully." })
  } catch (error) {
    console.error("POST /api/reset error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
