import { getDailyPlans } from "@/db/queries/dailyPlans";
import { auth } from "@clerk/nextjs/server";
import HandWrittenNums from "./HandWrittenNums";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getDetailedDailyPlanTimes } from "@/lib/utils/dailyPlan";

const DailyPLanList = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const result = await getDailyPlans(userId as string);

  const dailyPlans = result.data;

  return (
    <section className="p-md mb-6">
      <ul className="grid  [grid-template-columns:repeat(auto-fit,minmax(350px,1fr))] gap-4  md:gap-2 mt-4">
        {dailyPlans?.map((d, i) => {
          const detailedDailyPlanTimes = getDetailedDailyPlanTimes(
            d.startDate,
            d.repeat,
            d.timezone
          );
          return (
            <li key={d.id} className="">
              <Link
                href={`/daily-plans/detail/${d.id}`}
                className="capitalize text-sm text-black flex  flex-col md:flex-row md:items-top bg-emerald-200 p-4 rounded-lg gap-4 "
              >
                <div className="flex flex-col items-center h-28 bg-emerald-300 rounded-lg">
                  <HandWrittenNums
                    num={Number(
                      formatDate(d.startDate, {
                        day: "numeric",
                      })
                    )}
                  />
                  <span className="font-bold">
                    {formatDate(d.startDate, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{d.title}</h1>
                  <p className="flex flex-col">
                    <span>
                      End:{" "}
                      {formatDate(detailedDailyPlanTimes.endDtStr, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DailyPLanList;
