"use client"

import { useEffect } from "react"
import { X, Heart, Info } from "lucide-react"

interface SwipeActionsProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onOpenDetails?: () => void
  disabled?: boolean
}

export function SwipeActions({
  onSwipeLeft,
  onSwipeRight,
  onOpenDetails,
  disabled = false,
}: SwipeActionsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return
      // Don't trigger if user is in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onSwipeLeft()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        onSwipeRight()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [disabled, onSwipeLeft, onSwipeRight])

  return (
    <div className="flex items-center justify-center gap-6 py-4 select-none">
      {/* Pass Button */}
      <button
        type="button"
        onClick={onSwipeLeft}
        disabled={disabled}
        aria-label="Pass profile (Left Arrow)"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#15121D] bg-white text-[#15121D] shadow-coy transition-all hover:bg-[#F5F3F9] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-coy-sm disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <X className="h-8 w-8 stroke-[3px] text-[#15121D] transition-transform group-hover:rotate-12" />
      </button>

      {/* Info / Details Button */}
      {onOpenDetails && (
        <button
          type="button"
          onClick={onOpenDetails}
          disabled={disabled}
          aria-label="View profile info"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#E7DFFF] text-[#15121D] shadow-coy-sm transition-all hover:bg-[#D9CEFF] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        >
          <Info className="h-6 w-6 stroke-[2.5px]" />
        </button>
      )}

      {/* Like Button */}
      <button
        type="button"
        onClick={onSwipeRight}
        disabled={disabled}
        aria-label="Like profile (Right Arrow)"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FF3880] text-[#15121D] shadow-coy transition-all hover:brightness-105 hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-coy-sm disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <Heart className="h-8 w-8 fill-[#15121D] stroke-[2px] text-[#15121D] transition-transform group-hover:scale-110" />
      </button>
    </div>
  )
}
