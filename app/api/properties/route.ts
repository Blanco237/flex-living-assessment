import { NextResponse } from "next/server"

const HOSTAWAY_API_KEY = "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
const ACCOUNT_ID = "61148"

export async function GET() {
  try {
    const response = await fetch(`https://api.hostaway.com/v1/listings?accountId=${ACCOUNT_ID}`, {
      headers: {
        Authorization: `Bearer ${HOSTAWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      status: "success",
      result: data.result || [],
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ status: "error", message: "Failed to fetch properties" }, { status: 500 })
  }
}
