"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Clock,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Quote,
  ChefHat,
  MapPin,
  Thermometer,
  ArrowRight,
  Sparkles,
  Heart,
  Coffee,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  feelsLike: number
}

interface QuoteData {
  text: string
  author: string
  category: string
}

interface Recipe {
  id: string
  name: string
  image: string
  category: string
  area: string
  instructions: string
  ingredients: Array<{ name: string; measure: string }>
  video?: string
}

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch weather data
        const weatherResponse = await fetch("/api/weather")
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json()
          setWeather(weatherData)
        }

        // Fetch quote data
        const quoteResponse = await fetch("/api/quotes")
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json()
          setQuote(quoteData)
        }

        // Fetch featured recipe
        const recipeResponse = await fetch("/api/recipes")
        if (recipeResponse.ok) {
          const recipeData = await recipeResponse.json()
          if (Array.isArray(recipeData) && recipeData.length > 0) {
            // Get a random recipe as featured
            const randomIndex = Math.floor(Math.random() * recipeData.length)
            setFeaturedRecipe(recipeData[randomIndex])
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getWeatherIcon = (condition?: string) => {
    if (!condition) {
      return <Cloud className="h-6 w-6 text-gray-500" />
    }

    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    }
    if (lowerCondition.includes("snow")) {
      return <CloudSnow className="h-6 w-6 text-blue-300" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-6 w-6 text-gray-500" />
    }
    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239333ea' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse-slow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Daily Routine
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {getGreeting()}! Start your day with inspiration, delicious recipes, and weather updates.
            </p>

            {/* Live Clock */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl max-w-md mx-auto mb-8">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Live</Badge>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 font-mono">{formatTime(currentTime)}</div>
                <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Stats */}
          <section className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Weather Card */}
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  {weather ? getWeatherIcon(weather.condition) : <Cloud className="h-6 w-6 text-gray-500" />}
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : weather ? (
                  <div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{Math.round(weather.temperature)}°C</div>
                    <div className="text-gray-600 capitalize mb-2">{weather.condition || "Unknown"}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{weather.location || "Unknown Location"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Weather unavailable</div>
                )}
                <Link href="/weather">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quote Card */}
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up delay-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Quote className="h-6 w-6" />
                  Daily Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : quote ? (
                  <div>
                    <blockquote className="text-gray-700 italic mb-3 line-clamp-3">"{quote.text}"</blockquote>
                    <div className="text-sm text-gray-500">— {quote.author}</div>
                    <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">{quote.category}</Badge>
                  </div>
                ) : (
                  <div className="text-gray-500">Quote unavailable</div>
                )}
                <Link href="/quotes">
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    More Quotes
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recipe Card */}
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up delay-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <ChefHat className="h-6 w-6" />
                  Featured Recipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : featuredRecipe ? (
                  <div>
                    <img
                      src={featuredRecipe.image || "/placeholder.svg"}
                      alt={featuredRecipe.name}
                      className="w-full h-20 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{featuredRecipe.name}</h3>
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                        {featuredRecipe.category}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{featuredRecipe.area}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Recipe unavailable</div>
                )}
                <Link href="/recipes">
                  <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                    View Recipes
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Everything You Need for Your Day</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-500 rounded-full w-fit mx-auto mb-4">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-800 mb-2">Weather Updates</h3>
                  <p className="text-blue-700 text-sm">Real-time weather conditions and 5-day forecasts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-100">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-500 rounded-full w-fit mx-auto mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Daily Inspiration</h3>
                  <p className="text-green-700 text-sm">Motivational quotes to start your day right</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-200">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-500 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-800 mb-2">Recipe Collection</h3>
                  <p className="text-orange-700 text-sm">Discover delicious recipes from around the world</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-500 rounded-full w-fit mx-auto mb-4">
                    <Coffee className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-800 mb-2">Daily Routine</h3>
                  <p className="text-purple-700 text-sm">Everything you need in one convenient place</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center animate-fade-in-up">
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-2xl text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Day?</h2>
                <p className="text-purple-100 mb-8 text-lg max-w-2xl mx-auto">
                  Explore weather updates, find inspiration, and discover amazing recipes to make every day special.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/weather">
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">Check Weather</Button>
                  </Link>
                  <Link href="/quotes">
                    <Button className="bg-purple-600 text-white hover:bg-purple-700 border-2 border-white px-8 py-3">
                      Get Inspired
                    </Button>
                  </Link>
                  <Link href="/recipes">
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">Find Recipes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
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
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
