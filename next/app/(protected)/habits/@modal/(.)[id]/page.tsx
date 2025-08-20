import { ButtonBack } from "@/components/Buttons";
import { DailyPlanDetail } from "@/components/DailyPlanDetail";
import { FormDelete } from "@/components/forms/FormDelete";
import { HabitCalendar } from "@/components/HabitCalendar";
import { IconSettings } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { getActionPlan, getActionPlans } from "@/db/queries";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: dailyPLanId } = await params;

  if (!dailyPLanId || isNaN(Number(dailyPLanId))) {
    return (
      <div>
        <h1 className="text-3xl">No Action Plan ID provided</h1>
        <Link href="/habits" className="text-blue-500 underline">
          Go back to habits
        </Link>
      </div>
    );
  }

  return (
    <Modal>
      <Suspense fallback={<div>Loading...</div>}>
        <DailyPlanDetail dailyPlanId={dailyPLanId} />
      </Suspense>
    </Modal>
  );
}
