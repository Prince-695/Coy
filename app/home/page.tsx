import Link from "next/link"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { UserPlus, EyeOff, Heart, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col p-5 pb-24">
      {/* Coy Feature Card matching Screenshot */}
      <div className="overflow-hidden rounded-3xl border-2 border-[#15121D] bg-white shadow-coy-lg">
        {/* Lavender Dot Matrix Hero */}
        <div className="relative flex h-28 w-full items-center justify-center bg-[#E7DFFF] p-4 coy-dot-pattern">
          {/* Eyes playful graphic */}
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full border-2 border-[#15121D] bg-[#FF3880]" />
            <div className="h-4 w-4 rounded-full border-2 border-[#15121D] bg-[#FF3880]" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-[#15121D] leading-tight">
            Find out if your crush likes you back
          </h1>

          <div className="mt-6 flex flex-col gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#15121D]/10 bg-[#E7DFFF] text-[#15121D]">
                <UserPlus className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-[#15121D]">
                Discover people nearby and swipe your crushes
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#15121D]/10 bg-[#FFE0D0] text-[#15121D]">
                <EyeOff className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-[#15121D]">
                Your interest stays 100% private. We never tell who.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#15121D]/10 bg-[#FFE1EC] text-[#FF3880]">
                <Heart className="h-5 w-5 fill-[#FF3880]" />
              </div>
              <p className="text-sm font-bold text-[#15121D]">
                If they like you back, it&apos;s an instant match!
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/discover"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#15121D] bg-[#FF3880] py-3.5 text-base font-black text-[#15121D] shadow-coy transition-all hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-[#15121D]" />
              <span>Explore Discover Feed</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="mt-6 rounded-2xl border-2 border-[#15121D] bg-[#F5F3F9] p-4 text-center shadow-coy-sm">
        <p className="text-xs font-bold text-[#777381]">
          Privacy First Crush Matching &bull; Demo Mode for Prince
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
