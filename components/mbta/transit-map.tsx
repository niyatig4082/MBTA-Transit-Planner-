"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Plus, Minus, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES, STATIONS, type Station, type TransitMode, type CongestionSegment, MBTA_COLORS } from "@/lib/mbta-data"
import { cn } from "@/lib/utils"

interface TransitMapProps {
  selectedModes: TransitMode[]
  congestionData: CongestionSegment[]
  selectedRoute?: {
    from: Station
    to: Station
    path: [number, number][]
  }
  onStationClick?: (station: Station) => void
  showHeatMap?: boolean
}

export function TransitMap({
  selectedModes,
  congestionData,
  selectedRoute,
  onStationClick,
  showHeatMap = true,
}: TransitMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Map bounds for Boston area
  const bounds = {
    minLat: 42.25,
    maxLat: 42.45,
    minLng: -71.2,
    maxLng: -70.95,
  }

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = useCallback(
    (lat: number, lng: number) => {
      const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * dimensions.width
      const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * dimensions.height
      return {
        x: x * zoom + offset.x,
        y: y * zoom + offset.y,
      }
    },
    [zoom, offset, dimensions, bounds],
  )

  // Get congestion color
  const getCongestionColor = (fromId: string, toId: string) => {
    const segment = congestionData.find((s) => s.fromStation === fromId && s.toStation === toId)
    if (!segment) return null
    switch (segment.level) {
      case "severe":
        return "#EF4444"
      case "moderate":
        return "#F59E0B"
      default:
        return null
    }
  }

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width * 2, dimensions.height * 2)
    ctx.fillStyle = "var(--background)"
    ctx.fillRect(0, 0, dimensions.width * 2, dimensions.height * 2)

    // Draw routes
    const filteredRoutes = ROUTES.filter((route) => {
      if (route.mode === "subway") return selectedModes.includes("subway")
      return selectedModes.includes(route.mode)
    })

    filteredRoutes.forEach((route) => {
      if (route.coordinates.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = route.color
      ctx.lineWidth = route.mode === "subway" ? 4 * zoom : 2 * zoom
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      const start = latLngToCanvas(route.coordinates[0][0], route.coordinates[0][1])
      ctx.moveTo(start.x, start.y)

      for (let i = 1; i < route.coordinates.length; i++) {
        const point = latLngToCanvas(route.coordinates[i][0], route.coordinates[i][1])

        // Check for congestion on this segment
        if (showHeatMap && route.stations[i - 1] && route.stations[i]) {
          const congestionColor = getCongestionColor(route.stations[i - 1], route.stations[i])
          if (congestionColor) {
            ctx.stroke()
            ctx.beginPath()
            ctx.strokeStyle = congestionColor
            ctx.lineWidth = 6 * zoom
            const prevPoint = latLngToCanvas(route.coordinates[i - 1][0], route.coordinates[i - 1][1])
            ctx.moveTo(prevPoint.x, prevPoint.y)
            ctx.lineTo(point.x, point.y)
            ctx.stroke()
            ctx.beginPath()
            ctx.strokeStyle = route.color
            ctx.lineWidth = route.mode === "subway" ? 4 * zoom : 2 * zoom
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        } else {
          ctx.lineTo(point.x, point.y)
        }
      }
      ctx.stroke()
    })

    // Draw selected route highlight
    if (selectedRoute && selectedRoute.path.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 8 * zoom
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.setLineDash([10, 5])

      const start = latLngToCanvas(selectedRoute.path[0][0], selectedRoute.path[0][1])
      ctx.moveTo(start.x, start.y)

      selectedRoute.path.forEach(([lat, lng]) => {
        const point = latLngToCanvas(lat, lng)
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw stations
    const filteredStations = STATIONS.filter((station) => station.modes.some((m) => selectedModes.includes(m)))

    filteredStations.forEach((station) => {
      const pos = latLngToCanvas(station.lat, station.lng)
      const isTransfer = station.lines.length > 1 || station.modes.length > 1
      const radius = isTransfer ? 8 * zoom : 5 * zoom

      // Station circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.strokeStyle =
        station.lines[0] === "red"
          ? MBTA_COLORS.red
          : station.lines[0] === "orange"
            ? MBTA_COLORS.orange
            : station.lines[0] === "blue"
              ? MBTA_COLORS.blue
              : station.lines[0] === "green"
                ? MBTA_COLORS.green
                : station.lines[0]?.includes("commuter")
                  ? MBTA_COLORS.commuter
                  : station.lines[0]?.includes("ferry")
                    ? MBTA_COLORS.ferry
                    : "#6B7280"
      ctx.lineWidth = 2 * zoom
      ctx.stroke()

      // Transfer indicator
      if (isTransfer) {
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius - 3 * zoom, 0, Math.PI * 2)
        ctx.fillStyle = "#3B82F6"
        ctx.fill()
      }

      // Station label (only at higher zoom)
      if (zoom > 0.8) {
        ctx.font = `${10 * zoom}px system-ui`
        ctx.fillStyle = "var(--foreground)"
        ctx.textAlign = "center"
        ctx.fillText(station.name, pos.x, pos.y + radius + 12 * zoom)
      }
    })

    // Highlight hovered station
    if (hoveredStation) {
      const pos = latLngToCanvas(hoveredStation.lat, hoveredStation.lng)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 15 * zoom, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.fill()
    }
  }, [
    zoom,
    offset,
    selectedModes,
    congestionData,
    selectedRoute,
    hoveredStation,
    showHeatMap,
    dimensions,
    latLngToCanvas,
  ])

  // Handle resize
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check for station hover
    const hoveredSt = STATIONS.find((station) => {
      const pos = latLngToCanvas(station.lat, station.lng)
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
      return distance < 15 * zoom
    })
    setHoveredStation(hoveredSt || null)

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredStation && onStationClick) {
      onStationClick(hoveredStation)
    }
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-muted rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={dimensions.width * 2}
        height={dimensions.height * 2}
        style={{ width: dimensions.width, height: dimensions.height }}
        className={cn("cursor-grab", isDragging && "cursor-grabbing")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-lg shadow-lg" onClick={handleZoomIn}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-lg shadow-lg" onClick={handleZoomOut}>
          <Minus className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-lg shadow-lg" onClick={handleReset}>
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Station Tooltip */}
      {hoveredStation && (
        <div
          className="absolute glass px-3 py-2 rounded-lg shadow-lg pointer-events-none text-sm"
          style={{
            left: latLngToCanvas(hoveredStation.lat, hoveredStation.lng).x + 20,
            top: latLngToCanvas(hoveredStation.lat, hoveredStation.lng).y - 10,
          }}
        >
          <div className="font-semibold">{hoveredStation.name}</div>
          <div className="text-xs text-muted-foreground">
            {hoveredStation.lines.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(" · ")}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 glass px-3 py-2 rounded-lg">
        <div className="text-xs font-medium mb-2">Transit Lines</div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: MBTA_COLORS.red }} />
            <span className="text-xs">Red</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: MBTA_COLORS.orange }} />
            <span className="text-xs">Orange</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: MBTA_COLORS.blue }} />
            <span className="text-xs">Blue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: MBTA_COLORS.green }} />
            <span className="text-xs">Green</span>
          </div>
        </div>
        {showHeatMap && (
          <>
            <div className="text-xs font-medium mt-3 mb-2">Congestion</div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Normal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs">Severe</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
