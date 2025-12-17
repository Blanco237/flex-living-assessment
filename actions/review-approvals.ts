"use server";

import { supabase } from "@/lib/supabase";

export type ReviewStatus = "approved" | "rejected" | "pending";

export interface ReviewStatusRecord {
  reviewId: string;
  status: Exclude<ReviewStatus, "pending">;
}

export async function getReviewStatuses(): Promise<ReviewStatusRecord[]> {
  const { data, error } = await supabase
    .from("review_status")
    .select("id, review_id, status");

  if (error || !data) {
    return [];
  }

  return data.map((item) => ({
    reviewId: item.review_id,
    status: item.status as Exclude<ReviewStatus, "pending">,
  }));
}

export async function setReviewStatus(
  reviewId: string,
  status: Exclude<ReviewStatus, "pending">
): Promise<void> {
  // The new `review_status` table tracks explicit statuses for reviews.
  // Setting status upserts a record keyed by `review_id`.
  const { error } = await supabase.from("review_status").upsert(
    {
      review_id: reviewId,
      status,
    },
    {
      onConflict: "review_id",
    }
  );

  if (error) {
    throw new Error(`Failed to update review status: ${error.message}`);
  }
}
