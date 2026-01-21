"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  isOpen: boolean
  onToggle: () => void
  context?: {
    origin?: string
    destination?: string
    currentDelay?: number
    transferStation?: string
  }
}

const SUGGESTED_PROMPTS = [
  "What if my train is 5 minutes late?",
  "Show me accessible routes",
  "What's the fastest option?",
  "Is there a bus alternative?",
]

export function AIAssistant({ isOpen, onToggle, context }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your MBTA Trip Assistant. I can help you plan routes, understand transfer timing, and find alternatives. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI responses based on context and message
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("late") || lowerMessage.includes("delay")) {
      return `Based on current conditions, if your train is delayed by 5 minutes, you would have approximately ${Math.floor(Math.random() * 5) + 1} minutes less buffer at your transfer. I'd recommend taking the earlier departure or considering the Orange Line alternative which currently has better on-time performance (92% today).`
    }

    if (
      lowerMessage.includes("accessible") ||
      lowerMessage.includes("wheelchair") ||
      lowerMessage.includes("elevator")
    ) {
      return "All major transfer stations on your route are fully accessible. Park Street has elevators on both the Red and Green Line platforms. Downtown Crossing also has elevator access. I'd recommend allowing an extra 3-4 minutes for elevator wait times during peak hours."
    }

    if (lowerMessage.includes("fastest") || lowerMessage.includes("quick")) {
      return `The fastest route right now is via the Red Line with a transfer at Park Street. Total time: approximately 18 minutes. There's currently no significant congestion on this route. Would you like me to start navigation?`
    }

    if (lowerMessage.includes("bus") || lowerMessage.includes("alternative")) {
      return `There are 2 bus alternatives available:\n\n1. Bus 66 → Harvard Square (22 min, $1.70)\n2. Bus 1 → MIT (18 min, $1.70)\n\nThe bus options are slightly slower but offer more frequent departures. Bus 66 currently has light traffic conditions.`
    }

    if (lowerMessage.includes("weather") || lowerMessage.includes("rain")) {
      return "Current weather is clear with no impact on transit services. The ferry services are operating normally. I'd recommend the subway for the most reliable option regardless of weather conditions."
    }

    return `I understand you're asking about "${userMessage}". Based on your current route from ${context?.origin || "your origin"} to ${context?.destination || "your destination"}, I can help optimize your journey. Would you like specific information about timing, alternatives, or accessibility options?`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const response = await generateResponse(input)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-[#003DA5] hover:bg-[#002d7a] z-[50]"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-[50] shadow-2xl transition-all duration-300",
        isMinimized
          ? "bottom-20 md:bottom-6 right-3 sm:right-4 md:right-6 w-64 sm:w-72 md:w-80 h-14"
          : "bottom-0 left-0 right-0 h-[70vh] md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[500px] md:max-h-[80vh] md:rounded-xl rounded-t-xl rounded-b-none",
      )}
    >
      <CardHeader className="p-2.5 sm:p-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#003DA5] flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <span>Trip Assistant</span>
        </CardTitle>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={onToggle}>
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100%-120px)] sm:h-[calc(100%-130px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-2 sm:gap-3", message.role === "user" && "flex-row-reverse")}
              >
                <div
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === "assistant" ? "bg-[#003DA5]" : "bg-secondary",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white" />
                  ) : (
                    <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 max-w-[85%]",
                    message.role === "assistant" ? "bg-secondary text-secondary-foreground" : "bg-[#003DA5] text-white",
                  )}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#003DA5] flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white" />
                </div>
                <div className="bg-secondary rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {messages.length <= 2 && (
            <div className="px-3 sm:px-4 pb-1.5 sm:pb-2">
              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                {SUGGESTED_PROMPTS.slice(0, 2).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-2.5 sm:p-3 md:p-4 border-t pb-safe">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your trip..."
                className="flex-1 text-sm h-9 sm:h-10"
              />
              <Button type="submit" size="icon" disabled={!input.trim()} className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}
