"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchReviews } from "@/actions/reviews"
import { getReviewStatus, getAllReviewStatuses, setReviewStatus } from "@/actions/review-approvals"

export function useReviews(propertyId: string) {
  return useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: () => fetchReviews(propertyId),
  })
}

export function useReviewStatus(reviewId: string) {
  return useQuery({
    queryKey: ["review-status", reviewId],
    queryFn: () => getReviewStatus(reviewId),
  })
}

export function useAllReviewStatuses(propertyId?: string) {
  return useQuery({
    queryKey: ["review-statuses", propertyId],
    queryFn: () => getAllReviewStatuses(propertyId),
  })
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      reviewId,
      propertyId,
      status,
    }: {
      reviewId: string
      propertyId: string
      status: "approved" | "rejected"
    }) => {
      await setReviewStatus(reviewId, propertyId, status)
      return { reviewId, propertyId, status }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["review-status"] })
      queryClient.invalidateQueries({ queryKey: ["review-statuses"] })
      queryClient.invalidateQueries({ queryKey: ["review-statuses", data.propertyId] })
    },
  })
}
