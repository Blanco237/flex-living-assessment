"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/types"
import { Star } from "lucide-react"
import { format } from "date-fns"

interface PublicReviewCardProps {
  review: Review
}

export function PublicReviewCard({ review }: PublicReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{review.guestName}</span>
              <Badge variant="secondary" className="capitalize text-xs">
                {review.source}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.submittedAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">{review.review}</p>

        {review.categories && review.categories.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t">
            {review.categories.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground capitalize">{cat.category.replace(/_/g, " ")}:</span>
                <span className="font-medium">{cat.rating}/10</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
