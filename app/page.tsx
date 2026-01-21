"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/mbta/header"
import { ModeSelector } from "@/components/mbta/mode-selector"
import { TripPlanner } from "@/components/mbta/trip-planner"
import { LeafletMap } from "@/components/mbta/leaflet-map"
import { RouteOptions } from "@/components/mbta/route-options"
import { ConnectionTimer } from "@/components/mbta/connection-timer"
import { AIAssistant } from "@/components/mbta/ai-assistant"
import { ScenarioSimulator, type Scenario } from "@/components/mbta/scenario-simulator"
import { AlternateRoutes } from "@/components/mbta/alternate-routes"
import { MobileNavigation } from "@/components/mbta/mobile-navigation"
import { NearbyFood } from "@/components/mbta/nearby-food"
import { TicketsPasses } from "@/components/mbta/tickets-passes"
import {
  type TransitMode,
  type Station,
  type TransferOption,
  type CongestionSegment,
  type TrainPosition,
  generateMockCongestion,
  generateMockTrainPositions,
  generateAlternateRoutes,
  calculateConfidence,
  ROUTES,
  getFoodNearStation,
} from "@/lib/mbta-data"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function MBTATransitApp() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedModes, setSelectedModes] = useState<TransitMode[]>([
    "subway",
    "commuter",
    "bus",
    "ferry",
    "silver",
    "ride",
  ])
  const [congestionData, setCongestionData] = useState<CongestionSegment[]>([])
  const [trainPositions, setTrainPositions] = useState<TrainPosition[]>([])
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<
    | {
        from: Station
        to: Station
        path: [number, number][]
        alternates?: { path: [number, number][]; color: string; label: string }[]
      }
    | undefined
  >()
  const [routeOptions, setRouteOptions] = useState<TransferOption[]>([])
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | undefined>()
  const [walkSpeed, setWalkSpeed] = useState<"slow" | "normal" | "fast">("normal")
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [selectedAlternateId, setSelectedAlternateId] = useState<string | undefined>()
  const [showScenarioSimulator, setShowScenarioSimulator] = useState(false)

  const [activeTab, setActiveTab] = useState<"map" | "routes" | "planner">("planner")
  const [showMobileRouteSheet, setShowMobileRouteSheet] = useState(false)

  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [showTickets, setShowTickets] = useState(false)

  const alerts = [
    { id: "1", message: "Red Line: Minor delays at Downtown Crossing due to signal issues", type: "warning" as const },
    { id: "2", message: "Commuter Rail: On-time performance 94% today", type: "info" as const },
  ]

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    const updateCongestion = () => {
      setCongestionData(generateMockCongestion())
    }
    updateCongestion()
    const interval = setInterval(updateCongestion, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateTrains = () => {
      setTrainPositions(generateMockTrainPositions())
    }
    updateTrains()
    const interval = setInterval(updateTrains, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleModeToggle = (mode: TransitMode) => {
    setSelectedModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]))
  }

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station)
  }, [])

  const handlePlanTrip = useCallback(
    (from: Station, to: Station) => {
      const fromRoute = ROUTES.find((r) => r.stations.includes(from.id))
      const toRoute = ROUTES.find((r) => r.stations.includes(to.id))

      let path: [number, number][] = []

      if (fromRoute && fromRoute === toRoute) {
        const fromIndex = fromRoute.stations.indexOf(from.id)
        const toIndex = fromRoute.stations.indexOf(to.id)
        const start = Math.min(fromIndex, toIndex)
        const end = Math.max(fromIndex, toIndex)
        path = fromRoute.coordinates.slice(start, end + 1)
      } else {
        path = [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ]
      }

      const alternates = generateAlternateRoutes(from, to, congestionData)

      setSelectedRoute({
        from,
        to,
        path,
        alternates: alternates.map((a) => ({ path: a.path, color: a.color, label: a.label })),
      })

      const baseTime = Math.floor(Math.random() * 15) + 10
      const options: TransferOption[] = [
        {
          departureTime: "2:15 PM",
          arrivalTime: "2:35 PM",
          duration: baseTime,
          transfers: 1,
          confidence: calculateConfidence(7),
          buffer: 7,
          modes: ["subway"],
          route: [
            {
              mode: "subway",
              line: "Red Line",
              from: from.name,
              to: "Park Street",
              departTime: "2:15 PM",
              arriveTime: "2:25 PM",
              duration: 10,
              direction: "Inbound",
            },
            {
              mode: "subway",
              line: "Green Line",
              from: "Park Street",
              to: to.name,
              departTime: "2:27 PM",
              arriveTime: "2:35 PM",
              duration: 8,
              direction: "Outbound",
            },
          ],
          congestionLevel: "normal",
          fare: 2.4,
        },
        {
          departureTime: "2:18 PM",
          arrivalTime: "2:42 PM",
          duration: baseTime + 6,
          transfers: 0,
          confidence: calculateConfidence(3),
          buffer: 3,
          modes: ["subway"],
          route: [
            {
              mode: "subway",
              line: "Orange Line",
              from: from.name,
              to: to.name,
              departTime: "2:18 PM",
              arriveTime: "2:42 PM",
              duration: 24,
              direction: "Southbound",
            },
          ],
          congestionLevel: "moderate",
          fare: 2.4,
        },
        {
          departureTime: "2:20 PM",
          arrivalTime: "2:50 PM",
          duration: baseTime + 10,
          transfers: 1,
          confidence: calculateConfidence(0),
          buffer: 0,
          modes: ["bus", "subway"],
          route: [
            {
              mode: "bus",
              line: "Bus 66",
              from: from.name,
              to: "Harvard",
              departTime: "2:20 PM",
              arriveTime: "2:35 PM",
              duration: 15,
              direction: "Outbound",
            },
            {
              mode: "subway",
              line: "Red Line",
              from: "Harvard",
              to: to.name,
              departTime: "2:38 PM",
              arriveTime: "2:50 PM",
              duration: 12,
              direction: "Inbound",
            },
          ],
          congestionLevel: "severe",
          fare: 2.4,
        },
      ]

      setRouteOptions(options)
      setSelectedOptionIndex(0)

      setSelectedStation(to)

      setActiveTab("map")
      setShowMobileRouteSheet(true)
    },
    [congestionData],
  )

  const handleScenarioChange = (newScenario: Scenario) => {
    setScenario(newScenario)
    const baseCongestion = generateMockCongestion()
    const modifiedCongestion = baseCongestion.map((segment) => {
      let additionalDelay = 0
      if (segment.fromStation.includes("red") || segment.toStation.includes("red")) {
        additionalDelay = newScenario.redLineDelay
      }
      const crowdingMultiplier =
        newScenario.crowdingLevel === "heavy" ? 1.5 : newScenario.crowdingLevel === "light" ? 0.5 : 1
      return {
        ...segment,
        delay: Math.round((segment.delay + additionalDelay) * crowdingMultiplier),
      }
    })
    setCongestionData(modifiedCongestion)
  }

  const isMainRouteCongested = congestionData.some((s) => s.level === "severe")
  const alternateRoutes = selectedRoute
    ? generateAlternateRoutes(selectedRoute.from, selectedRoute.to, congestionData).map((a, i) => ({
        ...a,
        id: `alt-${i}`,
      }))
    : []

  const currentTransfers = selectedOptionIndex !== undefined ? routeOptions[selectedOptionIndex]?.transfers || 0 : 0

  return (
    <div className={cn("min-h-screen bg-background transition-colors", darkMode && "dark")}>
      <Header
        alerts={alerts}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSearch={(query) => console.log("Search:", query)}
        onOpenTickets={() => setShowTickets(true)}
      />

      <main className="pt-16 sm:pt-20 pb-20 md:pb-8">
        {/* Hero Section with Mode Selector */}
        <section className="px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 text-balance">
              Plan Your MBTA Journey
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-lg max-w-2xl mx-auto">
              Real-time transit planning with smart transfer timing
            </p>
          </div>

          <ModeSelector selectedModes={selectedModes} onModeToggle={handleModeToggle} />
        </section>

        {/* Main Content */}
        <section className="px-3 sm:px-4 pb-4 sm:pb-8 max-w-7xl mx-auto">
          {/* Desktop/Tablet Layout */}
          <div className="hidden md:flex md:flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Panel: Trip Planner and Route Options */}
            <div className="md:w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 space-y-4">
              <TripPlanner onPlanTrip={handlePlanTrip} selectedModes={selectedModes} />

              <ScenarioSimulator
                onScenarioChange={handleScenarioChange}
                isOpen={showScenarioSimulator}
                onOpenChange={setShowScenarioSimulator}
              />

              {selectedRoute && isMainRouteCongested && (
                <AlternateRoutes
                  mainRoute={{
                    from: selectedRoute.from,
                    to: selectedRoute.to,
                    duration: routeOptions[0]?.duration || 20,
                    isCongested: true,
                  }}
                  alternates={alternateRoutes}
                  onSelectRoute={(route) => setSelectedAlternateId(route.id)}
                  selectedRouteId={selectedAlternateId}
                />
              )}

              {routeOptions.length > 0 && (
                <>
                  <RouteOptions
                    options={routeOptions}
                    onSelectRoute={(option) => {
                      setSelectedOptionIndex(routeOptions.indexOf(option))
                    }}
                    selectedOptionIndex={selectedOptionIndex}
                  />

                  {selectedOptionIndex !== undefined && routeOptions[selectedOptionIndex].transfers > 0 && (
                    <ConnectionTimer
                      arrivalTime={180}
                      departureTime={300}
                      walkTime={120}
                      walkSpeed={walkSpeed}
                      onWalkSpeedChange={setWalkSpeed}
                    />
                  )}
                </>
              )}
            </div>

            {/* Right Panel: Map and Food */}
            <div className="flex-1 space-y-4">
              {/* Map - Fixed height container */}
              <div className="md:h-[450px] lg:h-[500px] xl:h-[550px] rounded-xl overflow-hidden border border-border">
                <LeafletMap
                  selectedModes={selectedModes}
                  congestionData={congestionData}
                  selectedRoute={selectedRoute}
                  showHeatMap={true}
                  trainPositions={trainPositions}
                  onStationClick={handleStationClick}
                />
              </div>

              {selectedStation && (
                <NearbyFood
                  station={selectedStation}
                  foodPlaces={getFoodNearStation(selectedStation.id)}
                  onClose={() => setSelectedStation(null)}
                />
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {activeTab === "planner" && (
              <div className="space-y-4">
                <TripPlanner onPlanTrip={handlePlanTrip} selectedModes={selectedModes} />
                <ScenarioSimulator
                  onScenarioChange={handleScenarioChange}
                  isOpen={showScenarioSimulator}
                  onOpenChange={setShowScenarioSimulator}
                />
              </div>
            )}

            {activeTab === "map" && (
              <div className="space-y-4">
                <div className="relative h-[calc(100vh-280px)] min-h-[300px] max-h-[450px] rounded-xl overflow-hidden border border-border">
                  <LeafletMap
                    selectedModes={selectedModes}
                    congestionData={congestionData}
                    selectedRoute={selectedRoute}
                    showHeatMap={true}
                    trainPositions={trainPositions}
                    onStationClick={handleStationClick}
                  />
                </div>
                {selectedStation && (
                  <NearbyFood
                    station={selectedStation}
                    foodPlaces={getFoodNearStation(selectedStation.id)}
                    onClose={() => setSelectedStation(null)}
                  />
                )}
              </div>
            )}

            {activeTab === "routes" && (
              <div className="space-y-4">
                {selectedRoute && isMainRouteCongested && (
                  <AlternateRoutes
                    mainRoute={{
                      from: selectedRoute.from,
                      to: selectedRoute.to,
                      duration: routeOptions[0]?.duration || 20,
                      isCongested: true,
                    }}
                    alternates={alternateRoutes}
                    onSelectRoute={(route) => setSelectedAlternateId(route.id)}
                    selectedRouteId={selectedAlternateId}
                  />
                )}

                {routeOptions.length > 0 ? (
                  <>
                    <RouteOptions
                      options={routeOptions}
                      onSelectRoute={(option) => {
                        setSelectedOptionIndex(routeOptions.indexOf(option))
                      }}
                      selectedOptionIndex={selectedOptionIndex}
                    />

                    {selectedOptionIndex !== undefined && routeOptions[selectedOptionIndex].transfers > 0 && (
                      <ConnectionTimer
                        arrivalTime={180}
                        departureTime={300}
                        walkTime={120}
                        walkSpeed={walkSpeed}
                        onWalkSpeedChange={setWalkSpeed}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">Plan a trip to see route options</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Mobile Route Sheet */}
        <Sheet open={showMobileRouteSheet} onOpenChange={setShowMobileRouteSheet}>
          <SheetContent side="bottom" className="h-[55vh] md:hidden rounded-t-2xl">
            <SheetHeader className="pb-3">
              <SheetTitle>
                {selectedRoute ? (
                  <span className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="truncate max-w-[100px]">{selectedRoute.from.name}</span>
                    <span className="text-muted-foreground mx-1">→</span>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="truncate max-w-[100px]">{selectedRoute.to.name}</span>
                  </span>
                ) : (
                  "Route Options"
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100%-50px)] space-y-3 pb-4">
              {routeOptions.length > 0 && (
                <>
                  <RouteOptions
                    options={routeOptions}
                    onSelectRoute={(option) => {
                      setSelectedOptionIndex(routeOptions.indexOf(option))
                    }}
                    selectedOptionIndex={selectedOptionIndex}
                  />

                  {selectedOptionIndex !== undefined && routeOptions[selectedOptionIndex].transfers > 0 && (
                    <ConnectionTimer
                      arrivalTime={180}
                      departureTime={300}
                      walkTime={120}
                      walkSpeed={walkSpeed}
                      onWalkSpeedChange={setWalkSpeed}
                    />
                  )}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </main>

      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} hasRoutes={routeOptions.length > 0} />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onToggle={() => setShowAIAssistant(!showAIAssistant)}
        context={{
          origin: selectedRoute?.from.name,
          destination: selectedRoute?.to.name,
        }}
      />

      <TicketsPasses isOpen={showTickets} onClose={() => setShowTickets(false)} currentTransfers={currentTransfers} />
    </div>
  )
}
