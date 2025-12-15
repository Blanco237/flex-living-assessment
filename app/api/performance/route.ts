import { NextResponse } from "next/server"

const HOSTAWAY_API_KEY = "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
const ACCOUNT_ID = "61148"

export async function GET() {
  try {
    // Fetch all reservations
    const response = await fetch(`https://api.hostaway.com/v1/reservations?accountId=${ACCOUNT_ID}`, {
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
    const reservations = data.result || []

    // Calculate performance metrics
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const performanceMap = new Map<number, any>()

    reservations.forEach((reservation: any) => {
      const arrivalDate = new Date(reservation.arrivalDate)
      const propertyId = reservation.listingMapId

      if (!performanceMap.has(propertyId)) {
        performanceMap.set(propertyId, {
          propertyId,
          currentMonthReservations: 0,
          previousMonthReservations: 0,
        })
      }

      const perf = performanceMap.get(propertyId)

      if (arrivalDate.getMonth() === currentMonth && arrivalDate.getFullYear() === currentYear) {
        perf.currentMonthReservations++
      } else if (arrivalDate.getMonth() === previousMonth && arrivalDate.getFullYear() === previousYear) {
        perf.previousMonthReservations++
      }
    })

    // Calculate percentage change and trend
    const performance = Array.from(performanceMap.values()).map((perf) => {
      const change = perf.currentMonthReservations - perf.previousMonthReservations
      const percentageChange =
        perf.previousMonthReservations > 0
          ? Math.round((change / perf.previousMonthReservations) * 100)
          : perf.currentMonthReservations > 0
            ? 100
            : 0

      let trend: "up" | "down" | "stable"
      if (percentageChange > 5) trend = "up"
      else if (percentageChange < -5) trend = "down"
      else trend = "stable"

      return {
        ...perf,
        percentageChange,
        trend,
      }
    })

    return NextResponse.json({
      status: "success",
      performance,
    })
  } catch (error) {
    console.error("Error calculating performance:", error)
    return NextResponse.json({ status: "error", message: "Failed to calculate performance" }, { status: 500 })
  }
}
