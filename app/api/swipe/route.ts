import { NextResponse } from "next/server"
import { DEMO_USER } from "@/lib/db/client"
import { recordSwipe } from "@/lib/db/queries"
import { swipeSchema } from "@/lib/validations/swipe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = swipeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: validation.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { profileId, action } = validation.data

    const result = await recordSwipe(DEMO_USER.id, profileId, action)

    return NextResponse.json(
      {
        success: result.success,
        matched: result.matched,
        match: result.match,
        alreadySwiped: result.alreadySwiped ?? false,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("POST /api/swipe error:", error)
    if (error.message === "Profile not found") {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
