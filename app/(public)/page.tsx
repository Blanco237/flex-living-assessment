import PropertiesTemplate from "@/components/templates/Properties.template";
import { useProperties } from "@/hooks/use-properties";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";

const Page = async () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(useProperties());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertiesTemplate />
    </HydrationBoundary>
  );
};

export default Page;
