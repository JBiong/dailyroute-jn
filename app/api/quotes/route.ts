import { NextResponse } from "next/server"

// Fallback quotes in case the API fails
const fallbackQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown",
  },
]

export async function GET() {
  try {
    // Try to fetch from ZenQuotes API
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const response = await fetch("https://zenquotes.io/api/random", {
      headers: {
        "User-Agent": "Daily-Routine-App/1.0",
        Accept: "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`ZenQuotes API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // ZenQuotes returns an array with one quote object
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response format from ZenQuotes API")
    }

    const quote = data[0]

    // Validate the response data
    if (!quote.q || !quote.a) {
      throw new Error("Invalid quote data from ZenQuotes API")
    }

    // Clean up the author name (remove any extra text like "type":"author")
    let author = quote.a
    if (author.includes(",")) {
      author = author.split(",")[0].trim()
    }

    return NextResponse.json({
      text: quote.q,
      author: author,
      source: "zenquotes",
    })
  } catch (error) {
    console.error("Error fetching quote from ZenQuotes API:", error)

    // Fallback to local quotes
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
    const fallbackQuote = fallbackQuotes[randomIndex]

    return NextResponse.json({
      text: fallbackQuote.text,
      author: fallbackQuote.author,
      fallback: true,
      source: "local",
    })
  }
}
