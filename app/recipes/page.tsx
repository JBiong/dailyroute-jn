"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Search, Globe, Play, X, Loader2, Heart, BookOpen, Utensils } from "lucide-react"
import Link from "next/link"

interface Recipe {
  id: string
  name: string
  image: string
  category: string
  area: string
  instructions: string
  video?: string
  ingredients: Array<{ name: string; measure: string }>
}

const categories = [
  "Beef",
  "Chicken",
  "Dessert",
  "Lamb",
  "Miscellaneous",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
  "Vegan",
  "Vegetarian",
  "Breakfast",
  "Goat",
]

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = async (category?: string, search?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      let url = "/api/recipes"
      const params = new URLSearchParams()

      if (category) params.append("category", category)
      if (search) params.append("search", search)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRecipes(Array.isArray(data) ? data : [])
      } else {
        throw new Error("Failed to fetch recipes")
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setError("Failed to load recipes. Please try again.")
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSelectedCategory("")
      fetchRecipes(undefined, searchTerm.trim())
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSearchTerm("")
    fetchRecipes(category)
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSearchTerm("")
    fetchRecipes()
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f97316' fillOpacity='0.1'%3E%3Cpath d='M50 50c13.807 0 25-11.193 25-25S63.807 0 50 0 25 11.193 25 25s11.193 25 25 25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg animate-bounce-slow">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent">
                Recipe Collection
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover delicious recipes from around the world</p>
          </header>

          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8 animate-slide-up">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </form>

              {/* Categories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Categories</h3>
                  {(selectedCategory || searchTerm) && (
                    <Button onClick={clearFilters} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
                      }`}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-gray-600">Loading delicious recipes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 border-red-200 mb-8">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchRecipes()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recipes Grid */}
          {!isLoading && recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={recipe.image || "/placeholder.svg?height=200&width=300&text=Recipe"}
                      alt={recipe.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-gray-800 border-0">{recipe.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Globe className="h-4 w-4" />
                      <span>{recipe.area}</span>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedRecipe(recipe)}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                            size="sm"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            View Recipe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                              {selectedRecipe?.name}
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[70vh]">
                            {selectedRecipe && (
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <img
                                      src={selectedRecipe.image || "/placeholder.svg?height=300&width=400&text=Recipe"}
                                      alt={selectedRecipe.name}
                                      className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <div className="flex gap-2 mt-4">
                                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                        {selectedRecipe.category}
                                      </Badge>
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                        {selectedRecipe.area}
                                      </Badge>
                                    </div>
                                    {selectedRecipe.video && (
                                      <Button
                                        onClick={() => window.open(selectedRecipe.video, "_blank")}
                                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                                      >
                                        <Play className="h-4 w-4 mr-2" />
                                        Watch Video Tutorial
                                      </Button>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                      <Utensils className="h-5 w-5" />
                                      Ingredients
                                    </h4>
                                    <ul className="space-y-2 text-sm">
                                      {selectedRecipe.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex justify-between">
                                          <span>{ingredient.name}</span>
                                          <span className="text-gray-600">{ingredient.measure}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Instructions
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {selectedRecipe.instructions}
                                  </p>
                                </div>
                              </div>
                            )}
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && recipes.length === 0 && !error && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Recipes Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search or browse different categories."
                    : "Unable to load recipes at the moment."}
                </p>
                <Button onClick={clearFilters} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Browse All Recipes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Cooking Tips */}
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-0 shadow-lg mt-8 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-orange-800">🍳 Cooking Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-orange-700">
                <div className="space-y-2">
                  <p>• Read the entire recipe before you start cooking</p>
                  <p>• Prep all ingredients before you begin (mise en place)</p>
                  <p>• Taste as you go and adjust seasonings</p>
                </div>
                <div className="space-y-2">
                  <p>• Use fresh ingredients when possible</p>
                  <p>• Don't be afraid to experiment with flavors</p>
                  <p>• Keep your knives sharp for safer, easier cutting</p>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
