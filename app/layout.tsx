import type { Metadata } from "next"
import "./globals.css"
import { AppHeader } from "@/components/navigation/app-header"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Coy Discover — Discover someone new. Keep your interest private.",
  description: "Coy Discover introduces swipe-based profile discovery while preserving privacy-first crush-matching.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#15121D]">
        {/* Seamless edge-to-edge mobile container without side borders */}
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white relative">
          <AppHeader />
          <main className="flex-1 overflow-x-hidden flex flex-col">
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "1rem",
                border: "2px solid #15121D",
                boxShadow: "3px 4px 0px #15121D",
                fontWeight: "700",
                color: "#15121D",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
