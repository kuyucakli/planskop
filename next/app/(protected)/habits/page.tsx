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
      <h1 className="text-6xl font-kira-hareng mb-2">My Daily Plans</h1>

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
          <li className="flex gap-2 justify-end">
            <Link href="/planner" className="flex gap-2 text-xs items-center">
              <IconAdd className="fill-white" />
              Add new daily plan
            </Link>
          </li>
          {dailyPlans?.map((dailyPlan) => {
            return (
              <li
                key={dailyPlan.id}
                className="mb-1 border-b-1 border-stone-500"
              >
                <h2 className="text-3xl relative capitalize text-emerald-200">
                  <Link
                    href={`/habits/${dailyPlan.id}`}
                    className="flex items-center  w-full h-24"
                  >
                    {dailyPlan.title}
                    <span className="text-sm text-gray-400 ml-2">
                      On:{" "}
                      {formatDate(dailyPlan.startDate, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
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
