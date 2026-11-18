import { NextResponse } from "next/server"
import { DEMO_USER } from "@/lib/db/client"
import { getMutualMatches } from "@/lib/db/queries"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const matches = await getMutualMatches(DEMO_USER.id)

    return NextResponse.json(
      {
        matches,
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
    console.error("GET /api/matches error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", matches: [] },
      { status: 500 }
    )
  }
}
