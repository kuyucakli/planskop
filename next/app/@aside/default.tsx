import SummaryLatestUserSlots from "@/components/community/SummaryLatestUserSlots";

import { Suspense } from "react";

export default async function Default() {
  return (
    <aside className="p-6 overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
      {/* <h2 className="text-sm mb-4">Small steps, shared progress</h2> */}

      <Suspense fallback="loading...">
        <SummaryLatestUserSlots />
      </Suspense>
    </aside>
  );
}
