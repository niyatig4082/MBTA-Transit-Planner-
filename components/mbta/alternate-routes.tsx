"use client"

import { Clock, Users, Zap, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Station } from "@/lib/mbta-data"

interface AlternateRoute {
  id: string
  label: string
  color: string
  path: [number, number][]
  duration: number
  congestionLevel: "low" | "moderate" | "high"
  savings: number
  reason: string
}

interface AlternateRoutesProps {
  mainRoute: {
    from: Station
    to: Station
    duration: number
    isCongested: boolean
  }
  alternates: AlternateRoute[]
  onSelectRoute: (route: AlternateRoute) => void
  selectedRouteId?: string
}

export function AlternateRoutes({ mainRoute, alternates, onSelectRoute, selectedRouteId }: AlternateRoutesProps) {
  if (!mainRoute.isCongested || alternates.length === 0) return null

  return (
    <Card className="glass border-amber-500/50">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
          <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
          <span className="leading-tight">Congestion Detected - Alternates Available</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Main Route (Congested) */}
        <div className="p-2 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 sm:w-3 h-0.5 sm:h-1 rounded bg-blue-500" />
              <span className="text-xs sm:text-sm font-medium">Current Route</span>
            </div>
            <Badge variant="destructive" className="text-[10px] sm:text-xs h-5 sm:h-auto">
              Congested
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground truncate max-w-[60%]">
              {mainRoute.from.name} → {mainRoute.to.name}
            </span>
            <span className="font-medium">{mainRoute.duration} min</span>
          </div>
        </div>

        {/* Alternate Routes */}
        {alternates.map((route) => (
          <button
            key={route.id}
            onClick={() => onSelectRoute(route)}
            className={cn(
              "w-full p-2 sm:p-3 rounded-lg border transition-all text-left",
              selectedRouteId === route.id
                ? "ring-2 ring-green-500 bg-green-500/10 border-green-500/20"
                : "bg-secondary/50 hover:bg-secondary active:scale-[0.98]",
            )}
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 sm:w-3 h-0.5 sm:h-1 rounded" style={{ backgroundColor: route.color }} />
                <span className="text-xs sm:text-sm font-medium">{route.label}</span>
              </div>
              {route.savings > 0 && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] sm:text-xs h-5 sm:h-auto">
                  -{route.savings} min
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                <span>{route.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                <span
                  className={cn(
                    route.congestionLevel === "low" && "text-green-600",
                    route.congestionLevel === "moderate" && "text-amber-600",
                    route.congestionLevel === "high" && "text-red-600",
                  )}
                >
                  {route.congestionLevel}
                </span>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 line-clamp-2">{route.reason}</p>
          </button>
        ))}

        {/* Quick Switch Button */}
        <Button className="w-full bg-green-600 hover:bg-green-700 h-9 sm:h-10 text-xs sm:text-sm" size="sm">
          <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          Switch to Fastest Route
        </Button>
      </CardContent>
    </Card>
  )
}
