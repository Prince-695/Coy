"use client"

import { useState } from "react"
import { Profile, SwipeAction } from "@/types"
import { SwipeCard } from "./swipe-card"
import { ProfileCard } from "./profile-card"
import { motion } from "framer-motion"

interface SwipeStackProps {
  profiles: Profile[]
  onSwipe: (profile: Profile, action: SwipeAction) => void
  onOpenDetails: (profile: Profile) => void
  triggerAction?: { id: string; action: SwipeAction } | null
}

export function SwipeStack({
  profiles,
  onSwipe,
  onOpenDetails,
  triggerAction,
}: SwipeStackProps) {
  const [topCardProgress, setTopCardProgress] = useState(0)
  const [topCardX, setTopCardX] = useState(0)

  const currentProfile = profiles[0]
  const nextProfile = profiles[1]
  const thirdProfile = profiles[2]

  // Interpolate second card scale and position based on drag
  const nextCardScale = 0.95 + topCardProgress * 0.05
  const nextCardY = 12 - topCardProgress * 12
  const nextCardOpacity = 0.85 + topCardProgress * 0.15

  const thirdCardScale = 0.90 + topCardProgress * 0.05
  const thirdCardY = 24 - topCardProgress * 12
  const thirdCardOpacity = 0.45 + topCardProgress * 0.4

  // Ambient side glow opacities
  const leftGlowOpacity = Math.max(0, Math.min(-topCardX / 140, 1))
  const rightGlowOpacity = Math.max(0, Math.min(topCardX / 140, 1))

  return (
    <div className="relative h-[530px] w-full max-w-[420px] mx-auto select-none">
      {/* Ambient Side Gradient Glows (Left = Red on Pass, Right = Green on Like) */}
      <div
        style={{
          opacity: leftGlowOpacity,
          transform: `scale(${1 + leftGlowOpacity * 0.15})`,
        }}
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-[480px] bg-gradient-to-r from-rose-500/50 via-rose-500/20 to-transparent rounded-r-[40px] blur-xl pointer-events-none transition-opacity duration-75 ease-out"
        aria-hidden="true"
      />

      <div
        style={{
          opacity: rightGlowOpacity,
          transform: `scale(${1 + rightGlowOpacity * 0.15})`,
        }}
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-28 h-[480px] bg-gradient-to-l from-emerald-500/50 via-emerald-500/20 to-transparent rounded-l-[40px] blur-xl pointer-events-none transition-opacity duration-75 ease-out"
        aria-hidden="true"
      />

      {/* Third Card Peek */}
      {thirdProfile && (
        <motion.div
          key={thirdProfile.id}
          style={{
            transform: `scale(${thirdCardScale}) translateY(${thirdCardY}px)`,
            opacity: thirdCardOpacity,
          }}
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-100 ease-out"
          aria-hidden="true"
        >
          <ProfileCard profile={thirdProfile} />
        </motion.div>
      )}

      {/* Second Card Behind */}
      {nextProfile && (
        <motion.div
          key={nextProfile.id}
          style={{
            transform: `scale(${nextCardScale}) translateY(${nextCardY}px)`,
            opacity: nextCardOpacity,
          }}
          className="absolute inset-0 z-20 pointer-events-none transition-all duration-100 ease-out"
          aria-hidden="true"
        >
          <ProfileCard
            profile={nextProfile}
            onOpenDetails={() => onOpenDetails(nextProfile)}
          />
        </motion.div>
      )}

      {/* Top Active Interactive Card */}
      {currentProfile && (
        <SwipeCard
          key={currentProfile.id}
          profile={currentProfile}
          isTopCard={true}
          onSwipe={(profile, action) => {
            setTopCardProgress(0)
            setTopCardX(0)
            onSwipe(profile, action)
          }}
          onOpenDetails={onOpenDetails}
          dragProgress={(progress, xVal) => {
            setTopCardProgress(progress)
            setTopCardX(xVal)
          }}
          triggerAction={triggerAction}
        />
      )}
    </div>
  )
}
