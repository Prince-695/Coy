"use client"

import { useState, useEffect, useCallback } from "react"
import { MutualMatch, Profile } from "@/types"
import { MatchGrid } from "@/components/matches/match-grid"
import { ProfileDetails } from "@/components/discover/profile-details"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function MatchesPage() {
  const [matches, setMatches] = useState<MutualMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  const loadMatches = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/matches", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setMatches(data.matches || [])
      }
    } catch (err) {
      console.error("Error loading matches:", err)
      toast.error("Could not load matches.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  // Fetch full profile info for modal when match card is tapped
  const handleSelectMatch = async (match: MutualMatch) => {
    try {
      const res = await fetch(`/api/feed?limit=100`)
      // Try to find the profile or fallback to match fields
      if (res.ok) {
        const data = await res.json()
        const found = (data.profiles as Profile[]).find((p) => p.id === match.profileId)
        if (found) {
          setSelectedProfile(found)
          return
        }
      }
      // If already swiped (so not in feed), construct from match data
      setSelectedProfile({
        id: match.profileId,
        name: match.name,
        age: match.age,
        photo: match.photo,
        bio: "Mutual match on Coy! You both liked each other.",
        city: match.city,
        interests: ["Music", "Coffee", "Travel"],
      })
    } catch {
      setSelectedProfile({
        id: match.profileId,
        name: match.name,
        age: match.age,
        photo: match.photo,
        bio: "Mutual match on Coy! You both liked each other.",
        city: match.city,
        interests: ["Music", "Coffee", "Travel"],
      })
    }
  }

  return (
    <div className="flex flex-1 flex-col p-5 pb-24">
      {/* Header section */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#15121D]">
            Your Matches
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-[#777381]">
            Crushes who liked you back
          </p>
        </div>

        {matches.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border-2 border-[#15121D] bg-[#FFE1EC] px-3.5 py-1 text-xs font-black text-[#FF3880] shadow-coy-sm">
            <Heart className="h-3.5 w-3.5 fill-[#FF3880]" />
            <span>{matches.length} {matches.length === 1 ? "Match" : "Matches"}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[400px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FFE1EC] shadow-coy">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF3880]" />
          </div>
          <p className="mt-4 text-sm font-black text-[#15121D]">
            Loading your mutual matches...
          </p>
        </div>
      ) : (
        <MatchGrid matches={matches} onSelectMatch={handleSelectMatch} />
      )}

      {/* Profile Details Sheet */}
      <ProfileDetails
        profile={selectedProfile}
        isOpen={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
        onLike={() => setSelectedProfile(null)}
        onPass={() => setSelectedProfile(null)}
      />

      <BottomNav matchCount={matches.length} />
    </div>
  )
}
