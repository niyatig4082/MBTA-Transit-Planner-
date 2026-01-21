"use client"

import type React from "react"

import { Train, Bus, Ship, Accessibility, TrainFront, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TransitMode } from "@/lib/mbta-data"

interface ModeSelectorProps {
  selectedModes: TransitMode[]
  onModeToggle: (mode: TransitMode) => void
  variant?: "cards" | "chips"
}

const MODES: {
  mode: TransitMode
  label: string
  shortLabel: string
  icon: React.ElementType
  color: string
  bgColor: string
}[] = [
  {
    mode: "commuter",
    label: "Commuter Rail",
    shortLabel: "Rail",
    icon: TrainFront,
    color: "#80276C",
    bgColor: "bg-[#80276C]/10",
  },
  {
    mode: "subway",
    label: "Subway",
    shortLabel: "Subway",
    icon: Train,
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
  { mode: "bus", label: "Bus", shortLabel: "Bus", icon: Bus, color: "#FFC72C", bgColor: "bg-[#FFC72C]/10" },
  { mode: "ferry", label: "Ferry", shortLabel: "Ferry", icon: Ship, color: "#008EAA", bgColor: "bg-[#008EAA]/10" },
  {
    mode: "ride",
    label: "The RIDE",
    shortLabel: "RIDE",
    icon: Accessibility,
    color: "#52BBD0",
    bgColor: "bg-[#52BBD0]/10",
  },
  {
    mode: "silver",
    label: "Silver Line",
    shortLabel: "Silver",
    icon: Zap,
    color: "#7C878E",
    bgColor: "bg-[#7C878E]/10",
  },
]

export function ModeSelector({ selectedModes, onModeToggle, variant = "cards" }: ModeSelectorProps) {
  if (variant === "chips") {
    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {MODES.map(({ mode, label, shortLabel, icon: Icon, color }) => {
          const isSelected = selectedModes.includes(mode)
          return (
            <button
              key={mode}
              onClick={() => onModeToggle(mode)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all",
                isSelected ? "text-white shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
              style={isSelected ? { backgroundColor: color } : {}}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
      {MODES.map(({ mode, label, shortLabel, icon: Icon, color, bgColor }) => {
        const isSelected = selectedModes.includes(mode)
        return (
          <button
            key={mode}
            onClick={() => onModeToggle(mode)}
            className={cn(
              "group relative flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 p-3 sm:p-4 lg:p-6 rounded-xl transition-all duration-200",
              "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
              isSelected ? "ring-2 shadow-md" : "bg-card border hover:border-transparent",
            )}
            style={
              isSelected
                ? {
                    backgroundColor: `${color}15`,
                    borderColor: color,
                    ringColor: color,
                  }
                : {}
            }
          >
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all",
                isSelected ? "scale-110" : bgColor,
              )}
              style={isSelected ? { backgroundColor: color } : {}}
            >
              <Icon
                className={cn("h-5 w-5 sm:h-6 sm:h-6 lg:h-7 lg:w-7 transition-colors", isSelected ? "text-white" : "")}
                style={!isSelected ? { color } : {}}
              />
            </div>
            <span
              className={cn("text-xs sm:text-sm font-medium text-center leading-tight", isSelected && "font-semibold")}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            {isSelected && (
              <div
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
