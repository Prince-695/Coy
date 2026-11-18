import { db, DEMO_USER } from "./client"
import { SEED_PROFILES } from "./seed-data"

export async function runMigrationsAndSeed(): Promise<{ profileCount: number; incomingCount: number }> {
  // 1. Initialize schema
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      city TEXT NOT NULL,
      college TEXT,
      interests TEXT NOT NULL
    );
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL,
      to_profile_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(from_user_id, to_profile_id)
    );
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, profile_id)
    );
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS incoming_likes (
      id TEXT PRIMARY KEY,
      from_profile_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(from_profile_id, to_user_id)
    );
  `)

  // 2. Seed profiles idempotently using transactions or batch statements
  const profileStatements = SEED_PROFILES.map((p) => ({
    sql: `INSERT OR REPLACE INTO profiles (id, name, age, photo, bio, city, college, interests)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      p.id,
      p.name,
      p.age,
      p.photo,
      p.bio,
      p.city,
      p.college || null,
      JSON.stringify(p.interests),
    ],
  }))

  await db.batch(profileStatements, "write")

  // 3. Seed incoming likes for demo user (private, server-side only)
  const incomingLikes = SEED_PROFILES.filter((p) => p.hasLikedDemoUser)
  const incomingStatements = incomingLikes.map((p) => ({
    sql: `INSERT OR IGNORE INTO incoming_likes (id, from_profile_id, to_user_id)
          VALUES (?, ?, ?)`,
    args: [`inc-${p.id}`, p.id, DEMO_USER.id],
  }))

  await db.batch(incomingStatements, "write")

  return {
    profileCount: SEED_PROFILES.length,
    incomingCount: incomingLikes.length,
  }
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrationsAndSeed()
    .then(({ profileCount, incomingCount }) => {
      console.log(`Successfully seeded ${profileCount} profiles and ${incomingCount} incoming likes.`)
      process.exit(0)
    })
    .catch((err) => {
      console.error("Migration/Seed error:", err)
      process.exit(1)
    })
}
