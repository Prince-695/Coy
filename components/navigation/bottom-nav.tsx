"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  matchCount?: number
}

export function BottomNav({ matchCount = 0 }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
      isActive: pathname === "/home",
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass,
      isActive: pathname === "/discover" || pathname === "/",
    },
    {
      label: "Matches",
      href: "/matches",
      icon: Heart,
      isActive: pathname === "/matches",
      badge: matchCount > 0 ? matchCount : null,
    },
  ]

  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-full max-w-[460px] -translate-x-1/2 px-4">
      <div className="flex h-16 items-center justify-around rounded-full border-2 border-[#15121D] bg-white px-3 shadow-coy">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-all select-none",
                active ? "text-[#FF3880]" : "text-[#777381] hover:text-[#15121D]"
              )}
            >
              <div
                className={cn(
                  "relative flex h-9 w-12 items-center justify-center rounded-full transition-all",
                  active && "bg-[#FFE1EC] border border-[#FF3880]/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110 stroke-[2.5px] text-[#FF3880]"
                  )}
                />
                {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border border-[#15121D] bg-[#FF3880] px-1 text-[10px] font-black text-white shadow-coy-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-extrabold tracking-tight",
                  active ? "text-[#15121D]" : "text-[#777381]"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
