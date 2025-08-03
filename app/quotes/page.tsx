"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Quote, RefreshCw, Heart, Star, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

interface QuoteData {
  text: string
  author: string
  category: string
}

export default function QuotesPage() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/quotes")
      if (response.ok) {
        const data = await response.json()
        setQuote(data)
      } else {
        throw new Error("Failed to fetch quote")
      }
    } catch (error) {
      console.error("Error fetching quote:", error)
      setError("Failed to load quote. Please try again.")
      setQuote({
        text: "Every day is a new beginning. Take a deep breath, smile, and start again.",
        author: "Unknown",
        category: "Motivation",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "motivation":
        return <Star className="h-4 w-4" />
      case "inspiration":
        return <Lightbulb className="h-4 w-4" />
      case "life":
        return <Heart className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "motivation":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "inspiration":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "life":
        return "bg-red-100 text-red-700 border-red-200"
      case "dreams":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "action":
        return "bg-green-100 text-green-700 border-green-200"
      case "growth":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "passion":
        return "bg-pink-100 text-pink-700 border-pink-200"
      case "perseverance":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "beginning":
        return "bg-teal-100 text-teal-700 border-teal-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ec4899' fillOpacity='0.1'%3E%3Cpath d='M40 40c11.046 0 20-8.954 20-20S51.046 0 40 0 20 8.954 20 20s8.954 20 20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse-slow">
                <Quote className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Daily Inspiration
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start your day with powerful quotes that inspire and motivate
            </p>
          </header>

          {/* Quote Card */}
          <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl mb-8 animate-slide-up">
            <CardContent className="p-12">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin mx-auto mb-4">
                    <RefreshCw className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600">Loading inspiration...</p>
                </div>
              ) : error ? (
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchQuote} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : quote ? (
                <div className="text-center">
                  <div className="mb-8">
                    <Quote className="h-12 w-12 text-purple-400 mx-auto mb-6 opacity-50" />
                    <blockquote className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-8 italic">
                      "{quote.text}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="text-lg font-semibold text-gray-700">— {quote.author}</div>
                      <Badge className={`flex items-center gap-1 ${getCategoryColor(quote.category)}`}>
                        {getCategoryIcon(quote.category)}
                        {quote.category}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={fetchQuote}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                  >
                    <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Get New Quote
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Quote Categories */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 text-center">Quote Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  "Motivation",
                  "Inspiration",
                  "Life",
                  "Dreams",
                  "Action",
                  "Growth",
                  "Passion",
                  "Perseverance",
                  "Beginning",
                  "Success",
                ].map((category) => (
                  <Badge
                    key={category}
                    className={`flex items-center justify-center gap-1 p-3 cursor-pointer hover:shadow-md transition-shadow ${getCategoryColor(category)}`}
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inspirational Tips */}
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-0 shadow-lg mt-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">💡 Daily Inspiration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-purple-700">
                <div className="space-y-2">
                  <p>• Start each day by reading an inspiring quote</p>
                  <p>• Write down quotes that resonate with you</p>
                  <p>• Share meaningful quotes with friends and family</p>
                </div>
                <div className="space-y-2">
                  <p>• Reflect on how quotes apply to your life</p>
                  <p>• Use quotes as daily affirmations</p>
                  <p>• Create a personal collection of favorite quotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
