"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useReviewStatuses, useReviews } from "@/hooks/use-reviews";
import { ReviewTabs } from "@/components/review-tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, X } from "lucide-react";
import type { ReviewStatus } from "@/actions/review-approvals";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

type SortOption = "newest" | "oldest" | "rating-high" | "rating-low";

const availableCategories = [
  "cleanliness",
  "communication",
  "accuracy",
  "check_in",
];

export default function ReviewManagementTemplate() {
  const { propertyId } = useParams();
  const router = useRouter();
  const { data: reviews, isLoading } = useQuery(useReviews(String(propertyId)));
  const { data: statusRecords } = useQuery(useReviewStatuses());

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const statusMap = useMemo(() => {
    const map = new Map<number | string, ReviewStatus>();
    statusRecords?.forEach(({ reviewId, status }) => {
      map.set(reviewId, status);
    });
    return map;
  }, [statusRecords]);

  const filteredAndSortedReviews = useMemo(() => {
    const filtered =
      reviews?.filter((review) => {
        if (
          categoryFilter !== "all" &&
          review.categories?.some((cat) => cat.category !== categoryFilter)
        ) {
          return false;
        }

        if (channelFilter !== "all" && review.source !== channelFilter) {
          return false;
        }

        return true;
      }) || [];

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.submittedAt).getTime() -
            new Date(b.submittedAt).getTime()
          );
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, categoryFilter, channelFilter, sortBy]);

  const hasActiveFilters = categoryFilter !== "all" || channelFilter !== "all";

  const resetFilters = () => {
    setCategoryFilter("all");
    setChannelFilter("all");
    setSortBy("newest");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const property = reviews?.[0]?.propertyName || "Property";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/manager")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Review Management</h1>
          <p className="text-muted-foreground">{property}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {reviews && reviews.length > 0 ? (
          <>
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filter & Sort Reviews</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-filter">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel-filter">Channel</Label>
                  <Select
                    value={channelFilter}
                    onValueChange={setChannelFilter}
                  >
                    <SelectTrigger id="channel-filter">
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="hostaway">Hostaway</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="rating-high">
                        Rating: High to Low
                      </SelectItem>
                      <SelectItem value="rating-low">
                        Rating: Low to High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredAndSortedReviews.length} of {reviews.length}{" "}
                  reviews
                </div>
              )}
            </div>

            <ReviewTabs
              reviews={filteredAndSortedReviews}
              reviewStatuses={statusMap}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews found for this property.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
