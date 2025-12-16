"use server"

import { apiClient, HOSTAWAY_ACCOUNT_ID } from "@/lib/axios-client"

interface Reservation {
  id: number
  listingMapId: number
  arrivalDate: string
  departureDate: string
  status: string
  totalPrice: number
  nights: number
}

export async function fetchReservations(): Promise<Reservation[]> {
  try {
    const response = await apiClient.get(`/reservations`, {
      params: {
        accountId: HOSTAWAY_ACCOUNT_ID,
        limit: 500,
      },
    })

    return response.data.result || []
  } catch (error) {
    console.error("Error fetching reservations:", error)
    throw new Error("Failed to fetch reservations")
  }
}
