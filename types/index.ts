export interface Property {
  id: number
  propertyTypeId: number
  name: string
  internalListingName: string
  description: string
  thumbnailUrl: string | null
  address: string
  publicAddress: string
  city: string
  country: string
  price: number
  personCapacity: number
  bedroomsNumber: number
  bedsNumber: number
  bathroomsNumber: number
  averageReviewRating: number
  listingImages: {
    id: number
    url: string
    sortOrder: number
  }[]
  listingAmenities: {
    id: number
    amenityId: number
    amenityName: string
  }[]
}

export interface Reservation {
  id: number
  listingMapId: number
  listingName: string
  arrivalDate: string
  departureDate: string
  totalPrice: number
  status: string
  guestName: string
}

export interface Review {
  id: string
  propertyId: number
  propertyName: string
  source: "hostaway" | "google"
  rating: number
  review: string
  guestName: string
  submittedAt: string
  categories?: {
    category: string
    rating: number
  }[]
}

export interface PropertyPerformance {
  propertyId: number
  currentMonthReservations: number
  previousMonthReservations: number
  percentageChange: number
  trend: "up" | "down" | "stable"
}

export type PropertyType = "apartment" | "house" | "studio" | "villa"
