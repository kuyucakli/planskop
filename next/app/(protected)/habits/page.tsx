import { IconAdd } from "@/components/Icons";
import { getActionPlans } from "@/db/queries";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  let dailyPlans = null;

  if (userId && sessionClaims) {
    const result = await getActionPlans(userId);
    dailyPlans = result.data;
  }

  return (
    <>
      <h1 className=" mb-8 flex justify-between items-baseline">
        <span className="text-6xl font-kira-hareng">My Daily Plans</span>
        {dailyPlans && dailyPlans.length > 0 && (
          <Link href="/planner" className="flex gap-2 text-xs items-center">
            <IconAdd className="fill-white" />
            Add new daily plan
          </Link>
        )}
      </h1>

      {(!userId || dailyPlans?.length == 0) && (
        <Link
          href={"/planner"}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold  px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded h-14 inline-flex justify-center items-center"
        >
          Create your first daily plan
        </Link>
      )}

      <section className="mt-2">
        <ul>
          {dailyPlans?.map((dailyPlan) => {
            return (
              <li
                key={dailyPlan.id}
                className="mb-1 border-b-1 border-stone-500"
              >
                <h2 className="text-3xl relative capitalize text-emerald-200">
                  <Link
                    href={`/habits/${dailyPlan.id}`}
                    className="flex items-baseline  w-full h-24"
                  >
                    {dailyPlan.title}
                    <span className="text-sm text-gray-400 ml-2 font-bold">
                      On:{" "}
                      {formatDate(dailyPlan.startDate, {
                        month: "long",
                        day: "numeric",
                      })}
                      ,{" "}
                      {formatDate(dailyPlan.startDate, {
                        year: "numeric",
                      })}
                      ,{" "}
                      {formatDate(dailyPlan.startDate, {
                        weekday: "long",
                      })}
                    </span>
                  </Link>
                </h2>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
