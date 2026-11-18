"use client"

import { useState } from "react"
import { MutualMatch } from "@/types"
import { MatchCard } from "./match-card"
import { MatchEmptyState } from "./match-empty-state"
import { Search } from "lucide-react"

interface MatchGridProps {
  matches: MutualMatch[]
  onSelectMatch?: (match: MutualMatch) => void
}

export function MatchGrid({ matches, onSelectMatch }: MatchGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (matches.length === 0) {
    return <MatchEmptyState />
  }

  const filteredMatches = matches.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777381]" />
        <input
          type="text"
          placeholder="Search matches by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border-2 border-[#15121D] bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-[#15121D] placeholder-[#777381] shadow-coy-sm outline-none focus:ring-2 focus:ring-[#FF3880]"
        />
      </div>

      {/* Grid of Matches */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={() => onSelectMatch?.(match)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#15121D]/30 bg-[#F5F3F9] p-8 text-center">
          <p className="text-sm font-bold text-[#777381]">No matches found for &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  )
}
