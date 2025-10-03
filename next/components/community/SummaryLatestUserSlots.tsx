import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getLatestPublicDailyPLans } from "@/db/queries/dailyPlans";
import { SummaryLatestUserSlotsClient } from "./SummaryLatestUserSlotsClient";

const SummaryLatestUserSlots = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["percentageSlots"],
    queryFn: () => getLatestPublicDailyPLans(),
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SummaryLatestUserSlotsClient />
    </HydrationBoundary>
  );
};

export default SummaryLatestUserSlots;
