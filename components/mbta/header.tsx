"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X, Bell, Moon, Sun, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onSearch?: (query: string) => void
  alerts?: { id: string; message: string; type: "warning" | "info" }[]
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenTickets?: () => void
}

export function Header({ onSearch, alerts = [], darkMode, onToggleDarkMode, onOpenTickets }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const currentAlert = alerts[0]

  return (
    <header className="fixed top-0 left-0 right-0 z-[30]">
      {/* Service Alert Banner */}
      {currentAlert && showAlerts && (
        <div
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center justify-between",
            currentAlert.type === "warning" ? "bg-amber-500 text-amber-950" : "bg-blue-500 text-white",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{currentAlert.message}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-black/10 shrink-0 ml-2"
            onClick={() => setShowAlerts(false)}
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )}

      {/* Main Header */}
      <div className="glass border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#003DA5] text-white font-bold text-sm sm:text-base md:text-lg">
                T
              </div>
              <span className="font-semibold text-sm sm:text-base md:text-lg hidden xs:block">MBTA Transit</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              <a href="#" className="text-sm font-medium hover:text-[#003DA5] transition-colors">
                Plan a Trip
              </a>
              <a href="#" className="text-sm font-medium hover:text-[#003DA5] transition-colors">
                Schedules & Maps
              </a>
              <button
                onClick={onOpenTickets}
                className="text-sm font-medium hover:text-[#003DA5] transition-colors flex items-center gap-1"
              >
                <Ticket className="h-4 w-4" />
                Tickets & Passes
              </button>
              <a href="#" className="text-sm font-medium hover:text-[#003DA5] transition-colors">
                Alerts
              </a>
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <form onSubmit={handleSearch} className="hidden md:flex">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search stations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-40 lg:w-48 xl:w-64 h-9"
                  />
                </div>
              </form>

              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:hidden" onClick={onOpenTickets}>
                <Ticket className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onToggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="px-3 sm:px-4 py-3 space-y-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search stations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full h-10"
                  />
                </div>
              </form>
              <nav className="flex flex-col gap-1">
                <a
                  href="#"
                  className="py-2.5 px-2 text-sm font-medium hover:text-[#003DA5] hover:bg-muted rounded-lg transition-colors"
                >
                  Plan a Trip
                </a>
                <a
                  href="#"
                  className="py-2.5 px-2 text-sm font-medium hover:text-[#003DA5] hover:bg-muted rounded-lg transition-colors"
                >
                  Schedules & Maps
                </a>
                <button
                  onClick={() => {
                    onOpenTickets?.()
                    setMobileMenuOpen(false)
                  }}
                  className="py-2.5 px-2 text-sm font-medium hover:text-[#003DA5] hover:bg-muted rounded-lg transition-colors text-left flex items-center gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  Tickets & Passes
                </button>
                <a
                  href="#"
                  className="py-2.5 px-2 text-sm font-medium hover:text-[#003DA5] hover:bg-muted rounded-lg transition-colors"
                >
                  Alerts
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
