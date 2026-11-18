"use client"

import Link from "next/link"
import { Heart, Compass } from "lucide-react"

export function MatchEmptyState() {
  return (
    <div className="flex h-full min-h-[460px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-[#15121D] bg-[#E7DFFF] p-8 shadow-coy-lg w-full max-w-sm">
        {/* Playful Heart Badge */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#15121D] bg-[#FFE1EC] shadow-coy">
          <Heart className="h-10 w-10 fill-[#FF3880] text-[#FF3880]" />
        </div>

        <h3 className="text-2xl font-black tracking-tight text-[#15121D]">
          No matches yet!
        </h3>

        <p className="mt-2 text-sm font-medium leading-relaxed text-[#777381]">
          When someone you like also likes you back, your mutual match will appear right here. Keep your interest private!
        </p>

        <div className="mt-6 w-full">
          <Link
            href="/discover"
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-[#FF3880] py-3.5 text-sm font-black text-[#15121D] shadow-coy transition-all hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>Start Discovering</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
