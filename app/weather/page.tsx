"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Search,
  MapPin,
  Calendar,
  Sunrise,
  Sunset,
  Umbrella,
  Shirt,
  Coffee,
} from "lucide-react"
import Link from "next/link"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  feelsLike: number
  uvIndex: number
  sunrise: string
  sunset: string
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }>
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchCity, setSearchCity] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (city?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const url = city ? `/api/weather?city=${encodeURIComponent(city)}` : "/api/weather"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setWeather(data)
      } else {
        throw new Error("Weather data not available")
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      setError("Failed to load weather data. Please try again.")
      setWeather(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim())
    }
  }

  const getWeatherIcon = (condition?: string) => {
    if (!condition) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    }

    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    }
    if (lowerCondition.includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-blue-300" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    }
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const getWeatherAdvice = (condition?: string, temperature?: number) => {
    if (!condition || temperature === undefined) {
      return { icon: <Coffee className="h-5 w-5 text-brown-600" />, text: "Check the weather before heading out!" }
    }

    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain")) {
      return { icon: <Umbrella className="h-5 w-5 text-blue-600" />, text: "Don't forget your umbrella!" }
    }
    if (temperature < 10) {
      return { icon: <Shirt className="h-5 w-5 text-purple-600" />, text: "Bundle up, it's cold outside!" }
    }
    if (temperature > 25) {
      return { icon: <Sun className="h-5 w-5 text-orange-600" />, text: "Perfect weather for outdoor activities!" }
    }
    return { icon: <Coffee className="h-5 w-5 text-brown-600" />, text: "Great day to enjoy a warm beverage!" }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2306b6d4' fillOpacity='0.05'%3E%3Cpath d='M50 50c13.807 0 25-11.193 25-25S63.807 0 50 0 25 11.193 25 25s11.193 25 25 25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg animate-bounce-slow">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Weather Forecast
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with current weather conditions and forecasts
            </p>
          </header>

          {/* Search */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8 animate-slide-up">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for a city..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-4">
                <Sun className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600">Loading weather data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 border-red-200 mb-8">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchWeather()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Weather Data */}
          {weather && !isLoading && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Current Weather */}
              <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold flex items-center gap-2 mb-2">
                        <MapPin className="h-6 w-6" />
                        {weather.location || "Unknown Location"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-blue-100">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Main Weather Info */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                        {getWeatherIcon(weather.condition)}
                        <div>
                          <div className="text-5xl font-bold text-gray-800">
                            {weather.temperature ? Math.round(weather.temperature) : "--"}°C
                          </div>
                          <div className="text-lg text-gray-600 capitalize">{weather.condition || "Unknown"}</div>
                          <div className="text-sm text-gray-500">
                            Feels like {weather.feelsLike ? Math.round(weather.feelsLike) : "--"}°C
                          </div>
                        </div>
                      </div>

                      {/* Weather Advice */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          {getWeatherAdvice(weather.condition, weather.temperature).icon}
                          <span className="text-gray-700 font-medium">
                            {getWeatherAdvice(weather.condition, weather.temperature).text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Weather Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="text-xl font-bold text-blue-600">{weather.humidity || "--"}%</div>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <Wind className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Wind Speed</div>
                        <div className="text-xl font-bold text-green-600">{weather.windSpeed || "--"} km/h</div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Visibility</div>
                        <div className="text-xl font-bold text-purple-600">{weather.visibility || "--"} km</div>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <Thermometer className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Pressure</div>
                        <div className="text-xl font-bold text-orange-600">{weather.pressure || "--"} hPa</div>
                      </div>
                    </div>
                  </div>

                  {/* Sun Times */}
                  <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                      <Sunrise className="h-6 w-6 text-yellow-600" />
                      <div>
                        <div className="text-sm text-gray-600">Sunrise</div>
                        <div className="text-lg font-semibold text-yellow-600">{weather.sunrise || "--:--"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                      <Sunset className="h-6 w-6 text-orange-600" />
                      <div>
                        <div className="text-sm text-gray-600">Sunset</div>
                        <div className="text-lg font-semibold text-orange-600">{weather.sunset || "--:--"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              {weather.forecast && weather.forecast.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      5-Day Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {weather.forecast.map((day, index) => (
                        <div
                          key={index}
                          className="text-center p-4 bg-gradient-to-b from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="font-semibold text-gray-800 mb-2">{day.day}</div>
                          <div className="flex justify-center mb-3">{getWeatherIcon(day.condition)}</div>
                          <div className="text-sm text-gray-600 capitalize mb-2">{day.condition || "Unknown"}</div>
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-gray-800">
                              {day.high ? Math.round(day.high) : "--"}°
                            </div>
                            <div className="text-sm text-gray-500">{day.low ? Math.round(day.low) : "--"}°</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weather Tips */}
              <Card className="bg-gradient-to-r from-teal-100 to-cyan-100 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-teal-800">🌤️ Weather Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-teal-700">
                    <div className="space-y-2">
                      <p>• Check the weather before planning outdoor activities</p>
                      <p>• Dress in layers for changing temperatures</p>
                      <p>• Stay hydrated, especially on hot days</p>
                    </div>
                    <div className="space-y-2">
                      <p>• Keep an umbrella handy during rainy seasons</p>
                      <p>• Protect your skin with sunscreen on sunny days</p>
                      <p>• Drive carefully in adverse weather conditions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
