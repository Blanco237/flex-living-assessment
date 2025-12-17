"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Review } from "@/types";
import { ReviewCard } from "./review-card";
import { useMemo } from "react";
import { groupBy } from "@/lib/utils";
import type { ReviewStatus } from "@/actions/review-approvals";

interface ReviewTabsProps {
  reviews: Review[];
  reviewStatuses: Map<number | string, ReviewStatus>;
}

export function ReviewTabs({ reviews, reviewStatuses }: ReviewTabsProps) {
  const groupedReviews = useMemo(() => {
    return groupBy(reviews, (review) => {
      return reviewStatuses.get(String(review.id)) ?? ("pending" as ReviewStatus);
    });
  }, [reviews, reviewStatuses]);


  const approved = groupedReviews?.approved ?? [];
  const pending = groupedReviews?.pending ?? [];
  const rejected = groupedReviews?.rejected ?? [];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4 mt-6 ">
        {pending.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No pending reviews
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} status="pending" />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved" className="space-y-4 mt-6">
        {approved.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No approved reviews
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map((review) => (
              <ReviewCard key={review.id} review={review} status="approved" />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4 mt-6">
        {rejected.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No rejected reviews
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejected.map((review) => (
              <ReviewCard key={review.id} review={review} status="rejected" />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
