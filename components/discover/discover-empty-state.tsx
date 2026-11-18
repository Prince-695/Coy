"use client"

import { RefreshCw, Sparkles } from "lucide-react"

interface DiscoverEmptyStateProps {
  onReset: () => void
  isResetting?: boolean
}

export function DiscoverEmptyState({
  onReset,
  isResetting = false,
}: DiscoverEmptyStateProps) {
  return (
    <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-[#15121D] bg-[#E7DFFF] p-8 shadow-coy-lg w-full max-w-sm">
        {/* Playful Dot Grid Decor */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FFE15B] shadow-coy">
          <Sparkles className="h-10 w-10 text-[#15121D]" />
        </div>

        <h3 className="text-2xl font-black tracking-tight text-[#15121D]">
          You&apos;re all caught up!
        </h3>

        <p className="mt-2 text-sm font-medium leading-relaxed text-[#777381]">
          You have seen every profile around you for now. Keep your interest private and check your matches!
        </p>

        <div className="mt-6 w-full">
          <button
            type="button"
            onClick={onReset}
            disabled={isResetting}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-[#FF3880] py-3.5 text-sm font-black text-[#15121D] shadow-coy transition-all hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Reset Demo Feed"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
