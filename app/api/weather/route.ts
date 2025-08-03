import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "New York"

  const apiKey = process.env.OPENWEATHER_API_KEY || "02d49ef92e7e85fa3d016f7ef127b7f7"

  try {
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    )

    if (!currentWeatherResponse.ok) {
      throw new Error("Failed to fetch current weather data")
    }

    const currentWeather = await currentWeatherResponse.json()

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    )

    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch forecast data")
    }

    const forecastData = await forecastResponse.json()

    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const processedDates = new Set()

    for (let i = 0; i < Math.min(forecastData.list.length, 40); i++) {
      const item = forecastData.list[i]
      const date = new Date(item.dt * 1000)
      const dateString = date.toDateString()

      if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
        const dayIndex = dailyForecasts.length
        const dayName =
          dayIndex === 0 ? "Today" : dayIndex === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "long" })

        // Find min/max temps for the day
        const dayItems = forecastData.list.filter((listItem: any) => {
          const itemDate = new Date(listItem.dt * 1000)
          return itemDate.toDateString() === dateString
        })

        const temps = dayItems.map((item: any) => item.main.temp)
        const high = Math.round(Math.max(...temps))
        const low = Math.round(Math.min(...temps))

        // Map weather condition to our icon system
        const weatherMain = item.weather[0].main.toLowerCase()
        let condition = item.weather[0].description
        let icon = "sunny"

        if (weatherMain.includes("cloud")) {
          condition = weatherMain.includes("few") ? "Partly Cloudy" : "Cloudy"
          icon = weatherMain.includes("few") ? "partly-cloudy" : "cloudy"
        } else if (weatherMain.includes("rain")) {
          condition = "Rainy"
          icon = "rainy"
        } else if (weatherMain.includes("clear")) {
          condition = "Sunny"
          icon = "sunny"
        }

        dailyForecasts.push({
          day: dayName,
          high,
          low,
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          icon,
        })

        processedDates.add(dateString)
      }
    }

    // Map current weather condition
    const currentWeatherMain = currentWeather.weather[0].main.toLowerCase()
    let currentCondition = currentWeather.weather[0].description

    if (currentWeatherMain.includes("cloud")) {
      currentCondition = currentWeatherMain.includes("few") ? "Partly Cloudy" : "Cloudy"
    } else if (currentWeatherMain.includes("rain")) {
      currentCondition = "Rainy"
    } else if (currentWeatherMain.includes("clear")) {
      currentCondition = "Sunny"
    }

    // Calculate sunrise and sunset times
    const sunrise = new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const sunset = new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const weatherData = {
      location: `${currentWeather.name}, ${currentWeather.sys.country}`,
      temperature: Math.round(currentWeather.main.temp),
      condition: currentCondition.charAt(0).toUpperCase() + currentCondition.slice(1),
      humidity: currentWeather.main.humidity,
      windSpeed: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round((currentWeather.visibility || 10000) / 1000), // Convert to km
      pressure: currentWeather.main.pressure,
      feelsLike: Math.round(currentWeather.main.feels_like),
      uvIndex: 5, // OpenWeather UV requires separate API call, using default
      sunrise,
      sunset,
      forecast: dailyForecasts,
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather:", error)

    // Return fallback data with proper structure
    const fallbackData = {
      location: city,
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      feelsLike: 24,
      uvIndex: 5,
      sunrise: "6:30 AM",
      sunset: "7:45 PM",
      forecast: [
        { day: "Today", high: 24, low: 18, condition: "Partly Cloudy", icon: "02d" },
        { day: "Tomorrow", high: 26, low: 19, condition: "Sunny", icon: "01d" },
        { day: "Wed", high: 23, low: 17, condition: "Cloudy", icon: "03d" },
        { day: "Thu", high: 21, low: 15, condition: "Light Rain", icon: "10d" },
        { day: "Fri", high: 25, low: 18, condition: "Sunny", icon: "01d" },
      ],
    }

    return NextResponse.json(fallbackData)
  }
}
