"use server"

import axios from "axios"
import type { Review } from "@/types"

export async function fetchReviews(propertyId: string): Promise<Review[]> {
  try {
    // Fetch from Mockaroo (mock Hostaway reviews)
    const response = await axios.get("https://my.api.mockaroo.com/hostaway_reviews.json", {
      params: {
        key: "0e9430d0",
      },
    })

    const hostawayReviews = response.data || []

    // Filter reviews for this property
    const filteredReviews = hostawayReviews
      .filter((review: any) => review.listingMapId === Number.parseInt(propertyId))
      .map((review: any) => ({
        id: `hostaway-${review.id}`,
        propertyId: review.listingMapId,
        propertyName: review.listingName,
        source: "hostaway" as const,
        rating: review.rating || calculateAverageRating(review.reviewCategory),
        review: review.publicReview || review.privateReview || "",
        guestName: review.guestName,
        submittedAt: review.submittedAt,
        categories: review.reviewCategory,
      }))

    return filteredReviews
  } catch (error) {
    console.error("Error fetching reviews:", error)
    throw new Error("Failed to fetch reviews")
  }
}

function calculateAverageRating(categories: any[] = []): number {
  if (!categories || categories.length === 0) return 0
  const sum = categories.reduce((acc: number, cat: any) => acc + (cat.rating || 0), 0)
  return Math.round((sum / categories.length) * 10) / 10
}
