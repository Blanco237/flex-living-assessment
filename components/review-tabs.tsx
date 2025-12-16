"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Review } from "@/types"
import type { ReviewStatus } from "@/actions/review-approvals"
import { ReviewCard } from "./review-card"

interface ReviewTabsProps {
  reviews: Review[]
  reviewStatuses: Map<string, ReviewStatus>
  onApprove: (reviewId: string) => void
  onReject: (reviewId: string) => void
}

export function ReviewTabs({ reviews, reviewStatuses, onApprove, onReject }: ReviewTabsProps) {
  const approvedReviews = reviews.filter((r) => reviewStatuses.get(r.id) === "approved")
  const rejectedReviews = reviews.filter((r) => reviewStatuses.get(r.id) === "rejected")
  const pendingReviews = reviews.filter((r) => reviewStatuses.get(r.id) === "pending")

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejectedReviews.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4 mt-6">
        {pendingReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending reviews</p>
        ) : (
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} status="pending" onApprove={onApprove} onReject={onReject} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved" className="space-y-4 mt-6">
        {approvedReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No approved reviews</p>
        ) : (
          <div className="grid gap-4">
            {approvedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} status="approved" onApprove={onApprove} onReject={onReject} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4 mt-6">
        {rejectedReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No rejected reviews</p>
        ) : (
          <div className="grid gap-4">
            {rejectedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} status="rejected" onApprove={onApprove} onReject={onReject} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
