"use server";

import API, { HostawayResponse, PaginatedResponse } from "@/lib/axios-client";
import type { Property } from "@/types";

export async function fetchProperties(): Promise<Property[]> {
  try {
    const data: PaginatedResponse<Property> = await API.get(`/listings`);
    return data.result || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
}

export async function fetchProperty(
  id: string | number
): Promise<Property | undefined> {
  try {
    const response: HostawayResponse<Property> = await API.get(
      `/listings/${id}`
    );
    return response.result;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property");
  }
}
