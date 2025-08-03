"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, MapPin, Search, Loader2 } from "lucide-react"

interface WeatherData {
  location: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    uvIndex: number
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }>
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />
    case "partly cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-600" />
    case "rainy":
    case "light rain":
      return <CloudRain className="h-8 w-8 text-blue-500" />
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />
  }
}

const getCurrentWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="h-16 w-16 text-yellow-500" />
    case "partly cloudy":
      return <Cloud className="h-16 w-16 text-gray-500" />
    case "cloudy":
      return <Cloud className="h-16 w-16 text-gray-600" />
    case "rainy":
    case "light rain":
      return <CloudRain className="h-16 w-16 text-blue-500" />
    default:
      return <Sun className="h-16 w-16 text-yellow-500" />
  }
}

export default function WeatherPage() {
  const [location, setLocation] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (city = "New York") => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error("Error fetching weather:", error)
      setError("Failed to load weather data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  const handleSearch = () => {
    if (location.trim()) {
      fetchWeather(location.trim())
    }
  }

  const getWeatherTips = (weatherData: WeatherData) => {
    const tips = []

    if (weatherData.current.uvIndex > 6) {
      tips.push({
        icon: <Sun className="h-6 w-6 text-yellow-500 mb-2" />,
        title: "UV Protection",
        description: "High UV index. Wear sunscreen and protective clothing when going outside.",
      })
    } else {
      tips.push({
        icon: <Sun className="h-6 w-6 text-yellow-500 mb-2" />,
        title: "UV Protection",
        description: "UV index is moderate. Consider wearing sunscreen if going outside for extended periods.",
      })
    }

    if (weatherData.current.windSpeed > 20) {
      tips.push({
        icon: <Wind className="h-6 w-6 text-blue-500 mb-2" />,
        title: "Wind Conditions",
        description: "Strong winds expected. Secure loose items and be cautious outdoors.",
      })
    } else {
      tips.push({
        icon: <Wind className="h-6 w-6 text-blue-500 mb-2" />,
        title: "Wind Conditions",
        description: "Light to moderate breeze. Perfect conditions for outdoor activities.",
      })
    }

    if (weatherData.current.temperature < 15) {
      tips.push({
        icon: <Thermometer className="h-6 w-6 text-green-500 mb-2" />,
        title: "Temperature",
        description: "Cool temperature. Dress warmly and consider layers for comfort.",
      })
    } else if (weatherData.current.temperature > 25) {
      tips.push({
        icon: <Thermometer className="h-6 w-6 text-red-500 mb-2" />,
        title: "Temperature",
        description: "Warm temperature. Stay hydrated and wear light, breathable clothing.",
      })
    } else {
      tips.push({
        icon: <Thermometer className="h-6 w-6 text-green-500 mb-2" />,
        title: "Temperature",
        description: "Comfortable temperature. Perfect weather for most outdoor activities.",
      })
    }

    return tips
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Weather Updates</h1>
            <p className="text-lg text-blue-600">Plan your day with live weather information</p>
          </header>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Enter city name..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isLoading}
                />
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading weather data...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchWeather()} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Weather Data */}
          {!isLoading && !error && weatherData && (
            <>
              {/* Current Weather */}
              <Card className="mb-8 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5" />
                    <CardTitle className="text-2xl">{weatherData.location}</CardTitle>
                  </div>
                  <p className="text-blue-100">Current Weather</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        {getCurrentWeatherIcon(weatherData.current.condition)}
                      </div>
                      <div className="text-5xl font-bold text-gray-800 mb-2">{weatherData.current.temperature}°C</div>
                      <p className="text-xl text-gray-600">{weatherData.current.condition}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="text-lg font-semibold">{weatherData.current.humidity}%</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Wind className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Wind Speed</p>
                        <p className="text-lg font-semibold">{weatherData.current.windSpeed} km/h</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Eye className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Visibility</p>
                        <p className="text-lg font-semibold">{weatherData.current.visibility} km</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Sun className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">UV Index</p>
                        <p className="text-lg font-semibold">{weatherData.current.uvIndex}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-semibold text-gray-800 mb-2">{day.day}</p>
                        <div className="flex justify-center mb-3">{getWeatherIcon(day.condition)}</div>
                        <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">{day.high}°</span>
                          <span className="text-gray-500">{day.low}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weather Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Today's Weather Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {getWeatherTips(weatherData).map((tip, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                        {tip.icon}
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
