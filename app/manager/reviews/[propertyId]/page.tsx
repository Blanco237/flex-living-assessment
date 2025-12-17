import ReviewManagementTemplate from "@/components/templates/Reviews.template";
import { useReviews, useReviewStatuses } from "@/hooks/use-reviews";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) => {
  const { propertyId } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useReviews(propertyId)),
    queryClient.prefetchQuery(useReviewStatuses()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewManagementTemplate />
    </HydrationBoundary>
  );
};

export default Page;
