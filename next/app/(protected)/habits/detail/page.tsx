import { HabitCalendar } from "@/components/HabitCalendar";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";
import Link from "next/link";

export default async function DetailPage({
  searchParams,
}: {
  searchParams: {
    [id: string]: string | string[] | undefined;
  };
}) {
  const dailyPLanId = searchParams.id as string;
  if (!dailyPLanId) {
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
      <h1 className="text-4xl capitalize font-bold mb-4">{res.data.title}</h1>

      <HabitCalendar dailyPlan={res.data} />

      <Link href="/habits" className="text-blue-500 underline mt-4">
        Back to Habits
      </Link>
    </div>
  );
}
