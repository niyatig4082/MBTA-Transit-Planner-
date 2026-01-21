"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Layers, Navigation, Maximize2, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  ROUTES,
  STATIONS,
  type Station,
  type TransitMode,
  type CongestionSegment,
  MBTA_COLORS,
  type TrainPosition,
} from "@/lib/mbta-data"

interface LeafletMapProps {
  selectedModes: TransitMode[]
  congestionData: CongestionSegment[]
  selectedRoute?: {
    from: Station
    to: Station
    path: [number, number][]
    alternates?: { path: [number, number][]; color: string; label: string }[]
  }
  onStationClick?: (station: Station) => void
  showHeatMap?: boolean
  trainPositions?: TrainPosition[]
}

export function LeafletMap({
  selectedModes,
  congestionData,
  selectedRoute,
  onStationClick,
  showHeatMap = true,
  trainPositions = [],
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const routesRef = useRef<L.LayerGroup | null>(null)
  const trainsRef = useRef<L.LayerGroup | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCongestion, setShowCongestion] = useState(showHeatMap)
  const [showTrains, setShowTrains] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [L, setL] = useState<typeof import("leaflet") | null>(null)

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet")
      await import("leaflet/dist/leaflet.css")
      setL(leaflet.default)
    }
    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return

    // Boston center coordinates
    const bostonCenter: [number, number] = [42.36, -71.06]

    const map = L.map(mapRef.current, {
      center: bostonCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    })

    // Add tile layer (OpenStreetMap with custom styling)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map)

    // Create layer groups
    markersRef.current = L.layerGroup().addTo(map)
    routesRef.current = L.layerGroup().addTo(map)
    trainsRef.current = L.layerGroup().addTo(map)

    mapInstanceRef.current = map
    setIsLoaded(true)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [L])

  // Draw routes
  const drawRoutes = useCallback(() => {
    if (!L || !routesRef.current || !mapInstanceRef.current) return

    routesRef.current.clearLayers()

    const filteredRoutes = ROUTES.filter((route) => {
      if (route.mode === "subway") return selectedModes.includes("subway")
      return selectedModes.includes(route.mode)
    })

    filteredRoutes.forEach((route) => {
      if (route.coordinates.length < 2) return

      // Draw route segments with congestion coloring
      for (let i = 0; i < route.coordinates.length - 1; i++) {
        const segment = congestionData.find(
          (s) => s.fromStation === route.stations[i] && s.toStation === route.stations[i + 1],
        )

        let color = route.color
        let weight = route.mode === "subway" ? 5 : 3
        const opacity = 1

        if (showCongestion && segment) {
          if (segment.level === "severe") {
            color = "#EF4444"
            weight = 8
          } else if (segment.level === "moderate") {
            color = "#F59E0B"
            weight = 6
          }
        }

        const polyline = L.polyline(
          [route.coordinates[i] as [number, number], route.coordinates[i + 1] as [number, number]],
          {
            color,
            weight,
            opacity,
            lineCap: "round",
            lineJoin: "round",
          },
        )
        polyline.addTo(routesRef.current!)
      }
    })

    // Draw selected route highlight
    if (selectedRoute && selectedRoute.path.length > 1) {
      const mainPath = L.polyline(selectedRoute.path, {
        color: "#3B82F6",
        weight: 8,
        opacity: 0.8,
        dashArray: "10, 5",
        lineCap: "round",
      })
      mainPath.addTo(routesRef.current)

      // Draw alternate routes
      selectedRoute.alternates?.forEach((alt) => {
        const altPath = L.polyline(alt.path, {
          color: alt.color,
          weight: 6,
          opacity: 0.6,
          dashArray: "5, 10",
          lineCap: "round",
        })
        altPath.addTo(routesRef.current!)
      })
    }
  }, [L, selectedModes, congestionData, selectedRoute, showCongestion])

  // Draw stations
  const drawStations = useCallback(() => {
    if (!L || !markersRef.current || !mapInstanceRef.current) return

    markersRef.current.clearLayers()

    const filteredStations = STATIONS.filter((station) => station.modes.some((m) => selectedModes.includes(m)))

    filteredStations.forEach((station) => {
      const isTransfer = station.lines.length > 1 || station.modes.length > 1
      const isSelected = selectedRoute?.from.id === station.id || selectedRoute?.to.id === station.id

      // Get primary line color
      const primaryLine = station.lines[0]
      const markerColor =
        primaryLine === "red"
          ? MBTA_COLORS.red
          : primaryLine === "orange"
            ? MBTA_COLORS.orange
            : primaryLine === "blue"
              ? MBTA_COLORS.blue
              : primaryLine === "green"
                ? MBTA_COLORS.green
                : primaryLine?.includes("commuter")
                  ? MBTA_COLORS.commuter
                  : primaryLine?.includes("ferry")
                    ? MBTA_COLORS.ferry
                    : "#6B7280"

      // Create custom icon
      const iconSize = isTransfer ? 16 : 12
      const icon = L.divIcon({
        className: "custom-station-marker",
        html: `
          <div style="
            width: ${iconSize}px;
            height: ${iconSize}px;
            border-radius: 50%;
            background: white;
            border: 3px solid ${markerColor};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ${isTransfer ? `background: ${isSelected ? "#3B82F6" : "#3B82F6"};` : ""}
            ${isSelected ? "transform: scale(1.5); border-color: #3B82F6;" : ""}
          "></div>
        `,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
      })

      const marker = L.marker([station.lat, station.lng], { icon })

      // Add popup
      const popupContent = `
        <div style="min-width: 150px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${station.name}</h3>
          <p style="color: #666; font-size: 12px; margin: 0;">
            ${station.lines.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(" · ")}
          </p>
          ${station.accessible ? '<span style="color: #10B981; font-size: 11px;">♿ Accessible</span>' : ""}
          ${isTransfer ? '<br><span style="color: #3B82F6; font-size: 11px;">🔄 Transfer Station</span>' : ""}
        </div>
      `
      marker.bindPopup(popupContent, { closeButton: false })

      marker.on("click", () => {
        onStationClick?.(station)
      })

      // Add label if enabled
      if (showLabels && mapInstanceRef.current!.getZoom() > 12) {
        const label = L.tooltip({
          permanent: true,
          direction: "bottom",
          className: "station-label",
          offset: [0, 10],
        })
        label.setContent(station.name)
        marker.bindTooltip(label)
      }

      marker.addTo(markersRef.current!)
    })
  }, [L, selectedModes, selectedRoute, onStationClick, showLabels])

  // Draw train positions
  const drawTrains = useCallback(() => {
    if (!L || !trainsRef.current || !showTrains) return

    trainsRef.current.clearLayers()

    trainPositions.forEach((train) => {
      const lineColor =
        train.line === "red"
          ? MBTA_COLORS.red
          : train.line === "orange"
            ? MBTA_COLORS.orange
            : train.line === "blue"
              ? MBTA_COLORS.blue
              : train.line === "green"
                ? MBTA_COLORS.green
                : "#6B7280"

      const icon = L.divIcon({
        className: "train-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${lineColor};
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            animation: pulse 2s infinite;
          ">
            🚇
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([train.lat, train.lng], { icon })
      marker.bindPopup(`
        <div>
          <strong>${train.line.charAt(0).toUpperCase() + train.line.slice(1)} Line</strong><br>
          ${train.direction}<br>
          Next: ${train.nextStation} (${train.arrivalTime} min)
        </div>
      `)
      marker.addTo(trainsRef.current!)
    })
  }, [L, trainPositions, showTrains])

  // Update map on changes
  useEffect(() => {
    if (isLoaded) {
      drawRoutes()
      drawStations()
      drawTrains()
    }
  }, [isLoaded, drawRoutes, drawStations, drawTrains])

  // Handle zoom changes for labels
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    const handleZoom = () => {
      drawStations()
    }

    map.on("zoomend", handleZoom)
    return () => {
      map.off("zoomend", handleZoom)
    }
  }, [drawStations])

  // Center on selected route
  const centerOnRoute = useCallback(() => {
    if (!mapInstanceRef.current || !selectedRoute) return

    const bounds = L?.latLngBounds(selectedRoute.path)
    if (bounds) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [L, selectedRoute])

  // Reset view
  const resetView = useCallback(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView([42.36, -71.06], 13)
  }, [])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden isolate">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full bg-muted z-0" />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs sm:text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 z-20">
        {/* Layer Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shadow-md">
              <Layers className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs">Map Layers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showCongestion} onCheckedChange={setShowCongestion} className="text-sm">
              <Thermometer className="h-3.5 w-3.5 mr-2" />
              Heat Map
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showTrains} onCheckedChange={setShowTrains} className="text-sm">
              <span className="mr-2 text-xs">🚇</span>
              Live Trains
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showLabels} onCheckedChange={setShowLabels} className="text-sm">
              <span className="mr-2 text-xs">Aa</span>
              Labels
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Center on Route */}
        {selectedRoute && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shadow-md"
            onClick={centerOnRoute}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        )}

        {/* Reset View */}
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shadow-md"
          onClick={resetView}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 glass px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg z-20 max-w-[160px] sm:max-w-[200px]">
        <div className="text-[9px] sm:text-[10px] font-medium mb-1">Transit Lines</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {[
            { color: MBTA_COLORS.red, label: "Red" },
            { color: MBTA_COLORS.orange, label: "Orange" },
            { color: MBTA_COLORS.blue, label: "Blue" },
            { color: MBTA_COLORS.green, label: "Green" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-3 h-0.5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[9px] sm:text-[10px]">{label}</span>
            </div>
          ))}
        </div>

        {showCongestion && (
          <>
            <div className="text-[9px] sm:text-[10px] font-medium mt-1.5 mb-0.5">Congestion</div>
            <div className="flex gap-2">
              {[
                { color: "bg-green-500", label: "OK" },
                { color: "bg-amber-500", label: "Med" },
                { color: "bg-red-500", label: "High" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-0.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[9px]">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Selected Route Info */}
      {selectedRoute && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 glass px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg z-20 hidden sm:block max-w-[220px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{selectedRoute.from.name}</span>
            </div>
            <span className="text-muted-foreground text-xs flex-shrink-0">→</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{selectedRoute.to.name}</span>
            </div>
          </div>
          {selectedRoute.alternates && selectedRoute.alternates.length > 0 && (
            <div className="mt-1 text-[10px] text-muted-foreground">
              {selectedRoute.alternates.length} alternate route(s)
            </div>
          )}
        </div>
      )}

      {/* CSS for markers */}
      <style jsx global>{`
        .custom-station-marker {
          background: transparent !important;
          border: none !important;
        }
        .train-marker {
          background: transparent !important;
          border: none !important;
        }
        .station-label {
          background: rgba(255, 255, 255, 0.95) !important;
          border: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          padding: 2px 5px !important;
          font-size: 9px !important;
          font-weight: 500 !important;
          border-radius: 3px !important;
        }
        .station-label::before {
          display: none !important;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
          font-size: 12px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-control-zoom a {
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        @media (max-width: 640px) {
          .leaflet-control-zoom a {
            width: 28px !important;
            height: 28px !important;
            line-height: 28px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  )
}
