import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchProperties, fetchProperty } from "@/actions/properties";
import { fetchPerformance } from "@/actions/performance";
import { Property, PropertyPerformance } from "@/types";

export function useProperties() {
  return {
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  } as UseQueryOptions<Property[], unknown, Property[], [string]>;
}

export function useProperty(id: string | number) {
  return {
    queryKey: ["property", String(id)],
    queryFn: () => fetchProperty(id),
  } as UseQueryOptions<Property | undefined, unknown, Property | undefined, [string, string]>;
}

export function usePropertyPerformance() {
  return {
    queryKey: ["properties", "performance"],
    queryFn: () => fetchPerformance(),
  } as UseQueryOptions<
    PropertyPerformance[],
    unknown,
    PropertyPerformance[],
    [string, string]
  >;
}
