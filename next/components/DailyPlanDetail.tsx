import Link from "next/link";
import { IconSettings } from "./Icons";
import { HabitCalendar } from "./habitCalendar/HabitCalendar";
import { FormDelete } from "./forms/FormDelete";
import { getDailyPlan } from "@/db/queries/dailyPlans";
import { FormDailyPlan } from "@/components/forms/FormDailyPlan";

export const DailyPlanDetail = async ({
  dailyPlanId,
}: {
  dailyPlanId: string;
}) => {
  const res = await getDailyPlan(Number(dailyPlanId));

  if (!res || !res.data) {
    return (
      <div>
        <h1 className="text-3xl">Action Plan not found</h1>
        <Link href="/daily-plans" className="text-blue-500 underline">
          Go back to daily plans
        </Link>
      </div>
    );
  }
  const dailyPlan = res.data;
  return (
    <>
      <FormDailyPlan {...dailyPlan}>
        <HabitCalendar dailyPlan={dailyPlan} />
        <Link href={`/planner/?actionPlanId=${dailyPlan.id}`} className="">
          <IconSettings className=" fill-gray-50 - translate-x-full" />
        </Link>
      </FormDailyPlan>
      <FormDelete id={Number(dailyPlan.id)} />
    </>
  );
};
