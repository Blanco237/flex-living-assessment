import { NextResponse } from "next/server"

const HOSTAWAY_API_KEY = "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
const ACCOUNT_ID = "61148"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listingMapId = searchParams.get("listingMapId")

    let url = `https://api.hostaway.com/v1/reservations?accountId=${ACCOUNT_ID}`
    if (listingMapId) {
      url += `&listingMapId=${listingMapId}`
    }

    const response = await fetch(url, {
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
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ status: "error", message: "Failed to fetch reservations" }, { status: 500 })
  }
}
