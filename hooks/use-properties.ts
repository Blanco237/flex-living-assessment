"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchProperties } from "@/actions/properties"
import { fetchPerformance } from "@/actions/performance"

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  })
}

export function usePropertyPerformance() {
  return useQuery({
    queryKey: ["property-performance"],
    queryFn: () => fetchPerformance(),
  })
}
