import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { FormDelete } from "@/components/forms/FormDelete";
import { HabitCalendar } from "@/components/HabitCalendar";
import { IconEdit } from "@/components/Icons";

export const metadata: Metadata = {
  title: "My Daily Plans",
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { userId, sessionClaims } = await auth();
  let result = null;
  if (userId && sessionClaims) {
    result = await getActionPlans(userId);
  }

  return (
    <>
      <h1 className="text-6xl font-kira-hareng mb-12">
        {metadata.title as ReactNode}
      </h1>

      {(!userId || result?.length == 0) && (
        <Link
          href={"/planner"}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold  px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded h-14 inline-flex justify-center items-center"
        >
          Create your first daily plan
        </Link>
      )}

      <section className="mt-6">
        <ul>
          {result?.map((dailyPlan) => {
            const dailyPlanStart = "";
            const dailyPlanDateRange = "";
            const dailyPlanEnd = "";
            return (
              <li key={dailyPlan.id} className="mb-12">
                <h2 className="text-3xl relative inline-flex capitalize text-emerald-200">
                  <Link
                    href={`/habits/detail/?id=${dailyPlan.id}`}
                    className="hover:underline"
                  >
                    {dailyPlan.title}
                  </Link>
                  <Link href={`/planner/?actionPlanId=${dailyPlan.id}`}>
                    <IconEdit className="absolute top-0 right-0 fill-gray-50 - translate-x-full" />
                  </Link>
                </h2>

                <HabitCalendar dailyPlan={dailyPlan} />

                <FormDelete id={dailyPlan.id} />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
