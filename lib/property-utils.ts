import type { Property } from "@/types"

export function getPropertyType(propertyTypeId: number): string {
  const types: Record<number, string> = {
    1: "apartment",
    2: "house",
    3: "studio",
    4: "villa",
  }
  return types[propertyTypeId] || "apartment"
}

export function getPropertyTypeLabel(propertyTypeId: number): string {
  const labels: Record<number, string> = {
    1: "Apartment",
    2: "House",
    3: "Studio",
    4: "Villa",
  }
  return labels[propertyTypeId] || "Apartment"
}

export function filterProperties(
  properties: Property[],
  filters: {
    propertyType?: string
    minRating?: number
  },
): Property[] {
  return properties.filter((property) => {
    if (filters.propertyType && filters.propertyType !== "all") {
      const type = getPropertyType(property.propertyTypeId)
      if (type !== filters.propertyType) return false
    }

    if (filters.minRating) {
      if (property.averageReviewRating < filters.minRating) return false
    }

    return true
  })
}
