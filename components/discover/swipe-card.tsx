"use client"

import { useEffect, useRef } from "react"
import { Profile, SwipeAction } from "@/types"
import { ProfileCard } from "./profile-card"
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationControls,
  PanInfo,
} from "framer-motion"

interface SwipeCardProps {
  profile: Profile
  isTopCard: boolean
  onSwipe: (profile: Profile, action: SwipeAction) => void
  onOpenDetails: (profile: Profile) => void
  dragProgress?: (progress: number, xVal: number) => void
  triggerAction?: { id: string; action: SwipeAction } | null
}

export function SwipeCard({
  profile,
  isTopCard,
  onSwipe,
  onOpenDetails,
  dragProgress,
  triggerAction,
}: SwipeCardProps) {
  const controls = useAnimationControls()
  const isSwipingRef = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 0, 260], [-18, 0, 18])
  
  // Opacities for LIKE and PASS indicator badges
  const likeOpacity = useTransform(x, [20, 110], [0, 1])
  const passOpacity = useTransform(x, [-20, -110], [0, 1])

  // Opacities for Green and Red Gradient animations
  const likeGradientOpacity = useTransform(x, [10, 150], [0, 0.85])
  const passGradientOpacity = useTransform(x, [-10, -150], [0, 0.85])

  // Track progress and x-value for ambient edge gradients & card behind scaling
  useEffect(() => {
    if (!isTopCard || !dragProgress) return
    const unsubscribe = x.on("change", (latest) => {
      const progress = Math.min(Math.abs(latest) / 160, 1)
      dragProgress(progress, latest)
    })
    return () => unsubscribe()
  }, [isTopCard, dragProgress, x])

  // Programmatic swipe triggers (from action buttons or keyboard)
  useEffect(() => {
    if (!isTopCard || !triggerAction || triggerAction.id !== profile.id) return

    if (triggerAction.action === "LIKE") {
      isSwipingRef.current = true
      controls
        .start({
          x: 600,
          rotate: 20,
          opacity: 0,
          transition: { duration: 0.28, ease: "easeOut" },
        })
        .then(() => {
          onSwipe(profile, "LIKE")
        })
    } else if (triggerAction.action === "PASS") {
      isSwipingRef.current = true
      controls
        .start({
          x: -600,
          rotate: -20,
          opacity: 0,
          transition: { duration: 0.28, ease: "easeOut" },
        })
        .then(() => {
          onSwipe(profile, "PASS")
        })
    }
  }, [triggerAction, isTopCard, profile, controls, onSwipe])

  const handleDragStart = (_: any, info: PanInfo) => {
    dragStartPos.current = { x: info.point.x, y: info.point.y }
  }

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (isSwipingRef.current) return

    const swipeThreshold = 100
    const velocityThreshold = 400

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Swiped RIGHT -> LIKE (Green)
      isSwipingRef.current = true
      await controls.start({
        x: 600,
        rotate: 20,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      })
      onSwipe(profile, "LIKE")
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Swiped LEFT -> PASS (Red)
      isSwipingRef.current = true
      await controls.start({
        x: -600,
        rotate: -20,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      })
      onSwipe(profile, "PASS")
    } else {
      // Return to center smoothly
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 450, damping: 28 },
      })
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // If it was a drag, don't trigger click
    if (Math.abs(x.get()) > 10) return
    onOpenDetails(profile)
  }

  return (
    <motion.div
      animate={controls}
      style={isTopCard ? { x, rotate } : undefined}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className={`absolute inset-0 select-none ${
        isTopCard ? "z-30 cursor-grab active:cursor-grabbing touch-none" : "pointer-events-none"
      }`}
    >
      {/* Dynamic Animated Green Gradient for LIKE (Right Swipe) */}
      {isTopCard && (
        <motion.div
          style={{ opacity: likeGradientOpacity }}
          className="absolute inset-0 z-35 pointer-events-none rounded-[28px] overflow-hidden bg-gradient-to-l from-emerald-500/70 via-emerald-400/30 to-transparent transition-opacity"
        />
      )}

      {/* Dynamic Animated Red Gradient for PASS (Left Swipe) */}
      {isTopCard && (
        <motion.div
          style={{ opacity: passGradientOpacity }}
          className="absolute inset-0 z-35 pointer-events-none rounded-[28px] overflow-hidden bg-gradient-to-r from-rose-500/70 via-rose-400/30 to-transparent transition-opacity"
        />
      )}

      {/* LIKE Indicator Badge (Green accent with 💚) */}
      {isTopCard && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-40 rotate-[-15deg] pointer-events-none"
        >
          <div className="rounded-2xl border-4 border-emerald-500 bg-white/95 px-5 py-2 text-2xl font-black tracking-wider text-emerald-600 shadow-coy backdrop-blur-xs">
            LIKE 💚
          </div>
        </motion.div>
      )}

      {/* PASS Indicator Badge (Red accent with ✕) */}
      {isTopCard && (
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-8 right-8 z-40 rotate-[15deg] pointer-events-none"
        >
          <div className="rounded-2xl border-4 border-rose-500 bg-white/95 px-5 py-2 text-2xl font-black tracking-wider text-rose-600 shadow-coy backdrop-blur-xs">
            PASS ✕
          </div>
        </motion.div>
      )}

      {/* Card Content */}
      <ProfileCard
        profile={profile}
        onOpenDetails={() => onOpenDetails(profile)}
        isTopCard={isTopCard}
      />
    </motion.div>
  )
}
