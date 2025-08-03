import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote, ChefHat, Cloud, Sunrise } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sunrise className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Daily Routine Hub</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your day right with motivation, recipes, and weather updates - everything you need for a perfect
            morning routine!
          </p>
        </header>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Quotes Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/quotes">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                  <Quote className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-700">Daily Motivation</CardTitle>
                <CardDescription>
                  Get inspired with powerful quotes to kickstart your day with positivity and energy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Motivated</Button>
              </CardContent>
            </Link>
          </Card>

          {/* Recipes Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/recipes">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <ChefHat className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">Recipe Ideas</CardTitle>
                <CardDescription>
                  Discover delicious and easy recipes for breakfast, lunch, dinner, and snacks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">Explore Recipes</Button>
              </CardContent>
            </Link>
          </Card>

          {/* Weather Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group md:col-span-2 lg:col-span-1">
            <Link href="/weather">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-700">Weather Updates</CardTitle>
                <CardDescription>
                  Check the weather forecast to plan your outdoor activities and dress appropriately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Weather</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-3xl mx-auto shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Your Daily Routine!</h2>
            <p className="text-gray-600 leading-relaxed">
              Every morning is a fresh start. Begin with a motivational quote to set the right mindset, explore recipes
              if you're planning to cook something special, and check the weather to decide if it's a perfect day to
              step outside. Make every day count!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
