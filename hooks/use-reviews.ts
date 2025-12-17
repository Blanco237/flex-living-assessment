import { UseQueryOptions } from "@tanstack/react-query";
import { fetchReviews } from "@/actions/reviews";
import { getReviewStatuses, setReviewStatus } from "@/actions/review-approvals";
import type { ReviewStatusRecord } from "@/actions/review-approvals";
import { Review } from "@/types";

export function useReviews(propertyId: string) {
  return {
    queryKey: ["reviews", propertyId],
    queryFn: () => fetchReviews(propertyId),
  } as UseQueryOptions<Review[], unknown, Review[], [string, string]>;
}

export function useReviewStatuses() {
  return {
    queryKey: ["reviews", "statuses"],
    queryFn: () => getReviewStatuses(),
  } as UseQueryOptions<
    ReviewStatusRecord[],
    unknown,
    ReviewStatusRecord[],
    [string, string]
  >;
}

export function usePropertyReviews(propertyId: string) {
  return {
    queryKey: ["reviews", propertyId, "approved"],
    queryFn: async () => {
      const [reviews, statuses] = await Promise.all([
        fetchReviews(propertyId),
        getReviewStatuses(),
      ]);

      const approvedSet = new Set(
        statuses.filter((s) => s.status === "approved").map((s) => s.reviewId)
      );

      return reviews
        .filter((review) => approvedSet.has(String(review.id)))
        .sort((a, b) => {
          const dateA = new Date(a.submittedAt).getTime();
          const dateB = new Date(b.submittedAt).getTime();
          return dateB - dateA;
        });
    },
  } as UseQueryOptions<Review[], unknown, Review[], [string, string, string]>;
}
