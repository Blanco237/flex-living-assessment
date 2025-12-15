"use client"

import { useQuery } from "@tanstack/react-query"
import type { Property, PropertyPerformance } from "@/types"

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await fetch("/api/properties")
      if (!response.ok) throw new Error("Failed to fetch properties")
      const data = await response.json()
      return data.result as Property[]
    },
  })
}

export function usePropertyPerformance() {
  return useQuery({
    queryKey: ["property-performance"],
    queryFn: async () => {
      const response = await fetch("/api/performance")
      if (!response.ok) throw new Error("Failed to fetch performance data")
      const data = await response.json()
      return data.performance as PropertyPerformance[]
    },
  })
}
