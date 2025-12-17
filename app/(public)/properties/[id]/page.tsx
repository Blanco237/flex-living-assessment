import PropertyDetailTemplate from "@/components/templates/Property.template";
import { useProperty } from "@/hooks/use-properties";
import { usePropertyReviews } from "@/hooks/use-reviews";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useProperty(id)),
    queryClient.prefetchQuery(usePropertyReviews(id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyDetailTemplate />
    </HydrationBoundary>
  );
};

export default Page;
