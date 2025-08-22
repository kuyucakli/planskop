import { getLatestPublicDailyPLan } from "@/db/queries";
import ClerkUserCard from "../ClerkUserCard";
import { formatDuration } from "@/lib/utils";

const SummaryLatestUserSlots = async () => {
  const res = await getLatestPublicDailyPLan();
  const { data } = res;
  if (!data) return null;

  return (
    <>
      <h1 className="text-sm flex items-center">
        <span className="capitalize"> "{data.title}"</span> by{" "}
        <ClerkUserCard userId={data.userId} />
      </h1>
      <ul>
        {data.photos.map((photo) => (
          <li key={photo.id} className="inline-block m-1">
            <img
              src={photo.imageUrl}
              alt={data.title || "User uploaded"}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <span className="text-xs">
              {new Date(Number(photo.actionId.split("-")[2])).toDateString()}
            </span>
            <span className="text-xs">{photo.actionTitle}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SummaryLatestUserSlots;
