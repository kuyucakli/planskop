"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserDailyPLans } from "@/db/queries/dailyPlans";
import { createCompletionsMap } from "@/lib/utils/dailyPlan";
import Link from "next/link";
import { ROUTES } from "@/lib/definitions";

export function SummaryCurrentUserSlotsClient({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ["percentageSlotsCurrentUser"],
    queryFn: () => getCurrentUserDailyPLans(userId),
  });

  if (!data) return;

  const completionsMap = createCompletionsMap(data);

  const completionsMapKeys = Object.keys(completionsMap);

  return (
    <>
      <h1 className="text-2xl/16  l-h sticky top-0 left-0 backdrop-blur-sm">
        Summary
      </h1>
      <ul className="">
        {completionsMapKeys.map((key) => {
          let totalCompletionCount = 0;
          const {
            userId,
            dailyPlanTitle,
            completions,
            repeatDayCount,
            dailyPlanId,
          } = completionsMap[Number(key)];
          return (
            <li key={key} className="bg-neutral-900 rounded p-6">
              <h1>
                <Link
                  href={`${ROUTES.DAILY_PLAN_DETAIL}${dailyPlanId}`}
                  className="underline underline-offset-4 decoration-dotted decoration-neutral-500"
                >
                  {dailyPlanTitle}
                </Link>
              </h1>
              <ul className="my-2">
                {Object.keys(completions).map((key) => {
                  totalCompletionCount += completions[key];
                  return (
                    <li key={key} className="text-xs">
                      <h2 className="mb-1">{key}</h2>
                      <div className="h-4 flex gap-2 items-center">
                        <div className="h-3 bg-neutral-950 w-11/12 rounded-md">
                          <div
                            className="h-1 bg-amber-800 mt-1"
                            style={{
                              width: `${Math.round(
                                (100 * completions[key]) / repeatDayCount
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <p className="w-1/12 text-right pr-1">
                          %
                          {Math.round(
                            (100 * completions[key]) / repeatDayCount
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <footer className="flex gap-2 items-center justify-end">
                <p className="text-xs pr-2">
                  Total:
                  {` %${Math.round(
                    (100 * totalCompletionCount) /
                      (Object.keys(completions).length * repeatDayCount)
                  )}`}
                </p>
              </footer>
            </li>
          );
        })}
      </ul>
    </>
  );
}
