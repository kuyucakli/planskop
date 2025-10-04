import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCurrentUserDailyPLans } from "@/db/queries/dailyPlans";
import { SummaryCurrentUserSlotsClient } from "./SummaryCurrentUserSlotsClient";
import { currentUser } from "@clerk/nextjs/server";

const SummaryCurrentUserSlots = async () => {
  const user = await currentUser();
  if (!user) return;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["percentageSlotsCurrentUser"],
    queryFn: () => getCurrentUserDailyPLans(user.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SummaryCurrentUserSlotsClient userId={user.id} />
    </HydrationBoundary>
  );
};

export default SummaryCurrentUserSlots;
