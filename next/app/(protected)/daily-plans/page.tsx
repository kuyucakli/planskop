import DailyPLanList from "@/components/DailyPlanList";
import { IconAdd } from "@/components/Icons";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return (
      <Link
        href={"/planner"}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold  px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded h-14 inline-flex justify-center items-center"
      >
        Create your first daily plan
      </Link>
    );
  }

  return (
    <>
      <h1 className=" flex justify-between items-baseline">
        <span className="text-5xl font-kira-hareng">Plans</span>

        <Link href="/planner" className="flex gap-2 text-xs items-center">
          <IconAdd className="fill-neutral-300" />
          Add plan
        </Link>
      </h1>

      <DailyPLanList userId={userId} />
    </>
  );
}
