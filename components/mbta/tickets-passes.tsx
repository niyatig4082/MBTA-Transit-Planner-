"use client"

import { useState } from "react"
import { Ticket, Check, Star, Clock, CreditCard, X, ChevronRight, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TICKET_TYPES, type TicketType } from "@/lib/mbta-data"

interface TicketsPassesProps {
  isOpen: boolean
  onClose: () => void
  recommendedTicketId?: string
  currentTransfers?: number
}

type TicketStatus = "none" | "selected" | "active"

export function TicketsPasses({ isOpen, onClose, recommendedTicketId, currentTransfers = 0 }: TicketsPassesProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("none")

  if (!isOpen) return null

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicket(ticketId)
    setTicketStatus("selected")
  }

  const handleActivateTicket = () => {
    setTicketStatus("active")
  }

  const getStatusBadge = (ticket: TicketType) => {
    if (selectedTicket === ticket.id) {
      if (ticketStatus === "active") {
        return (
          <Badge className="bg-green-500 text-white">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      }
      return (
        <Badge className="bg-[#003DA5] text-white">
          <Check className="h-3 w-3 mr-1" />
          Selected
        </Badge>
      )
    }
    return null
  }

  // Determine recommended ticket based on transfers
  const effectiveRecommendedId = recommendedTicketId || (currentTransfers >= 2 ? "day-pass" : "single-subway")

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-background rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#003DA5]/10">
              <Ticket className="h-5 w-5 text-[#003DA5]" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Tickets & Passes</h2>
              <p className="text-xs text-muted-foreground">MBTA Fare Options</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {/* Recommended Ticket Banner */}
          {effectiveRecommendedId && (
            <Card className="bg-gradient-to-r from-[#003DA5]/10 to-[#003DA5]/5 border-[#003DA5]/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[#003DA5]/10">
                    <Star className="h-4 w-4 text-[#003DA5]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base">Recommended for Your Trip</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Based on {currentTransfers} transfer{currentTransfers !== 1 ? "s" : ""} in your route
                    </p>
                    {TICKET_TYPES.find((t) => t.id === effectiveRecommendedId) && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-[#003DA5]">
                          {TICKET_TYPES.find((t) => t.id === effectiveRecommendedId)?.name}
                        </span>
                        <span className="font-bold">
                          ${TICKET_TYPES.find((t) => t.id === effectiveRecommendedId)?.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ticket Status */}
          {selectedTicket && (
            <Card
              className={cn(
                "border-2 transition-colors",
                ticketStatus === "active" ? "border-green-500 bg-green-500/5" : "border-[#003DA5] bg-[#003DA5]/5",
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        ticketStatus === "active" ? "bg-green-500/10" : "bg-[#003DA5]/10",
                      )}
                    >
                      {ticketStatus === "active" ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-[#003DA5]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">
                        {TICKET_TYPES.find((t) => t.id === selectedTicket)?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {ticketStatus === "active" ? "Currently Active" : "Ready to Use"}
                      </p>
                    </div>
                  </div>
                  {ticketStatus === "selected" && (
                    <Button size="sm" onClick={handleActivateTicket} className="bg-[#003DA5] hover:bg-[#003DA5]/90">
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Ticket Types */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm px-1 flex items-center gap-2">
              <Info className="h-4 w-4" />
              All Fare Options
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {TICKET_TYPES.map((ticket) => {
                const isSelected = selectedTicket === ticket.id
                const isRecommended = ticket.id === effectiveRecommendedId

                return (
                  <Card
                    key={ticket.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      isSelected && "ring-2 ring-[#003DA5]",
                      isRecommended && !isSelected && "border-amber-500/50",
                    )}
                    onClick={() => handleSelectTicket(ticket.id)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm sm:text-base">{ticket.name}</h4>
                            {isRecommended && (
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                              >
                                Best Value
                              </Badge>
                            )}
                            {getStatusBadge(ticket)}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.validityDuration}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-lg sm:text-xl font-bold text-[#003DA5]">
                            ${ticket.price.toFixed(2)}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#003DA5] hover:bg-[#003DA5]/90"
              disabled={!selectedTicket}
              onClick={() => {
                if (ticketStatus === "selected") {
                  handleActivateTicket()
                }
                onClose()
              }}
            >
              {ticketStatus === "active" ? "Done" : "Confirm Selection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
