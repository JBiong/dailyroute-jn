import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Quote, ChefHat, Cloud } from "lucide-react"

export function Navigation() {
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Home className="h-5 w-5" />
            Daily Routine
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/quotes" className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Quotes
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recipes" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Recipes
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/weather" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Weather
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
