"use client"

import { useState } from "react"
import { MapPin, Repeat, Navigation, Clock, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { STATIONS, type Station, type TransitMode } from "@/lib/mbta-data"

interface TripPlannerProps {
  onPlanTrip: (from: Station, to: Station) => void
  selectedModes: TransitMode[]
}

export function TripPlanner({ onPlanTrip, selectedModes }: TripPlannerProps) {
  const [fromQuery, setFromQuery] = useState("")
  const [toQuery, setToQuery] = useState("")
  const [fromStation, setFromStation] = useState<Station | null>(null)
  const [toStation, setToStation] = useState<Station | null>(null)
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  const filteredFromStations = STATIONS.filter(
    (s) => s.name.toLowerCase().includes(fromQuery.toLowerCase()) && s.modes.some((m) => selectedModes.includes(m)),
  ).slice(0, 6)

  const filteredToStations = STATIONS.filter(
    (s) => s.name.toLowerCase().includes(toQuery.toLowerCase()) && s.modes.some((m) => selectedModes.includes(m)),
  ).slice(0, 6)

  const handleSwap = () => {
    const tempStation = fromStation
    const tempQuery = fromQuery
    setFromStation(toStation)
    setFromQuery(toQuery)
    setToStation(tempStation)
    setToQuery(tempQuery)
  }

  const handlePlanTrip = () => {
    if (fromStation && toStation) {
      onPlanTrip(fromStation, toStation)
    }
  }

  const selectFromStation = (station: Station) => {
    setFromStation(station)
    setFromQuery(station.name)
    setShowFromSuggestions(false)
  }

  const selectToStation = (station: Station) => {
    setToStation(station)
    setToQuery(station.name)
    setShowToSuggestions(false)
  }

  return (
    <Card className="glass border-0 shadow-xl">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* From Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
            </div>
            <Input
              type="text"
              placeholder="From: Station or address"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value)
                setFromStation(null)
                setShowFromSuggestions(true)
              }}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
            {showFromSuggestions && filteredFromStations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-20 max-h-48 sm:max-h-64 overflow-auto">
                {filteredFromStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => selectFromStation(station)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-muted flex items-center gap-2 sm:gap-3 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{station.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {station.lines.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" onClick={handleSwap}>
              <Repeat className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* To Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
            </div>
            <Input
              type="text"
              placeholder="To: Station or address"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value)
                setToStation(null)
                setShowToSuggestions(true)
              }}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
            {showToSuggestions && filteredToStations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-20 max-h-48 sm:max-h-64 overflow-auto">
                {filteredToStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => selectToStation(station)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-muted flex items-center gap-2 sm:gap-3 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{station.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {station.lines.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Options - Compact on mobile */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-transparent">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Leave </span>Now
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-transparent">
              <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Set </span>Time
            </Button>
          </div>

          {/* Plan Trip Button */}
          <Button
            onClick={handlePlanTrip}
            disabled={!fromStation || !toStation}
            className="h-10 sm:h-12 text-sm sm:text-base font-semibold bg-[#003DA5] hover:bg-[#002d7a]"
          >
            <Navigation className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Plan My Trip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
