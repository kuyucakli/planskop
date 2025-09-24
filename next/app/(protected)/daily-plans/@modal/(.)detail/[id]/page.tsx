import { DailyPlanDetail } from "@/components/DailyPlanDetail";
import { Modal } from "@/components/dialogs/Modal";

import Link from "next/link";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: dailyPLanId } = await params;

  if (!dailyPLanId || isNaN(Number(dailyPLanId))) {
    return (
      <div>
        <h1 className="text-3xl">No daily plan found with the id provided</h1>
        <Link href="/daily-plans" className="text-blue-500 underline">
          Go back to daily plans
        </Link>
      </div>
    );
  }

  return (
    <Modal>
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <DailyPlanDetail dailyPlanId={dailyPLanId} />
      </Suspense>
    </Modal>
  );
}
