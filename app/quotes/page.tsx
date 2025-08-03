"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { RefreshCw, Heart, Share2, Loader2, Wifi, WifiOff, Sparkles } from "lucide-react"

interface Quote {
  text: string
  author: string
  fallback?: boolean
  source?: string
}

export default function QuotesPage() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNewQuote = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/quotes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh quotes
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const quote = await response.json()

      if (!quote.text || !quote.author) {
        throw new Error("Invalid quote data received")
      }

      setCurrentQuote(quote)
      setIsLiked(false)
    } catch (error) {
      console.error("Error fetching quote:", error)
      setError("Unable to load quote. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNewQuote()
  }, [])

  const shareQuote = () => {
    if (!currentQuote) return

    const quoteText = `"${currentQuote.text}" - ${currentQuote.author}`

    if (navigator.share) {
      navigator
        .share({
          title: "Daily Motivation",
          text: quoteText,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          // Fallback to clipboard
          navigator.clipboard.writeText(quoteText)
          alert("Quote copied to clipboard!")
        })
    } else {
      // Fallback to clipboard
      navigator.clipboard
        .writeText(quoteText)
        .then(() => {
          alert("Quote copied to clipboard!")
        })
        .catch(() => {
          alert("Unable to copy to clipboard. Please copy manually.")
        })
    }
  }

  const getSourceIcon = () => {
    if (!currentQuote) return null

    if (currentQuote.fallback) {
      return <WifiOff className="h-5 w-5 text-gray-400" title="Offline quote" />
    } else if (currentQuote.source === "zenquotes") {
      return <Sparkles className="h-5 w-5 text-purple-500" title="ZenQuotes.io" />
    } else {
      return <Wifi className="h-5 w-5 text-green-500" title="Live quote" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Daily Motivation</h1>
            <p className="text-lg text-purple-600">
              Powered by ZenQuotes.io - Fresh inspiration from influential figures
            </p>
          </header>

          <Card className="mb-8 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                Today's Quote
                {getSourceIcon()}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Loading inspiration from ZenQuotes...</span>
                </div>
              ) : error ? (
                <div className="py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchNewQuote} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : currentQuote ? (
                <>
                  <blockquote className="text-2xl md:text-3xl font-medium text-gray-700 leading-relaxed italic">
                    "{currentQuote.text}"
                  </blockquote>
                  <p className="text-xl text-purple-600 font-semibold">— {currentQuote.author}</p>

                  {currentQuote.fallback ? (
                    <p className="text-sm text-gray-500 bg-gray-100 rounded-lg p-2 inline-block">
                      📚 Curated quote (API temporarily unavailable)
                    </p>
                  ) : (
                    <p className="text-sm text-purple-500 bg-purple-50 rounded-lg p-2 inline-block">
                      ✨ Fresh from ZenQuotes.io
                    </p>
                  )}

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => setIsLiked(!isLiked)}
                      variant={isLiked ? "default" : "outline"}
                      size="lg"
                      className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                      {isLiked ? "Loved!" : "Love it"}
                    </Button>

                    <Button onClick={shareQuote} variant="outline" size="lg">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={fetchNewQuote}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-2" />}
              Get New Quote
            </Button>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                <p className="text-gray-600">Unlimited Quotes</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">🧘</div>
                <p className="text-gray-600">ZenQuotes.io</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">🔓</div>
                <p className="text-gray-600">No API Key</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
