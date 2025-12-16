"use server"

import { supabase } from "@/lib/supabase"

export type ReviewStatus = "approved" | "rejected" | "pending"

export async function getReviewStatus(reviewId: string): Promise<ReviewStatus> {
  const { data, error } = await supabase.from("review_approvals").select("status").eq("review_id", reviewId).single()

  if (error || !data) {
    return "pending"
  }

  return data.status as ReviewStatus
}

export async function getAllReviewStatuses(propertyId?: string) {
  let query = supabase.from("review_approvals").select("*")

  if (propertyId) {
    query = query.eq("property_id", propertyId)
  }

  const { data, error } = await query

  if (error || !data) {
    return []
  }

  return data.map((item) => ({
    reviewId: item.review_id,
    status: item.status as ReviewStatus,
  }))
}

export async function setReviewStatus(
  reviewId: string,
  propertyId: string,
  status: "approved" | "rejected",
): Promise<void> {
  const { error } = await supabase.from("review_approvals").upsert(
    {
      review_id: reviewId,
      property_id: propertyId,
      status,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "review_id",
    },
  )

  if (error) {
    throw new Error(`Failed to update review status: ${error.message}`)
  }
}
