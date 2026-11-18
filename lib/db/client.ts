import { createClient, type Client } from "@libsql/client"
import path from "path"

export const DEMO_USER = {
  id: "demo-user-001",
  name: "Prince",
} as const

declare global {
  // eslint-disable-next-line no-var
  var __libsql_db: Client | undefined
}

function getDatabaseClient(): Client {
  const isTest = process.env.NODE_ENV === "test"
  const defaultDbFile = isTest ? "test.db" : "local.db"
  const defaultPath = path.isAbsolute(defaultDbFile)
    ? defaultDbFile
    : path.join(process.cwd(), defaultDbFile)

  const url = process.env.TURSO_DATABASE_URL || `file:${defaultPath}`
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (process.env.NODE_ENV === "production" || isTest) {
    return createClient({ url, authToken })
  }

  if (!global.__libsql_db) {
    global.__libsql_db = createClient({ url, authToken })
  }

  return global.__libsql_db
}

export const db = getDatabaseClient()
