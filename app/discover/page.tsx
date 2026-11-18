"use client"

import { useState, useEffect, useCallback } from "react"
import { Profile, SwipeAction, MutualMatch } from "@/types"
import { SwipeStack } from "@/components/discover/swipe-stack"
import { SwipeActions } from "@/components/discover/swipe-actions"
import { ProfileDetails } from "@/components/discover/profile-details"
import { DiscoverEmptyState } from "@/components/discover/discover-empty-state"
import { MatchCelebration } from "@/components/matches/match-celebration"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [matches, setMatches] = useState<MutualMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null)
  const [celebrationMatch, setCelebrationMatch] = useState<{
    id: string
    profileId: string
    name?: string
    photo?: string
  } | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  // Programmatic trigger for action buttons / keyboard
  const [triggerAction, setTriggerAction] = useState<{
    id: string
    action: SwipeAction
  } | null>(null)

  // Fetch feed and matches
  const loadFeedAndMatches = useCallback(async () => {
    setIsLoading(true)
    try {
      const [feedRes, matchesRes] = await Promise.all([
        fetch("/api/feed", { cache: "no-store" }),
        fetch("/api/matches", { cache: "no-store" }),
      ])

      if (feedRes.ok) {
        const feedData = await feedRes.json()
        setProfiles(feedData.profiles || [])
      }

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json()
        setMatches(matchesData.matches || [])
      }
    } catch (err) {
      console.error("Failed to load feed:", err)
      toast.error("Failed to load discover profiles.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeedAndMatches()
  }, [loadFeedAndMatches])

  // Handle Swipe Completion (called after card has animated off-screen)
  const handleSwipe = useCallback(
    async (profile: Profile, action: SwipeAction) => {
      // Clear trigger action
      setTriggerAction(null)

      // Advance stack immediately: the next card is already in place and ready to swipe
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id))

      try {
        const res = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile.id,
            action,
          }),
        })

        if (!res.ok) {
          throw new Error("Swipe failed on server")
        }

        const data = await res.json()

        if (data.matched && data.match) {
          // Mutual Match!
          setCelebrationMatch({
            id: data.match.id,
            profileId: data.match.profileId,
            name: profile.name,
            photo: profile.photo,
          })

          setMatches((prev) => [
            {
              id: data.match.id,
              profileId: profile.id,
              name: profile.name,
              age: profile.age,
              photo: profile.photo,
              city: profile.city,
              matchedAt: new Date().toISOString(),
            },
            ...prev,
          ])
        }
      } catch (err) {
        console.error("Swipe submission error:", err)
        toast.error("Network issue recording swipe.")
      }
    },
    []
  )

  // Programmatic button swipes with animation
  const swipeLeft = () => {
    if (profiles.length > 0 && !triggerAction) {
      setTriggerAction({ id: profiles[0].id, action: "PASS" })
    }
  }

  const swipeRight = () => {
    if (profiles.length > 0 && !triggerAction) {
      setTriggerAction({ id: profiles[0].id, action: "LIKE" })
    }
  }

  // Reset feed handler
  const handleResetFeed = async () => {
    setIsResetting(true)
    try {
      const res = await fetch("/api/reset", { method: "POST" })
      if (res.ok) {
        toast.success("Feed reset! Loading fresh profiles...")
        await loadFeedAndMatches()
      } else {
        toast.error("Failed to reset feed.")
      }
    } catch {
      toast.error("Network error while resetting feed.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-between p-4 pb-24">
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[500px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FFE1EC] shadow-coy">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF3880]" />
          </div>
          <p className="mt-4 text-sm font-black tracking-tight text-[#15121D]">
            Curating your Coy Discover feed...
          </p>
        </div>
      ) : profiles.length === 0 ? (
        <DiscoverEmptyState onReset={handleResetFeed} isResetting={isResetting} />
      ) : (
        <div className="flex flex-1 flex-col justify-between">
          {/* Main Swipeable Stack */}
          <div className="relative flex-1 flex items-center justify-center py-2">
            <SwipeStack
              profiles={profiles}
              onSwipe={handleSwipe}
              onOpenDetails={(p) => setSelectedProfileForDetails(p)}
              triggerAction={triggerAction}
            />
          </div>

          {/* Bottom Swipe Controls */}
          <SwipeActions
            onSwipeLeft={swipeLeft}
            onSwipeRight={swipeRight}
            onOpenDetails={
              profiles[0]
                ? () => setSelectedProfileForDetails(profiles[0])
                : undefined
            }
            disabled={Boolean(triggerAction) || profiles.length === 0}
          />
        </div>
      )}

      {/* Profile Details Sheet */}
      <ProfileDetails
        profile={selectedProfileForDetails}
        isOpen={Boolean(selectedProfileForDetails)}
        onClose={() => setSelectedProfileForDetails(null)}
        onLike={() => {
          if (selectedProfileForDetails) {
            swipeRight()
          }
        }}
        onPass={() => {
          if (selectedProfileForDetails) {
            swipeLeft()
          }
        }}
      />

      {/* Match Celebration Dialog */}
      <MatchCelebration
        matchedProfile={celebrationMatch}
        isOpen={Boolean(celebrationMatch)}
        onClose={() => setCelebrationMatch(null)}
      />

      {/* Persistent Bottom Nav with Match Count Badge */}
      <BottomNav matchCount={matches.length} />
    </div>
  )
}
