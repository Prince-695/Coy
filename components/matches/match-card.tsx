"use client"

import { MutualMatch } from "@/types"
import { MapPin, Sparkles } from "lucide-react"

interface MatchCardProps {
  match: MutualMatch
  onSelect?: () => void
}

export function MatchCard({ match, onSelect }: MatchCardProps) {
  // Format match time cleanly
  function formatMatchTime(dateStr: string) {
    try {
      const matchDate = new Date(dateStr)
      if (isNaN(matchDate.getTime())) return "Recently"
      const now = new Date()
      const diffMs = now.getTime() - matchDate.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 5) return "Just now"
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays === 1) return "Yesterday"
      if (diffDays < 7) return `${diffDays}d ago`
      return matchDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    } catch {
      return "Recently"
    }
  }

  return (
    <div
      onClick={onSelect}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border-2 border-[#15121D] bg-white shadow-coy transition-all hover:-translate-y-1 hover:shadow-coy-lg cursor-pointer select-none"
    >
      {/* Photo Container with generous vertical aspect ratio */}
      <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#E7DFFF]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={match.photo}
          alt={match.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Mutual Match Heart Badge */}
        <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FF3880] shadow-coy-sm">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>

        {/* Time pill badge on image for clean breathing space */}
        <div className="absolute bottom-2.5 right-2.5 rounded-full border border-black/20 bg-black/60 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-xs whitespace-nowrap shadow-sm">
          {formatMatchTime(match.matchedAt)}
        </div>
      </div>

      {/* Spacious Footer Info */}
      <div className="flex flex-col bg-white px-3.5 py-2.5 border-t border-[#15121D]/10">
        <div className="flex items-baseline justify-between gap-1">
          <h3 className="truncate text-base font-black tracking-[-0.03em] text-[#15121D]">
            {match.name}
          </h3>
          <span className="text-sm font-bold text-[#777381] shrink-0">
            {match.age}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[#15121D]">
          <MapPin className="h-3 w-3 text-[#FF3880] shrink-0" />
          <span className="truncate text-xs font-semibold text-[#777381]">
            {match.city}
          </span>
        </div>
      </div>
    </div>
  )
}
