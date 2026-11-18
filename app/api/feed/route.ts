import { NextResponse } from "next/server"
import { db, DEMO_USER } from "@/lib/db/client"
import { getFeedProfiles } from "@/lib/db/queries"
import { runMigrationsAndSeed } from "@/lib/db/seed"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 100) : 50

    // Only seed if the profiles table itself is empty on first startup
    try {
      const countRes = await db.execute("SELECT COUNT(*) as count FROM profiles")
      if (Number(countRes.rows[0]?.count || 0) === 0) {
        await runMigrationsAndSeed()
      }
    } catch {
      // Table doesn't exist yet, run initial migrations
      await runMigrationsAndSeed()
    }

    // Retrieve only profiles NOT swiped by demo user
    const profiles = await getFeedProfiles(DEMO_USER.id, limit)

    return NextResponse.json(
      {
        profiles,
        hasMore: profiles.length >= limit,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    )
  } catch (error) {
    console.error("GET /api/feed error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", profiles: [], hasMore: false },
      { status: 500 }
    )
  }
}
