"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { Heart, Sparkles, Compass } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MatchCelebrationProps {
  matchedProfile: {
    id: string
    profileId: string
    name?: string
    photo?: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export function MatchCelebration({
  matchedProfile,
  isOpen,
  onClose,
}: MatchCelebrationProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Fire festive confetti in Coy signature palette (#FF3880, #E7DFFF, #FFE15B)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF3880", "#E7DFFF", "#FFE15B", "#15121D", "#FFE0D0"],
      })
    }
  }, [isOpen])

  if (!matchedProfile) return null

  // Fixed demo user Prince details
  const demoUser = {
    name: "Prince",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#15121D]/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[36px] border-3 border-[#15121D] bg-white p-7 text-center shadow-coy-lg"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#15121D] bg-[#FFE1EC] px-4 py-1 text-xs font-black text-[#FF3880] shadow-coy-sm">
              <Sparkles className="h-3.5 w-3.5 fill-[#FF3880]" />
              <span>MUTUAL MATCH</span>
            </div>

            {/* Headline */}
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#15121D]">
              It&apos;s a Match!
            </h2>
            <p className="mt-1.5 text-sm font-semibold text-[#777381]">
              You and <span className="text-[#15121D] font-bold">{matchedProfile.name || "someone special"}</span> liked each other.
            </p>

            {/* Avatars with Heart Connection */}
            <div className="my-8 flex items-center justify-center">
              <div className="relative flex items-center">
                {/* Demo User Avatar */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="relative z-10 h-24 w-24 overflow-hidden rounded-full border-3 border-[#15121D] bg-[#E7DFFF] shadow-coy"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demoUser.photo}
                    alt={demoUser.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {/* Animated Heart Center Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FF3880] text-white shadow-coy"
                >
                  <Heart className="h-6 w-6 fill-[#15121D] stroke-[2px] text-[#15121D]" />
                </motion.div>

                {/* Matched Profile Avatar */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="relative z-10 -ml-4 h-24 w-24 overflow-hidden rounded-full border-3 border-[#15121D] bg-[#FFE0D0] shadow-coy"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={matchedProfile.photo || demoUser.photo}
                    alt={matchedProfile.name || "Match"}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  router.push("/matches")
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-[#FF3880] py-3.5 text-base font-black text-[#15121D] shadow-coy transition-all hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <Heart className="h-5 w-5 fill-[#15121D] stroke-[2px]" />
                <span>View Matches</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-white py-3.5 text-base font-black text-[#15121D] shadow-coy transition-all hover:bg-[#F5F3F9] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <Compass className="h-5 w-5 text-[#15121D]" />
                <span>Keep Discovering</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
