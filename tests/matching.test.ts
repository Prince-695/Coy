import { describe, it, expect, beforeEach } from "vitest"
import { getFeedProfiles, recordSwipe, getMutualMatches, resetDemoUserSwipes } from "../lib/db/queries"
import { runMigrationsAndSeed } from "../lib/db/seed"
import { DEMO_USER } from "../lib/db/client"
import { swipeSchema } from "../lib/validations/swipe"

describe("Coy Discover Backend & Matching Logic", () => {
  beforeEach(async () => {
    await runMigrationsAndSeed()
    await resetDemoUserSwipes(DEMO_USER.id)
  })

  it("should validate swipe schema correctly", () => {
    expect(swipeSchema.safeParse({ profileId: "p1", action: "LIKE" }).success).toBe(true)
    expect(swipeSchema.safeParse({ profileId: "p1", action: "PASS" }).success).toBe(true)
    expect(swipeSchema.safeParse({ profileId: "p1", action: "SUPERLIKE" }).success).toBe(false)
    expect(swipeSchema.safeParse({ profileId: "", action: "LIKE" }).success).toBe(false)
  })

  it("should return feed profiles excluding previously swiped ones", async () => {
    const initialProfiles = await getFeedProfiles(DEMO_USER.id)
    expect(initialProfiles.length).toBeGreaterThanOrEqual(30)

    const firstProfile = initialProfiles[0]

    // Swipe PASS on first profile
    const passResult = await recordSwipe(DEMO_USER.id, firstProfile.id, "PASS")
    expect(passResult.success).toBe(true)
    expect(passResult.matched).toBe(false)

    // Feed should no longer contain firstProfile
    const updatedProfiles = await getFeedProfiles(DEMO_USER.id)
    expect(updatedProfiles.some((p) => p.id === firstProfile.id)).toBe(false)
    expect(updatedProfiles.length).toBe(initialProfiles.length - 1)
  })

  it("should create mutual match when user likes a profile that has liked them", async () => {
    // profile-001 has pre-seeded incoming like
    const result = await recordSwipe(DEMO_USER.id, "profile-001", "LIKE")
    expect(result.success).toBe(true)
    expect(result.matched).toBe(true)
    expect(result.match).toBeDefined()
    expect(result.match?.profileId).toBe("profile-001")

    // Matches endpoint must list this match
    const matches = await getMutualMatches(DEMO_USER.id)
    expect(matches.length).toBe(1)
    expect(matches[0].profileId).toBe("profile-001")
    expect(matches[0].name).toBe("Aarohi Patel")
  })

  it("should NOT create a match when passing a profile with an incoming like", async () => {
    // profile-002 has incoming like, but user PASSES
    const result = await recordSwipe(DEMO_USER.id, "profile-002", "PASS")
    expect(result.success).toBe(true)
    expect(result.matched).toBe(false)
    expect(result.match).toBeNull()

    const matches = await getMutualMatches(DEMO_USER.id)
    expect(matches.some((m) => m.profileId === "profile-002")).toBe(false)
  })

  it("should NOT create a match when liking a profile without incoming like (privacy check)", async () => {
    // profile-003 did NOT like demo user
    const result = await recordSwipe(DEMO_USER.id, "profile-003", "LIKE")
    expect(result.success).toBe(true)
    expect(result.matched).toBe(false)
    expect(result.match).toBeNull()

    const matches = await getMutualMatches(DEMO_USER.id)
    expect(matches.some((m) => m.profileId === "profile-003")).toBe(false)
  })

  it("should prevent duplicate swipe recordings", async () => {
    const firstSwipe = await recordSwipe(DEMO_USER.id, "profile-005", "PASS")
    expect(firstSwipe.success).toBe(true)

    const duplicateSwipe = await recordSwipe(DEMO_USER.id, "profile-005", "LIKE")
    expect(duplicateSwipe.alreadySwiped).toBe(true)
  })

  it("should ensure swiped profiles never appear again across multiple re-queries and reloads", async () => {
    const p1 = "profile-001"
    const p2 = "profile-002"
    await recordSwipe(DEMO_USER.id, p1, "LIKE")
    await recordSwipe(DEMO_USER.id, p2, "PASS")

    for (let i = 0; i < 3; i++) {
      const feed = await getFeedProfiles(DEMO_USER.id)
      expect(feed.some((p) => p.id === p1)).toBe(false)
      expect(feed.some((p => p.id === p2))).toBe(false)
    }
  })
})
