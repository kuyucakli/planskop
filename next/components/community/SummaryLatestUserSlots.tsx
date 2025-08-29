import { getLatestPublicDailyPLans } from "@/db/queries";
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
            {plan.photos.map((photo, i) => (
              <li key={photo.id} className="inline-block m-1">
                <CardImage
                  className="rounded-sm"
                  path={photo.imageUrl}
                  altText={`${photo.actionTitle}`}
                  removeBackground={false}
                  width="160"
                  height="160"
                />
                {/* <span className="text-xs">
                  {new Date(
                    Number(photo.actionId.split("-")[2])
                  ).toDateString()}
                </span>{" "} */}
                <p className="text-xs h-8 mt-2 capitalize">
                  {photo.actionTitle} {i + 1}
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
