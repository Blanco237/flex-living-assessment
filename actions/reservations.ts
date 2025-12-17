"use server";

import API, { PaginatedResponse } from "@/lib/axios-client";

interface Reservation {
  id: number;
  listingMapId: number;
  arrivalDate: string;
  departureDate: string;
  status: string;
  totalPrice: number;
  nights: number;
}

export async function fetchReservations(params: {
  arrivalStartDate: string;
}): Promise<Reservation[]> {
  try {
    const response: PaginatedResponse<Reservation> = await API.get(
      `/reservations`,
      params
    );

    return response.result || [];
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations");
  }
}
