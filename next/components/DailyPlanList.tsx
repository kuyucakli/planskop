import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import HandWrittenNums from "./HandWrittenNums";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const DailyPLanList = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const result = await getActionPlans(userId as string);

  const dailyPlans = result.data;

  return (
    <section className="p-md mb-6">
      <ul className="flex gap-1 mt-4">
        {dailyPlans?.map((d, i) => (
          <li key={d.id} className="flex-1">
            <Link
              href={`/habits/${d.id}`}
              className="capitalize text-sm text-black flex bg-pink-200 p-4 rounded-lg "
            >
              <HandWrittenNums num={i + 1} />
              <p className="flex flex-col">
                <span>Your daily plan, "{d.title}"</span>
                <span>on: {formatDate(d.startDate, { weekday: "long" })}</span>
                <span>
                  {formatDate(d.startDate, {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DailyPLanList;
