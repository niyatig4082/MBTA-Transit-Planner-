"use client"

import { Map, Route, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  activeTab: "map" | "routes" | "planner"
  onTabChange: (tab: "map" | "routes" | "planner") => void
  hasRoutes?: boolean
}

export function MobileNavigation({ activeTab, onTabChange, hasRoutes }: MobileNavigationProps) {
  const tabs = [
    { id: "planner" as const, label: "Plan", icon: Navigation },
    { id: "map" as const, label: "Map", icon: Map },
    { id: "routes" as const, label: "Routes", icon: Route, badge: hasRoutes },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[40] md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-2 pb-safe">
        <div className="flex items-center justify-around w-full h-14 sm:h-16">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-2 sm:px-3 rounded-lg transition-all relative touch-target",
                "active:scale-95",
                activeTab === id
                  ? "text-[#003DA5] bg-[#003DA5]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] sm:text-xs font-medium">{label}</span>
              {badge && (
                <span className="absolute top-1.5 right-[calc(50%-12px)] w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#003DA5] animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
