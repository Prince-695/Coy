import { db } from "./client"
import { Profile, MutualMatch, SwipeAction } from "@/types"

export async function getFeedProfiles(userId: string, limit = 50): Promise<Profile[]> {
  const result = await db.execute({
    sql: `
      SELECT p.id, p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests
      FROM profiles p
      WHERE p.id NOT IN (
        SELECT to_profile_id FROM swipes WHERE from_user_id = ?
      )
      ORDER BY p.id ASC
      LIMIT ?;
    `,
    args: [userId, limit],
  })

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    age: Number(row.age),
    photo: String(row.photo),
    bio: String(row.bio),
    city: String(row.city),
    college: row.college ? String(row.college) : null,
    interests:
      typeof row.interests === "string"
        ? JSON.parse(row.interests)
        : (row.interests as unknown as string[]),
  }))
}

export async function getProfileById(profileId: string): Promise<Profile | null> {
  const result = await db.execute({
    sql: `SELECT id, name, age, photo, bio, city, college, interests FROM profiles WHERE id = ? LIMIT 1;`,
    args: [profileId],
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    id: String(row.id),
    name: String(row.name),
    age: Number(row.age),
    photo: String(row.photo),
    bio: String(row.bio),
    city: String(row.city),
    college: row.college ? String(row.college) : null,
    interests:
      typeof row.interests === "string"
        ? JSON.parse(row.interests)
        : (row.interests as unknown as string[]),
  }
}

export async function recordSwipe(
  userId: string,
  profileId: string,
  action: SwipeAction
): Promise<{
  success: boolean
  matched: boolean
  match: { id: string; profileId: string; name?: string; photo?: string } | null
  alreadySwiped?: boolean
}> {
  // 1. Check if profile exists
  const targetProfile = await getProfileById(profileId)
  if (!targetProfile) {
    throw new Error("Profile not found")
  }

  // 2. Check if already swiped
  const existingSwipe = await db.execute({
    sql: `SELECT id FROM swipes WHERE from_user_id = ? AND to_profile_id = ? LIMIT 1;`,
    args: [userId, profileId],
  })

  if (existingSwipe.rows.length > 0) {
    return {
      success: true,
      matched: false,
      match: null,
      alreadySwiped: true,
    }
  }

  const swipeId = `swipe-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

  // 3. If action is PASS, simply record and return no match
  if (action === "PASS") {
    await db.execute({
      sql: `INSERT INTO swipes (id, from_user_id, to_profile_id, action) VALUES (?, ?, ?, ?);`,
      args: [swipeId, userId, profileId, "PASS"],
    })
    return { success: true, matched: false, match: null }
  }

  // 4. If action is LIKE, record swipe and check for mutual like in incoming_likes
  const incomingLike = await db.execute({
    sql: `SELECT id FROM incoming_likes WHERE from_profile_id = ? AND to_user_id = ? LIMIT 1;`,
    args: [profileId, userId],
  })

  const isMutual = incomingLike.rows.length > 0

  if (isMutual) {
    const matchId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    // Transactional batch write
    await db.batch(
      [
        {
          sql: `INSERT INTO swipes (id, from_user_id, to_profile_id, action) VALUES (?, ?, ?, ?);`,
          args: [swipeId, userId, profileId, "LIKE"],
        },
        {
          sql: `INSERT OR IGNORE INTO matches (id, user_id, profile_id) VALUES (?, ?, ?);`,
          args: [matchId, userId, profileId],
        },
      ],
      "write"
    )

    return {
      success: true,
      matched: true,
      match: {
        id: matchId,
        profileId: targetProfile.id,
        name: targetProfile.name,
        photo: targetProfile.photo,
      },
    }
  } else {
    await db.execute({
      sql: `INSERT INTO swipes (id, from_user_id, to_profile_id, action) VALUES (?, ?, ?, ?);`,
      args: [swipeId, userId, profileId, "LIKE"],
    })

    return {
      success: true,
      matched: false,
      match: null,
    }
  }
}

export async function getMutualMatches(userId: string): Promise<MutualMatch[]> {
  const result = await db.execute({
    sql: `
      SELECT m.id, m.created_at, p.id AS profile_id, p.name, p.age, p.photo, p.city
      FROM matches m
      JOIN profiles p ON m.profile_id = p.id
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC;
    `,
    args: [userId],
  })

  return result.rows.map((row) => ({
    id: String(row.id),
    profileId: String(row.profile_id),
    name: String(row.name),
    age: Number(row.age),
    photo: String(row.photo),
    city: String(row.city),
    matchedAt: String(row.created_at),
  }))
}

export async function resetDemoUserSwipes(userId: string): Promise<void> {
  await db.batch(
    [
      {
        sql: `DELETE FROM swipes WHERE from_user_id = ?;`,
        args: [userId],
      },
      {
        sql: `DELETE FROM matches WHERE user_id = ?;`,
        args: [userId],
      },
    ],
    "write"
  )
}
