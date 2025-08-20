import { getLatestPublicDailyPLan } from "@/db/queries";

const LatestPublicSlots = async () => {
  const res = await getLatestPublicDailyPLan();

  return (
    <section className="">
      <h1>{res?.data?.title}</h1>
    </section>
  );
};

export default LatestPublicSlots;
