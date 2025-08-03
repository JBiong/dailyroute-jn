import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || ""

  try {
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="

    // If category is specified, get meals by category
    if (category && category !== "All") {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    } else {
      // Get random meals
      const categories = ["Breakfast", "Chicken", "Dessert", "Pasta", "Seafood", "Vegetarian"]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${randomCategory}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()

    if (!data.meals) {
      return NextResponse.json({ recipes: [] })
    }

    // Get detailed recipe information for first 6 meals
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 6).map(async (meal: any) => {
        try {
          const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
          const detailData = await detailResponse.json()
          const fullMeal = detailData.meals[0]

          // Extract ingredients
          const ingredients = []
          for (let i = 1; i <= 20; i++) {
            const ingredient = fullMeal[`strIngredient${i}`]
            const measure = fullMeal[`strMeasure${i}`]
            if (ingredient && ingredient.trim()) {
              ingredients.push(`${measure?.trim() || ""} ${ingredient.trim()}`.trim())
            }
          }

          // Split instructions into steps
          const instructions = fullMeal.strInstructions
            ? fullMeal.strInstructions.split(/\r?\n/).filter((step: string) => step.trim().length > 0)
            : []

          return {
            id: fullMeal.idMeal,
            title: fullMeal.strMeal,
            category: fullMeal.strCategory,
            area: fullMeal.strArea,
            image: fullMeal.strMealThumb,
            ingredients,
            instructions,
            video: fullMeal.strYoutube,
          }
        } catch (error) {
          console.error("Error fetching meal details:", error)
          return null
        }
      }),
    )

    const validRecipes = detailedRecipes.filter((recipe) => recipe !== null)

    return NextResponse.json({ recipes: validRecipes })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}
