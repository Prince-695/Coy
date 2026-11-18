"use client"

import Link from "next/link"
import { Settings, Sparkles } from "lucide-react"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-2 border-[#1D1B23] bg-white px-5">
      <Link href="/discover" className="group flex items-center gap-0.5 select-none">
        <span className="text-3xl font-black tracking-tighter text-[#1D1B23] transition-transform group-hover:scale-105">
          coy
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF3880] transition-transform group-hover:scale-125" />
      </Link>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border-2 border-[#1D1B23] bg-[#E7DFFF] px-3 py-1 text-xs font-bold text-[#1D1B23] shadow-coy-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#FF3880]" />
          <span>Discover</span>
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1D1B23] bg-white text-[#1D1B23] transition-all hover:bg-[#F5F3F9] active:translate-x-0.5 active:translate-y-0.5 shadow-coy-sm"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
