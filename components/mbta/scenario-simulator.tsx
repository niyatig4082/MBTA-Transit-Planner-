"use client"

import { useState, useEffect } from "react"
import { Sliders, Clock, AlertTriangle, Cloud, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ScenarioSimulatorProps {
  onScenarioChange: (scenario: Scenario) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface Scenario {
  timeShift: number
  redLineDelay: number
  orangeLineDelay: number
  blueLineDelay: number
  greenLineDelay: number
  crowdingLevel: "light" | "normal" | "heavy"
  weatherImpact: boolean
}

const DEFAULT_SCENARIO: Scenario = {
  timeShift: 0,
  redLineDelay: 0,
  orangeLineDelay: 0,
  blueLineDelay: 0,
  greenLineDelay: 0,
  crowdingLevel: "normal",
  weatherImpact: false,
}

export function ScenarioSimulator({ onScenarioChange, isOpen: controlledOpen, onOpenChange }: ScenarioSimulatorProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO)

  // Support both controlled and uncontrolled modes
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const handleChange = <K extends keyof Scenario>(key: K, value: Scenario[K]) => {
    const newScenario = { ...scenario, [key]: value }
    setScenario(newScenario)
    onScenarioChange(newScenario)
  }

  const handleReset = () => {
    setScenario(DEFAULT_SCENARIO)
    onScenarioChange(DEFAULT_SCENARIO)
  }

  const hasChanges = JSON.stringify(scenario) !== JSON.stringify(DEFAULT_SCENARIO)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 sm:gap-2 bg-transparent h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
        onClick={() => setIsOpen(true)}
      >
        <Sliders className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">What-If </span>Scenarios
        {hasChanges && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 ml-1" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Modal Content - centered on all devices */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div
              className={cn(
                "relative w-full max-w-md bg-background rounded-2xl shadow-2xl",
                "max-h-[85vh] sm:max-h-[80vh] overflow-hidden",
                "animate-in fade-in-0 zoom-in-95 duration-200",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-background border-b px-4 sm:px-6 py-4 flex items-center justify-between z-10">
                <h2 className="flex items-center gap-2 font-semibold text-base sm:text-lg">
                  <Sliders className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  What-If Scenarios
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-140px)] sm:max-h-[calc(80vh-140px)] px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
                {/* Time Shift */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Departure Time Shift
                    </Label>
                    <span className="text-sm font-semibold tabular-nums">
                      {scenario.timeShift > 0 ? `+${scenario.timeShift}` : scenario.timeShift} min
                    </span>
                  </div>
                  <Slider
                    value={[scenario.timeShift]}
                    onValueChange={([value]) => handleChange("timeShift", value)}
                    min={-30}
                    max={30}
                    step={5}
                    className="touch-pan-y"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30 min earlier</span>
                    <span>30 min later</span>
                  </div>
                </div>

                {/* Line Delays */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    Simulate Line Delays
                  </Label>

                  {[
                    { key: "redLineDelay" as const, label: "Red Line", color: "#DA291C" },
                    { key: "orangeLineDelay" as const, label: "Orange Line", color: "#ED8B00" },
                    { key: "blueLineDelay" as const, label: "Blue Line", color: "#003DA5" },
                    { key: "greenLineDelay" as const, label: "Green Line", color: "#00843D" },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-sm">{label}</span>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {scenario[key] > 0 ? `+${scenario[key]} min` : "No delay"}
                        </span>
                      </div>
                      <Slider
                        value={[scenario[key]]}
                        onValueChange={([value]) => handleChange(key, value)}
                        min={0}
                        max={30}
                        step={1}
                        className="touch-pan-y"
                      />
                    </div>
                  ))}
                </div>

                {/* Crowding Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Crowding Level</Label>
                  <Select
                    value={scenario.crowdingLevel}
                    onValueChange={(value: "light" | "normal" | "heavy") => handleChange("crowdingLevel", value)}
                  >
                    <SelectTrigger className="h-11 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light" className="text-sm py-3">
                        Light (Weekend/Off-peak)
                      </SelectItem>
                      <SelectItem value="normal" className="text-sm py-3">
                        Normal
                      </SelectItem>
                      <SelectItem value="heavy" className="text-sm py-3">
                        Heavy (Rush Hour)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weather Impact */}
                <div className="flex items-center justify-between py-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    Weather Impact (Ferry delays)
                  </Label>
                  <Switch
                    checked={scenario.weatherImpact}
                    onCheckedChange={(checked) => handleChange("weatherImpact", checked)}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-background border-t px-4 sm:px-6 py-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-11 text-sm bg-transparent"
                  onClick={handleReset}
                  disabled={!hasChanges}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button className="flex-1 h-11 text-sm" onClick={() => setIsOpen(false)}>
                  Apply & Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
