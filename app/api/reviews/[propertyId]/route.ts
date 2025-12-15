import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const { propertyId } = await params

    // Fetch from Mockaroo (mock Hostaway reviews)
    const mockarooResponse = await fetch("https://my.api.mockaroo.com/hostaway_reviews.json?key=0e9430d0", {
      cache: "no-store",
    })

    let hostawayReviews = []
    if (mockarooResponse.ok) {
      hostawayReviews = await mockarooResponse.json()
    }

    // Filter reviews for this property
    const filteredReviews = hostawayReviews
      .filter((review: any) => review.listingMapId === Number.parseInt(propertyId))
      .map((review: any) => ({
        id: `hostaway-${review.id}`,
        propertyId: review.listingMapId,
        propertyName: review.listingName,
        source: "hostaway",
        rating: review.rating || calculateAverageRating(review.reviewCategory),
        review: review.publicReview || review.privateReview || "",
        guestName: review.guestName,
        submittedAt: review.submittedAt,
        categories: review.reviewCategory,
      }))

    // Try to fetch Google reviews (if we had a place_id)
    // For now, we'll return just Hostaway reviews

    return NextResponse.json({
      status: "success",
      reviews: filteredReviews,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ status: "error", message: "Failed to fetch reviews" }, { status: 500 })
  }
}

function calculateAverageRating(categories: any[] = []): number {
  if (!categories || categories.length === 0) return 0
  const sum = categories.reduce((acc, cat) => acc + (cat.rating || 0), 0)
  return Math.round((sum / categories.length) * 10) / 10
}
