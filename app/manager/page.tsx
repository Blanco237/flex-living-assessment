import ManagerTemplate from "@/components/templates/Manager.template";
import { useProperties, usePropertyPerformance } from "@/hooks/use-properties";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Page = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useProperties()),
    queryClient.prefetchQuery(usePropertyPerformance()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManagerTemplate />
    </HydrationBoundary>
  );
};

export default Page;
