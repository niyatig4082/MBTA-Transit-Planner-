"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle, Check, X, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { ConfidenceLevel } from "@/lib/mbta-data"

interface ConnectionTimerProps {
  arrivalTime: number // seconds until arrival at transfer station
  departureTime: number // seconds until next connection departs
  walkTime: number // base walk time in seconds
  walkSpeed: "slow" | "normal" | "fast"
  onWalkSpeedChange: (speed: "slow" | "normal" | "fast") => void
}

export function ConnectionTimer({
  arrivalTime,
  departureTime,
  walkTime,
  walkSpeed,
  onWalkSpeedChange,
}: ConnectionTimerProps) {
  const [currentArrival, setCurrentArrival] = useState(arrivalTime)
  const [currentDeparture, setCurrentDeparture] = useState(departureTime)

  // Adjust walk time based on speed
  const adjustedWalkTime = walkSpeed === "slow" ? walkTime * 1.5 : walkSpeed === "fast" ? walkTime * 0.7 : walkTime

  // Calculate buffer
  const bufferSeconds = currentDeparture - currentArrival - adjustedWalkTime
  const bufferMinutes = Math.floor(bufferSeconds / 60)

  // Determine confidence level
  const confidence: ConfidenceLevel = bufferMinutes >= 5 ? "likely" : bufferMinutes >= 1 ? "risky" : "unlikely"

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArrival((prev) => Math.max(0, prev - 1))
      setCurrentDeparture((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Reset when props change
  useEffect(() => {
    setCurrentArrival(arrivalTime)
    setCurrentDeparture(departureTime)
  }, [arrivalTime, departureTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercent = Math.min(100, Math.max(0, ((currentDeparture - adjustedWalkTime) / currentDeparture) * 100))

  return (
    <Card
      className={cn(
        "glass border-0 overflow-hidden transition-all",
        confidence === "likely" && "ring-2 ring-green-500/50",
        confidence === "risky" && "ring-2 ring-amber-500/50",
        confidence === "unlikely" && "ring-2 ring-red-500/50",
      )}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Connection Countdown</span>
            <span className="xs:hidden">Countdown</span>
          </h3>
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium",
              confidence === "likely" && "bg-green-500/10 text-green-600",
              confidence === "risky" && "bg-amber-500/10 text-amber-600 pulse-warning",
              confidence === "unlikely" && "bg-red-500/10 text-red-600",
            )}
          >
            {confidence === "likely" && <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
            {confidence === "risky" && <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />}
            {confidence === "unlikely" && <X className="h-3 w-3 sm:h-4 sm:w-4" />}
            {confidence === "likely" ? "Likely" : confidence === "risky" ? "Risky" : "Unlikely"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(currentArrival)}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">You Arrive</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(Math.floor(adjustedWalkTime))}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Walk Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(currentDeparture)}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Departs</div>
          </div>
        </div>

        <div className="relative h-2 sm:h-3 bg-secondary rounded-full overflow-hidden mb-3 sm:mb-4">
          <div
            className={cn(
              "absolute h-full transition-all duration-1000",
              confidence === "likely" && "bg-green-500",
              confidence === "risky" && "bg-amber-500",
              confidence === "unlikely" && "bg-red-500",
            )}
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute h-full bg-white/30"
            style={{
              left: `${Math.max(0, progressPercent - (adjustedWalkTime / currentDeparture) * 100)}%`,
              width: `${(adjustedWalkTime / currentDeparture) * 100}%`,
            }}
          />
        </div>

        <div
          className={cn(
            "text-center p-2 sm:p-3 rounded-lg mb-3 sm:mb-4",
            confidence === "likely" && "bg-green-500/10",
            confidence === "risky" && "bg-amber-500/10",
            confidence === "unlikely" && "bg-red-500/10",
          )}
        >
          <span className="text-sm sm:text-lg font-bold">
            {bufferMinutes >= 0 ? `+${bufferMinutes} min buffer` : `${bufferMinutes} min short`}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Walk Speed
            </span>
            <span className="font-medium capitalize">{walkSpeed}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs">Slow</span>
            <Slider
              value={[walkSpeed === "slow" ? 0 : walkSpeed === "normal" ? 50 : 100]}
              onValueChange={([value]) => {
                if (value < 33) onWalkSpeedChange("slow")
                else if (value < 66) onWalkSpeedChange("normal")
                else onWalkSpeedChange("fast")
              }}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-[10px] sm:text-xs">Fast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
