"use client";

import { useQuery } from "@tanstack/react-query";
import ClerkUserCard from "../ClerkUserCard";
import { getLatestPublicDailyPLans } from "@/db/queries/dailyPlans";
import { CompletionsMap, DailyPlanWithCompletion } from "@/lib/definitions";
import {
  createCompletionsMap,
  getDetailedDailyPlanTimes,
} from "@/lib/utils/dailyPlan";
import { formatDate, utcToGmtOffset } from "@/lib/utils";

export function SummaryLatestUserSlotsClient() {
  const { data } = useQuery({
    queryKey: ["percentageSlots"],
    queryFn: () => getLatestPublicDailyPLans(),
  });

  if (!data) return;

  const completionsMap = createCompletionsMap(data);

  const completionsMapKeys = Object.keys(completionsMap);

  return (
    <>
      <h1 className="text-2xl/16  l-h sticky top-0 left-0 backdrop-blur-sm">
        Community
      </h1>
      <ul className="">
        {completionsMapKeys.map((key) => {
          let totalCompletionCount = 0;
          const {
            userId,
            dailyPlanTitle,
            dailyPlanRepeat,
            dailyPlanStartDate,
            dailyPlanTimezone,
            completions,
            repeatDayCount,
          } = completionsMap[Number(key)];
          const { daysUntilEnd } = getDetailedDailyPlanTimes(
            dailyPlanStartDate,
            dailyPlanRepeat,
            dailyPlanTimezone
          );
          return (
            <li key={key} className="bg-neutral-800 rounded p-6">
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
                <div className="text-xs pr-2 text-right">
                  <p>
                    {` completion: %${Math.round(
                      (100 * totalCompletionCount) /
                        (Object.keys(completions).length * repeatDayCount)
                    )}`}
                  </p>
                  <p>
                    {daysUntilEnd <= 0
                      ? `${repeatDayCount} ${
                          repeatDayCount > 1 ? "days" : "day"
                        } plan ended `
                      : `${repeatDayCount - daysUntilEnd}/${repeatDayCount}  ${
                          repeatDayCount > 1 ? "days" : "day"
                        } done! `}
                  </p>
                  <p>
                    <span className="text-xs">
                      {formatDate(dailyPlanStartDate, {
                        year: "numeric",
                        month: "short",
                      }).replace("/", ".")}
                    </span>
                  </p>
                </div>
              </footer>
            </li>
          );
        })}
      </ul>
    </>
  );
}
