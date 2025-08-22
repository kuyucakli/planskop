import Link from "next/link";
import { ButtonBack } from "./Buttons";
import { IconSettings } from "./Icons";
import { HabitCalendar } from "./HabitCalendar";
import { FormDelete } from "./forms/FormDelete";
import { getActionPlan } from "@/db/queries";

export const DailyPlanDetail = async ({
  dailyPlanId,
}: {
  dailyPlanId: string;
}) => {
  const res = await getActionPlan(Number(dailyPlanId));

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
  const dailyPlan = res.data;
  return (
    <>
      <ButtonBack />

      <h1 className="text-4xl capitalize font-bold mt-6 mb-4 relative">
        {dailyPlan.title}
        <Link
          href={`/planner/?actionPlanId=${dailyPlan.id}`}
          className="absolute top-0 right-8"
        >
          <IconSettings className=" fill-gray-50 - translate-x-full" />
        </Link>
      </h1>

      <HabitCalendar dailyPlan={dailyPlan} />
      <FormDelete id={Number(dailyPlan.id)} />
    </>
  );
};
