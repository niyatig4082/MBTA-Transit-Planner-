import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MBTA Transit Planner | Smart Transfer Assistant",
  description:
    "Plan your Boston transit journey with real-time tracking, heat-based congestion routing, and AI-powered trip assistance across all MBTA modes.",
  keywords: ["MBTA", "Boston Transit", "Trip Planner", "Subway", "Commuter Rail", "Bus", "Ferry"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#003DA5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
