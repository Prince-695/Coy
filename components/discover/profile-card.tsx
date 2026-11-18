"use client"

import { useState } from "react"
import { Profile } from "@/types"
import { MapPin, GraduationCap, Info } from "lucide-react"

interface ProfileCardProps {
  profile: Profile
  onOpenDetails?: () => void
  isTopCard?: boolean
}

export function ProfileCard({
  profile,
  onOpenDetails,
  isTopCard = false,
}: ProfileCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Color options for interest tags matching Coy palette
  const tagColors = [
    "bg-[#FFE1EC] text-[#15121D] border-[#FF3880]/30",
    "bg-[#E7DFFF] text-[#15121D] border-[#7055C4]/30",
    "bg-[#FFE0D0] text-[#15121D] border-[#E87A4D]/30",
    "bg-[#FFE15B] text-[#15121D] border-[#C29D00]/30",
    "bg-[#F5F3F9] text-[#15121D] border-[#15121D]/20",
  ]

  // Fallback avatar with initial if image fails to load
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[28px] border-2 border-[#15121D] bg-white shadow-coy-lg transition-all">
      {/* Photo Container */}
      <div className="relative h-full w-full overflow-hidden bg-[#E7DFFF]">
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photo}
            alt={profile.name}
            className={`h-full w-full object-cover transition-opacity duration-300 pointer-events-none ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E7DFFF] to-[#FFE1EC] p-6 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-3 border-[#15121D] bg-[#FFE15B] text-4xl font-black text-[#15121D] shadow-coy">
              {initials}
            </div>
            <p className="mt-4 text-xl font-black text-[#15121D]">{profile.name}</p>
          </div>
        )}

        {/* Top Floating Pill Info */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full border-2 border-[#15121D] bg-white/95 px-3 py-1 text-xs font-black text-[#15121D] backdrop-blur-sm shadow-coy-sm">
            <MapPin className="h-3 w-3 text-[#FF3880]" />
            <span>{profile.city}</span>
          </div>
          {profile.college && (
            <div className="hidden sm:flex items-center gap-1 rounded-full border-2 border-[#15121D] bg-[#E7DFFF]/95 px-3 py-1 text-xs font-bold text-[#15121D] backdrop-blur-sm shadow-coy-sm">
              <GraduationCap className="h-3 w-3 text-[#15121D]" />
              <span className="truncate max-w-[130px]">{profile.college}</span>
            </div>
          )}
        </div>

        {/* Info button on top right */}
        {onOpenDetails && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetails()
            }}
            aria-label="View profile details"
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#15121D] bg-white text-[#15121D] shadow-coy-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Info className="h-5 w-5" />
          </button>
        )}

        {/* Gradient Overlay for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#15121D]/90 via-[#15121D]/50 to-transparent pointer-events-none" />

        {/* Bottom Card Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-[28px] leading-[30px] font-black tracking-[-0.04em] text-white drop-shadow-sm">
              {profile.name}
            </h2>
            <span className="text-2xl font-bold text-white/90">
              {profile.age}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-white/95 drop-shadow">
            {profile.bio}
          </p>

          {/* Interest Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <span
                key={interest}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                  tagColors[idx % tagColors.length]
                } shadow-sm`}
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 4 && (
              <span className="rounded-full border border-white/40 bg-black/40 px-2 py-0.5 text-xs font-bold text-white">
                +{profile.interests.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
