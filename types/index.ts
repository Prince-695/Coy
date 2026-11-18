export interface Profile {
  id: string
  name: string
  age: number
  photo: string
  bio: string
  city: string
  college?: string | null
  interests: string[]
}

export type SwipeAction = "LIKE" | "PASS"

export interface SwipeRecord {
  id: string
  from_user_id: string
  to_profile_id: string
  action: SwipeAction
  created_at: string
}

export interface MatchRecord {
  id: string
  user_id: string
  profile_id: string
  created_at: string
}

export interface MutualMatch {
  id: string
  profileId: string
  name: string
  age: number
  photo: string
  city: string
  matchedAt: string
}

export interface FeedResponse {
  profiles: Profile[]
  hasMore: boolean
}

export interface SwipeRequest {
  profileId: string
  action: SwipeAction
}

export interface SwipeResponse {
  success: boolean
  matched: boolean
  match: {
    id: string
    profileId: string
    name?: string
    photo?: string
  } | null
}

export interface MatchesResponse {
  matches: MutualMatch[]
}
