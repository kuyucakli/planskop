"use client";

import { useQuery } from "@tanstack/react-query";
import { CardImage } from "../Card";
import ClerkUserCard from "../ClerkUserCard";
import {
  SelectActionCompletion,
  SelectDailyPlan,
} from "@/db/schemas/daily-plans-schema";
import { getLatestPublicDailyPLans } from "@/db/queries/dailyPlans";
import { CompletionsMap, DailyPlanWithCompletion } from "@/lib/definitions";
import {
  getDetailedDailyPlanTimes,
  getDetailedSlotTimes,
} from "@/lib/utils/dailyPlan";

export function SummaryLatestUserSlotsClient() {
  const { data } = useQuery({
    queryKey: ["percentageSlots"],
    queryFn: () => getLatestPublicDailyPLans(),
  });

  

  if (!data) return;

  const completionsMap = data.reduce((acc, current) => {
    const {
      userId,
      dailyPlanId,
      dailyPlanStartDate,
      dailyPlanTitle,
      dailyPlanRepeat,
      dailyPlanTimezone,
      actionTitle,
      actionTime: iso,
    } = current;

    const hoursMinutes = iso!!.toISOString().slice(11, 16);

    if (!acc[dailyPlanId]) {
      const detailedDailyPlanTimes = getDetailedDailyPlanTimes(
        dailyPlanStartDate,
        dailyPlanRepeat,
        dailyPlanTimezone
      );
      const repeatDayCount =
        (detailedDailyPlanTimes.endMs - detailedDailyPlanTimes.startMs) /
        (1000 * 60 * 60 * 24);

      acc[dailyPlanId] = {
        completions: { [actionTitle + "-" + hoursMinutes]: 1 },
        userId: userId,
        dailyPlanTitle: dailyPlanTitle,
        repeatDayCount,
      };
    } else {
      const val =
        acc[dailyPlanId].completions[actionTitle + "-" + hoursMinutes] || 0;

      acc[dailyPlanId].completions[actionTitle + "-" + hoursMinutes] = val + 1;
    }
    return acc;
  }, {} as CompletionsMap);

  const completionsMapKeys = Object.keys(completionsMap);

  return (
    <>
      <ul className="">
        {completionsMapKeys.map((key) => {
          let totalCompletionCount = 0;
          const { userId, dailyPlanTitle, completions, repeatDayCount } =
            completionsMap[Number(key)];
          return (
            <li key={key} className="bg-neutral-900 rounded p-6">
              <h1>{dailyPlanTitle}</h1>
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
              <footer className="flex gap-2 items-center justify-between">
                <ClerkUserCard userId={userId} />
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
