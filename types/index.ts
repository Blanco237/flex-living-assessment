export interface Property {
  id: number;
  propertyTypeId: number;
  name: string;
  internalListingName: string;
  description: string;
  thumbnailUrl: string | null;
  address: string;
  publicAddress: string;
  city: string;
  country: string;
  price: number;
  personCapacity: number;
  bedroomsNumber: number;
  bedsNumber: number;
  bathroomsNumber: number;
  averageReviewRating: number;
  lat?: number;
  lng?: number;
  listingImages: {
    id: number;
    url: string;
    sortOrder: number;
  }[];
  listingAmenities: {
    id: number;
    amenityId: number;
    amenityName: string;
  }[];
}

export interface Reservation {
  id: number;
  listingMapId: number;
  listingName: string;
  arrivalDate: string;
  departureDate: string;
  totalPrice: number;
  status: string;
  guestName: string;
}

export interface Review {
  id: string | number;
  propertyId: number;
  propertyName: string;
  source: "hostaway" | "google";
  rating: number;
  review: string;
  guestName: string;
  submittedAt: string;
  categories?: {
    category: string;
    rating: number;
  }[];
}

export interface PropertyPerformance {
  propertyId: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  percentageChange: number;
  trend: "up" | "down" | "stable";
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number;
  publicReview: string;
  reviewCategory: ReviewCategoryRating[];
  submittedAt: string;
  guestName: string;
  listingMapId: number;
  listingName: string;
}

export interface ReviewCategoryRating {
  category: string;
  rating: number;
}

export interface GooglePlace {
  displayName: string;
  id: string;
  reviews: GoogleReview[];
}

export interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  rating: number;
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;
  flagContentUri: string;
  googleMapsUri: string;
  visitDate: {
    year: number;
    month: number;
    day: number;
  };
}
