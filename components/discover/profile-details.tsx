"use client"

import { useEffect } from "react"
import { Profile } from "@/types"
import { X, Heart, MapPin, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileDetailsProps {
  profile: Profile | null
  isOpen: boolean
  onClose: () => void
  onLike: () => void
  onPass: () => void
}

export function ProfileDetails({
  profile,
  isOpen,
  onClose,
  onLike,
  onPass,
}: ProfileDetailsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!profile) return null

  const tagColors = [
    "bg-[#FFE1EC] text-[#15121D] border-[#FF3880]/30",
    "bg-[#E7DFFF] text-[#15121D] border-[#7055C4]/30",
    "bg-[#FFE0D0] text-[#15121D] border-[#E87A4D]/30",
    "bg-[#FFE15B] text-[#15121D] border-[#C29D00]/30",
    "bg-[#F5F3F9] text-[#15121D] border-[#15121D]/20",
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#15121D]/60 backdrop-blur-xs"
          />

          {/* Modal / Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[32px] border-t-2 border-x-2 border-[#15121D] bg-white shadow-2xl"
          >
            {/* Header drag handle & close button */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#15121D]/10 bg-white/95 px-5 py-3 backdrop-blur-sm">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#15121D]/20" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#F5F3F9] text-[#15121D] shadow-coy-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4 stroke-[3px]" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-28">
              {/* Profile Image Full Portrait Banner */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[26px] border-2 border-[#15121D] bg-[#E7DFFF] shadow-coy">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Title & Age */}
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-[#15121D]">
                    {profile.name},{" "}
                    <span className="font-bold text-[#777381]">{profile.age}</span>
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#15121D] bg-[#FFE0D0] px-3 py-1 text-xs font-bold text-[#15121D] shadow-coy-sm">
                      <MapPin className="h-3 w-3 text-[#FF3880]" />
                      {profile.city}
                    </span>
                    {profile.college && (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#15121D] bg-[#E7DFFF] px-3 py-1 text-xs font-bold text-[#15121D] shadow-coy-sm">
                        <GraduationCap className="h-3 w-3 text-[#15121D]" />
                        {profile.college}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-6 rounded-2xl border-2 border-[#15121D] bg-[#F5F3F9] p-4 shadow-coy-sm">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#777381]">
                  About
                </h2>
                <p className="mt-2 text-base font-medium leading-relaxed text-[#15121D]">
                  {profile.bio}
                </p>
              </div>

              {/* Interests Section */}
              <div className="mt-5">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#777381]">
                  Interests
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <span
                      key={interest}
                      className={`rounded-full border-2 border-[#15121D] px-3.5 py-1 text-xs font-bold ${
                        tagColors[idx % tagColors.length]
                      } shadow-coy-sm`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Floating Bar inside modal */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t-2 border-[#15121D] bg-white/95 px-6 py-4 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onPass()
                }}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-white px-7 py-3 text-sm font-black text-[#15121D] shadow-coy transition-all hover:bg-[#F5F3F9] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <X className="h-5 w-5 stroke-[3px]" />
                <span>Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  onLike()
                }}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-[#FF3880] px-7 py-3 text-sm font-black text-[#15121D] shadow-coy transition-all hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <Heart className="h-5 w-5 fill-[#15121D] stroke-[2px]" />
                <span>Like</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
