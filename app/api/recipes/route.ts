import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="

    if (search) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
    } else if (category) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
    } else {
      // Get random meals
      const randomMeals = []
      for (let i = 0; i < 12; i++) {
        try {
          const randomResponse = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
          if (randomResponse.ok) {
            const randomData = await randomResponse.json()
            if (randomData.meals && randomData.meals[0]) {
              randomMeals.push(randomData.meals[0])
            }
          }
        } catch (error) {
          console.error("Error fetching random meal:", error)
        }
      }

      if (randomMeals.length > 0) {
        const recipes = randomMeals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          category: meal.strCategory,
          area: meal.strArea,
          instructions: meal.strInstructions,
          video: meal.strYoutube,
          ingredients: Array.from({ length: 20 }, (_, i) => {
            const ingredient = meal[`strIngredient${i + 1}`]
            const measure = meal[`strMeasure${i + 1}`]
            return ingredient && ingredient.trim() ? { name: ingredient.trim(), measure: measure?.trim() || "" } : null
          }).filter(Boolean),
        }))

        return NextResponse.json(recipes)
      }
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()

    if (!data.meals) {
      return NextResponse.json([])
    }

    const recipes = data.meals.map((meal: any) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      video: meal.strYoutube,
      ingredients: Array.from({ length: 20 }, (_, i) => {
        const ingredient = meal[`strIngredient${i + 1}`]
        const measure = meal[`strMeasure${i + 1}`]
        return ingredient && ingredient.trim() ? { name: ingredient.trim(), measure: measure?.trim() || "" } : null
      }).filter(Boolean),
    }))

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)

    // Return fallback recipes
    const fallbackRecipes = [
      {
        id: "1",
        name: "Spaghetti Carbonara",
        image: "/placeholder.svg?height=200&width=300&text=Spaghetti+Carbonara",
        category: "Pasta",
        area: "Italian",
        instructions:
          "Cook spaghetti according to package directions. In a large bowl, whisk together eggs, cheese, and pepper. Drain pasta and immediately add to egg mixture, tossing quickly to coat.",
        video: "",
        ingredients: [
          { name: "Spaghetti", measure: "400g" },
          { name: "Eggs", measure: "4 large" },
          { name: "Parmesan cheese", measure: "100g grated" },
          { name: "Black pepper", measure: "to taste" },
        ],
      },
      {
        id: "2",
        name: "Chicken Tikka Masala",
        image: "/placeholder.svg?height=200&width=300&text=Chicken+Tikka+Masala",
        category: "Chicken",
        area: "Indian",
        instructions:
          "Marinate chicken in yogurt and spices. Grill until cooked. Make sauce with tomatoes, cream, and spices. Combine chicken with sauce and simmer.",
        video: "",
        ingredients: [
          { name: "Chicken breast", measure: "500g" },
          { name: "Yogurt", measure: "200ml" },
          { name: "Tomatoes", measure: "400g canned" },
          { name: "Heavy cream", measure: "200ml" },
        ],
      },
    ]

    return NextResponse.json(fallbackRecipes)
  }
}
