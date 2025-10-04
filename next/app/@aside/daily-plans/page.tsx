import SummaryCurrentUserSlots from "@/components/dailyPlan/SummaryCurrentUserSlots";
import { Suspense } from "react";

export default async function Page() {
  return (
    <aside className="p-6 overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
      <Suspense fallback="loading...">
        <SummaryCurrentUserSlots />
      </Suspense>
    </aside>
  );
}
