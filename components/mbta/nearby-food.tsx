"use client"

import { Coffee, UtensilsCrossed, Store, MapPin, Clock, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { FoodPlace, Station } from "@/lib/mbta-data"

interface NearbyFoodProps {
  station: Station
  foodPlaces: FoodPlace[]
  onClose?: () => void
}

const getCategoryIcon = (category: FoodPlace["category"]) => {
  switch (category) {
    case "coffee":
      return Coffee
    case "fast-food":
      return UtensilsCrossed
    case "restaurant":
      return UtensilsCrossed
    case "convenience":
      return Store
  }
}

const getCategoryColor = (category: FoodPlace["category"]) => {
  switch (category) {
    case "coffee":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    case "fast-food":
      return "bg-red-500/10 text-red-600 border-red-500/20"
    case "restaurant":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "convenience":
      return "bg-green-500/10 text-green-600 border-green-500/20"
  }
}

const getCategoryLabel = (category: FoodPlace["category"]) => {
  switch (category) {
    case "coffee":
      return "Coffee"
    case "fast-food":
      return "Fast Food"
    case "restaurant":
      return "Restaurant"
    case "convenience":
      return "Store"
  }
}

export function NearbyFood({ station, foodPlaces, onClose }: NearbyFoodProps) {
  if (foodPlaces.length === 0) return null

  return (
    <Card className="glass border-0">
      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-[#003DA5]" />
            Food Near {station.name}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        {/* Horizontal scrollable on mobile, grid on larger screens */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {foodPlaces.map((place) => {
                const Icon = getCategoryIcon(place.category)
                return (
                  <Card
                    key={place.id}
                    className={cn(
                      "flex-shrink-0 w-[160px] sm:w-[180px] transition-all hover:shadow-md",
                      !place.isOpen && "opacity-60",
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("p-1.5 rounded-lg", getCategoryColor(place.category))}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            place.isOpen
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20",
                          )}
                        >
                          {place.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm truncate">{place.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{getCategoryLabel(place.category)}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{place.walkTime} min walk</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="truncate">{place.openHours}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Grid layout for tablet and desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {foodPlaces.map((place) => {
            const Icon = getCategoryIcon(place.category)
            return (
              <Card
                key={place.id}
                className={cn("transition-all hover:shadow-md cursor-pointer", !place.isOpen && "opacity-60")}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn("p-1.5 rounded-lg", getCategoryColor(place.category))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        place.isOpen
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20",
                      )}
                    >
                      {place.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm truncate">{place.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{getCategoryLabel(place.category)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{place.walkTime} min walk</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span className="truncate">{place.openHours}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
