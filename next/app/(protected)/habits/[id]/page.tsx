import { ButtonBack } from "@/components/Buttons";
import { FormDelete } from "@/components/forms/FormDelete";
import { HabitCalendar } from "@/components/HabitCalendar";
import { IconEdit, IconSettings } from "@/components/Icons";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";
import Link from "next/link";
import { Suspense } from "react";

export type DetailPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function DetailPage({ params }: DetailPageProps) {
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
  const res = await getActionPlan(Number(dailyPLanId));

  if (!res || !res.data) {
    return (
      <div>
        <h1 className="text-3xl">Action Plan not found</h1>
        <Link href="/habits" className="text-blue-500 underline">
          Go back to habits
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ButtonBack />

      <h1 className="text-4xl capitalize font-bold mb-4 relative">
        {res.data.title}
        <Link
          href={`/planner/?actionPlanId=${dailyPLanId}`}
          className="absolute top-0 right-8"
        >
          <IconSettings className=" fill-gray-50 - translate-x-full" />
        </Link>
      </h1>

      <HabitCalendar dailyPlan={res.data} />
      <FormDelete id={res.data.id} />
    </div>
  );
}
