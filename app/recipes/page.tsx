"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Clock, Users, ChefHat, Utensils, Loader2, ExternalLink } from "lucide-react"

interface Recipe {
  id: string
  title: string
  category: string
  area?: string
  image: string
  ingredients: string[]
  instructions: string[]
  video?: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = ["All", "Breakfast", "Chicken", "Dessert", "Pasta", "Seafood", "Vegetarian"]

  const fetchRecipes = async (category = "All") => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/recipes?category=${category}`)
      if (!response.ok) {
        throw new Error("Failed to fetch recipes")
      }
      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setError("Failed to load recipes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes(selectedCategory)
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedRecipe(null)
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button onClick={() => setSelectedRecipe(null)} variant="outline" className="mb-6">
              ← Back to Recipes
            </Button>

            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={selectedRecipe.image || "/placeholder.svg"}
                    alt={selectedRecipe.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{selectedRecipe.category}</Badge>
                    {selectedRecipe.area && <Badge className="bg-blue-100 text-blue-800">{selectedRecipe.area}</Badge>}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedRecipe.title}</h1>

                  <div className="flex items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>30-45 mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>4 servings</span>
                    </div>
                  </div>

                  {selectedRecipe.video && (
                    <Button variant="outline" className="mb-4 bg-transparent" asChild>
                      <a href={selectedRecipe.video} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch Video Tutorial
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6 border-t">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <ChefHat className="h-5 w-5" />
                      Instructions
                    </h3>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-4">Recipe Collection</h1>
            <p className="text-lg text-green-600">Discover fresh recipes from around the world</p>
          </header>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading delicious recipes...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchRecipes(selectedCategory)} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Recipe Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{recipe.category}</Badge>
                      {recipe.area && <Badge className="bg-blue-100 text-blue-800">{recipe.area}</Badge>}
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{recipe.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>30-45 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>4 servings</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && recipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No recipes found for this category.</p>
              <Button onClick={() => handleCategoryChange("All")} variant="outline">
                View All Recipes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
