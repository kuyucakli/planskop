import { getLatestPublicDailyPLans } from "@/db/queries/dailyPlans";
import ClerkUserCard from "../ClerkUserCard";
import { formatDuration } from "@/lib/utils";
import { CardImage } from "../Card";

const SummaryLatestUserSlots = async () => {
  const res = await getLatestPublicDailyPLans();
  const { data } = res;
  if (!data) return null;

  return (
    <ul className="flex gap-6 overflow-x-auto">
      {data.map((plan) => (
        <li key={plan.id} className="flex-none w-40">
          <ul>
            {plan.completions.map((completion, i) => (
              <li key={completion.id} className="inline-block m-1">
                {completion.imageUrl && (
                  <CardImage
                    className="rounded-sm"
                    path={completion.imageUrl}
                    altText={`${completion.actionTitle}`}
                    removeBackground={false}
                    width="160"
                    height="160"
                  />
                )}
                {/* <span className="text-xs">
                  {new Date(
                    Number(completion.actionId.split("-")[2])
                  ).toDateString()}
                </span>{" "} */}
                <p className="text-xs h-8 mt-2 capitalize">
                  {completion.actionTitle} {i + 1}
                </p>
              </li>
            ))}
          </ul>
          <h1 className="text-sm flex items-center flex-col">
            <span className="capitalize"> "{plan.title}" </span> by{" "}
            <ClerkUserCard userId={plan.userId} />
          </h1>
        </li>
      ))}
      <li className="bg-gray-950 flex-none w-40 rounded-sm"></li>
      <li className="bg-gray-950  flex-none w-40 rounded-sm"></li>
      <li className="bg-gray-950 flex-none w-40 rounded-sm"></li>
    </ul>
  );
};

export default SummaryLatestUserSlots;
