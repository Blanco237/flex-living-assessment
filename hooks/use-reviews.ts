"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Review } from "@/types"
import { getReviewStatus, setReviewStatus, type ReviewStatus } from "@/lib/review-storage"

export function useReviews(propertyId: string) {
  return useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${propertyId}`)
      if (!response.ok) throw new Error("Failed to fetch reviews")
      const data = await response.json()
      return data.reviews as Review[]
    },
  })
}

export function useReviewStatus(reviewId: string) {
  return useQuery({
    queryKey: ["review-status", reviewId],
    queryFn: () => getReviewStatus(reviewId),
  })
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: ReviewStatus }) => {
      setReviewStatus(reviewId, status)
      return { reviewId, status }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-status"] })
    },
  })
}
