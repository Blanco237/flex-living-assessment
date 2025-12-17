"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types";
import { setReviewStatus, type ReviewStatus } from "@/actions/review-approvals";
import { Star, Check, X } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewCardProps {
  review: Review;
  status: ReviewStatus;
}

export function ReviewCard({ review, status }: ReviewCardProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: async (params: {
      reviewId: number | string;
      status: Exclude<ReviewStatus, "pending">;
    }) => {
      const response = await setReviewStatus(String(params.reviewId), params.status);
      return response;
    },
    onSuccess(data, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(`Review ${variables.status}`);
    },
    onError(error, variables, onMutateResult, context) {
      toast.error(error.message);
    },
  });

  const getSourceColor = () => {
    return review.source === "hostaway" ? "default" : "secondary";
  };

  const getStatusBadge = () => {
    if (status === "approved") {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Approved
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
          Rejected
        </Badge>
      );
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const onAction = (status: Exclude<ReviewStatus, "pending">) => {
    if (isPending) return;
    mutate({
      reviewId: review.id,
      status,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getSourceColor()} className="capitalize">
                {review.source}
              </Badge>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{review.guestName}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{review.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.submittedAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{review.review}</p>

        {review.categories && review.categories.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {review.categories.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground capitalize">
                  {cat.category.replace(/_/g, " ")}:
                </span>
                <span className="font-medium">{cat.rating}/10</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {status !== "approved" && (
            <Button
              onClick={() => onAction("approved")}
              size="sm"
              className="flex-1 gap-2"
              loading={isPending}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          )}
          {status !== "rejected" && (
            <Button
              onClick={() => onAction("rejected")}
              size="sm"
              variant="destructive"
              className="flex-1 gap-2 bg-[#cc1f1f]"
              loading={isPending}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
