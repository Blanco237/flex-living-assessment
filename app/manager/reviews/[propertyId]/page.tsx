"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useReviews, useUpdateReviewStatus } from "@/hooks/use-reviews"
import { getReviewStatus } from "@/lib/review-storage"
import { ReviewTabs } from "@/components/review-tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ReviewManagementPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = use(params)
  const router = useRouter()
  const { data: reviews, isLoading } = useReviews(propertyId)
  const updateStatus = useUpdateReviewStatus()

  const [reviewStatuses, setReviewStatuses] = useState<Map<string, "approved" | "rejected" | "pending">>(new Map())

  useEffect(() => {
    if (reviews) {
      const statusMap = new Map()
      reviews.forEach((review) => {
        statusMap.set(review.id, getReviewStatus(review.id))
      })
      setReviewStatuses(statusMap)
    }
  }, [reviews])

  const handleApprove = (reviewId: string) => {
    updateStatus.mutate(
      { reviewId, status: "approved" },
      {
        onSuccess: () => {
          setReviewStatuses((prev) => new Map(prev).set(reviewId, "approved"))
        },
      },
    )
  }

  const handleReject = (reviewId: string) => {
    updateStatus.mutate(
      { reviewId, status: "rejected" },
      {
        onSuccess: () => {
          setReviewStatuses((prev) => new Map(prev).set(reviewId, "rejected"))
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const property = reviews?.[0]?.propertyName || "Property"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => router.push("/manager")} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Review Management</h1>
          <p className="text-muted-foreground">{property}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {reviews && reviews.length > 0 ? (
          <ReviewTabs
            reviews={reviews}
            reviewStatuses={reviewStatuses}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews found for this property.</p>
          </div>
        )}
      </div>
    </div>
  )
}
