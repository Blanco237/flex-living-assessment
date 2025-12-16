"use server"

import { fetchProperties } from "./properties"
import { fetchReservations } from "./reservations"
import type { PropertyPerformance } from "@/types"

export async function fetchPerformance(): Promise<PropertyPerformance[]> {
  try {
    const [properties, reservations] = await Promise.all([fetchProperties(), fetchReservations()])

    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Calculate performance for each property
    const performance = properties.map((property) => {
      const propertyReservations = reservations.filter((r) => r.listingMapId === property.id)

      // Current/next month reservations
      const currentPeriodReservations = propertyReservations.filter((r) => {
        const arrivalDate = new Date(r.arrivalDate)
        return arrivalDate >= currentMonthStart && arrivalDate < nextMonthStart
      })

      // Previous month reservations
      const previousPeriodReservations = propertyReservations.filter((r) => {
        const arrivalDate = new Date(r.arrivalDate)
        return arrivalDate >= previousMonthStart && arrivalDate < currentMonthStart
      })

      const currentBookings = currentPeriodReservations.length
      const previousBookings = previousPeriodReservations.length

      const currentRevenue = currentPeriodReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0)
      const previousRevenue = previousPeriodReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0)

      const bookingChange = previousBookings === 0 ? 0 : ((currentBookings - previousBookings) / previousBookings) * 100
      const revenueChange = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100

      return {
        propertyId: property.id,
        propertyName: property.name,
        currentBookings,
        previousBookings,
        bookingChange,
        currentRevenue,
        previousRevenue,
        revenueChange,
      }
    })

    return performance
  } catch (error) {
    console.error("Error calculating performance:", error)
    throw new Error("Failed to calculate performance")
  }
}
