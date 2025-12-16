"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useReviews, useUpdateReviewStatus, useAllReviewStatuses } from "@/hooks/use-reviews"
import { ReviewTabs } from "@/components/review-tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { ReviewStatus } from "@/actions/review-approvals"

export default function ReviewManagementPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = use(params)
  const router = useRouter()
  const { data: reviews, isLoading } = useReviews(propertyId)
  const { data: statuses } = useAllReviewStatuses(propertyId)
  const updateStatus = useUpdateReviewStatus()

  const [reviewStatuses, setReviewStatuses] = useState<Map<string, ReviewStatus>>(new Map())

  useEffect(() => {
    if (reviews && statuses) {
      const statusMap = new Map<string, ReviewStatus>()
      reviews.forEach((review) => {
        const statusRecord = statuses.find((s) => s.reviewId === review.id)
        statusMap.set(review.id, statusRecord?.status || "pending")
      })
      setReviewStatuses(statusMap)
    }
  }, [reviews, statuses])

  const handleApprove = (reviewId: string) => {
    updateStatus.mutate(
      { reviewId, propertyId, status: "approved" },
      {
        onSuccess: () => {
          setReviewStatuses((prev) => new Map(prev).set(reviewId, "approved"))
        },
      },
    )
  }

  const handleReject = (reviewId: string) => {
    updateStatus.mutate(
      { reviewId, propertyId, status: "rejected" },
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
