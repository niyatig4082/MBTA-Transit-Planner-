"use client"

import { useState } from "react"
import { Clock, ArrowRight, Train, Bus, Ship, Zap, ChevronDown, ChevronUp, AlertTriangle, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TransferOption, ConfidenceLevel, CongestionLevel, TransitMode } from "@/lib/mbta-data"
import { cn } from "@/lib/utils"

interface RouteOptionsProps {
  options: TransferOption[]
  onSelectRoute: (option: TransferOption) => void
  selectedOptionIndex?: number
}

const getModeIcon = (mode: TransitMode) => {
  switch (mode) {
    case "subway":
      return Train
    case "bus":
      return Bus
    case "ferry":
      return Ship
    case "silver":
      return Zap
    default:
      return Train
  }
}

const getConfidenceBadge = (confidence: ConfidenceLevel) => {
  switch (confidence) {
    case "likely":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
          <Check className="h-3 w-3 mr-1" />
          Likely
        </Badge>
      )
    case "risky":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 pulse-warning">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Risky
        </Badge>
      )
    case "unlikely":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
          <X className="h-3 w-3 mr-1" />
          Unlikely
        </Badge>
      )
  }
}

const getCongestionBadge = (level: CongestionLevel) => {
  switch (level) {
    case "normal":
      return <span className="text-xs text-green-600">Normal flow</span>
    case "moderate":
      return <span className="text-xs text-amber-600">Moderate delays</span>
    case "severe":
      return <span className="text-xs text-red-600">Heavy delays</span>
  }
}

export function RouteOptions({ options, onSelectRoute, selectedOptionIndex }: RouteOptionsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  if (options.length === 0) {
    return (
      <Card className="glass border-0">
        <CardContent className="p-4 sm:p-6 text-center text-muted-foreground text-sm sm:text-base">
          Select origin and destination to see route options
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <h3 className="font-semibold text-base sm:text-lg px-1">Route Options</h3>
      {options.map((option, index) => {
        const isExpanded = expandedIndex === index
        const isSelected = selectedOptionIndex === index
        const isBestOption = index === 0

        return (
          <Card
            key={index}
            className={cn(
              "transition-all cursor-pointer hover:shadow-md",
              isSelected && "ring-2 ring-[#003DA5]",
              isBestOption && "border-green-500/50",
            )}
            onClick={() => onSelectRoute(option)}
          >
            <CardContent className="p-3 sm:p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl font-bold">{option.duration} min</div>
                  {getConfidenceBadge(option.confidence)}
                </div>
                {isBestOption && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-[10px] sm:text-xs">
                    Best
                  </Badge>
                )}
              </div>

              {/* Mode Icons and Times */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                {option.modes.map((mode, i) => {
                  const Icon = getModeIcon(mode)
                  return (
                    <div key={i} className="flex items-center gap-1">
                      {i > 0 && <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />}
                      <div
                        className={cn(
                          "p-1 sm:p-1.5 rounded",
                          mode === "subway" && "bg-gray-100 dark:bg-gray-800",
                          mode === "bus" && "bg-[#FFC72C]/10",
                          mode === "ferry" && "bg-[#008EAA]/10",
                          mode === "silver" && "bg-[#7C878E]/10",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                  )
                })}
                <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">
                  {option.departureTime} - {option.arrivalTime}
                </span>
              </div>

              {/* Transfer Info */}
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-1">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span>
                    {option.transfers} transfer{option.transfers !== 1 ? "s" : ""}
                  </span>
                  <span className="text-muted-foreground hidden xs:inline">|</span>
                  <span className="hidden xs:inline">{getCongestionBadge(option.congestionLevel)}</span>
                </div>
                <span className="font-medium">${option.fare.toFixed(2)}</span>
              </div>

              {/* Buffer Time */}
              <div
                className={cn(
                  "mt-2 sm:mt-3 p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm",
                  option.confidence === "likely" && "bg-green-500/10 text-green-700 dark:text-green-400",
                  option.confidence === "risky" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                  option.confidence === "unlikely" && "bg-red-500/10 text-red-700 dark:text-red-400",
                )}
              >
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1.5 sm:mr-2" />
                {option.buffer >= 0 ? `${option.buffer} min buffer` : `${Math.abs(option.buffer)} min short`}
              </div>

              {/* Expand/Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 sm:mt-3 h-8 sm:h-9 text-xs sm:text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedIndex(isExpanded ? null : index)
                }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    Steps
                  </>
                )}
              </Button>

              {/* Expanded Route Steps */}
              {isExpanded && (
                <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                  {option.route.map((step, stepIndex) => {
                    const Icon = getModeIcon(step.mode)
                    return (
                      <div key={stepIndex} className="flex gap-2 sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 sm:p-2 rounded-full bg-secondary">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          {stepIndex < option.route.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                        </div>
                        <div className="flex-1 pb-2 sm:pb-3">
                          <div className="font-medium text-sm sm:text-base">{step.from}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {step.departTime} · {step.line || step.mode}
                          </div>
                          <div className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                            <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-1" />
                            {step.to} ({step.duration} min)
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
