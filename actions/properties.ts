"use server"

import { apiClient, HOSTAWAY_ACCOUNT_ID } from "@/lib/axios-client"
import type { Property } from "@/types"

export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await apiClient.get(`/listings`, {
      params: {
        accountId: HOSTAWAY_ACCOUNT_ID,
      },
    })

    return response.data.result || []
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }
}
