"use client";

import { getCurrentUserDailyPLans } from "@/db/queries/dailyPlans";
import HandWrittenNums from "./HandWrittenNums";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  createCompletionsMap,
  getDetailedDailyPlanTimes,
} from "@/lib/utils/dailyPlan";
import D3Barplot from "@/components/ui/d3/barplot";
import { useQuery } from "@tanstack/react-query";
import { ShimmerLine } from "./ui/shimmer";

const DailyPLanList = ({ userId }: { userId: string | null }) => {
  if (!userId) return null;
  const { data, isPending, isError } = useQuery({
    queryKey: ["percentageSlotsCurrentUser"],
    queryFn: () => getCurrentUserDailyPLans(userId),
  });

  if (isPending)
    return (
      <section>
        <ShimmerLine />
      </section>
    );

  if (isError || !data) {
    return <p>Something went wrong.</p>;
  }

  const completionsMap = createCompletionsMap(data);

  const completionsMapKeys = Object.keys(completionsMap);

  return (
    <section className="p-md mb-6 @container">
      <ul className="grid  @xl:[grid-template-columns:repeat(auto-fit,minmax(480px,1fr))] gap-6  md:gap-8 mt-4">
        {completionsMapKeys?.map((key) => {
          const {
            dailyPlanTitle,
            completions,
            repeatDayCount,
            dailyPlanId,
            dailyPlanStartDate,
            dailyPlanTimezone,
            dailyPlanRepeat,
            daysSinceStart,
          } = completionsMap[Number(key)];

          const detailedDailyPlanTimes = getDetailedDailyPlanTimes(
            dailyPlanStartDate,
            dailyPlanRepeat,
            dailyPlanTimezone
          );
          return (
            <li
              key={dailyPlanId}
              className="bg-neutral-900/[.5] text-neutral-400 rounded-lg @container"
            >
              <Link
                href={`/daily-plans/detail/${dailyPlanId}`}
                className="capitalize text-sm  flex  justify-between  flex-wrap @[818px]:flex-row @[818px]:flex-nowrap md:items-top  p-4  gap-4"
              >
                <div className="flex flex-col items-center flex-shrink-0 w-32 h-28 bg-neutral-950 rounded-lg order-3  @[818px]:order-1">
                  <HandWrittenNums
                    num={Number(
                      formatDate(dailyPlanStartDate, {
                        day: "numeric",
                      })
                    )}
                  />

                  <span className="font-bold">
                    {formatDate(dailyPlanStartDate, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="order-2 @[818px]:flex-[280px]">
                  <h1 className="text-xl font-bold ">{dailyPlanTitle}</h1>
                  <p className="flex flex-col text-xs">
                    <span>
                      Until:{" "}
                      {formatDate(detailedDailyPlanTimes.endDtStr, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-xs">This is a {repeatDayCount} day plan</p>
                </div>

                <D3Barplot
                  id={`${dailyPlanId}`}
                  data={completionsMap[Number(key)]}
                  className="flex-12/12  @[818px]:grow overflow-hidden order-3"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DailyPLanList;
