import Banner from "@/components/Banner";
import { CardFamousPersonSummary } from "@/components/Card";

import { SectionRandomFamous } from "@/components/SectionRandomFamous";
import { getDailyPlans } from "@/db/queries/dailyPlans";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FamousPeopleRoutines } from "./famous-people-routines";

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  let content;
  if (userId && sessionClaims) {
    content = await getDailyPlans(userId);
  }

  return (
    <>
      <Banner>
        <div className="absolute top-0 left-0 p-8">
          <h1 className=" text-center md:text-left text-6xl md:text-7xl text-cyan-200 font-kira-hareng mb-8">
            “Habits, start small. Stick to it. Carpe diem.”
          </h1>
          <Link
            href={"/planner"}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold  px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-md w-60 h-14 flex justify-center items-center  m-auto md:m-0"
          >
            Create a daily plan
          </Link>
        </div>

        <Image
          src="/images/banner_02.jpeg"
          alt="carpe diem"
          width="1920"
          height="350"
          className="w-full  h-170 md:h-96 object-contain object-[100%_100%] md:object-[100%_5%] mix-blend-darken pointer-events-none"
        />
      </Banner>

      <h1 className="text-4xl/16  l-h sticky top-0 left-0 backdrop-blur-sm">
        Inspiration
      </h1>
      <Suspense
        fallback={
          <CardFamousPersonSummary
            famousPerson={{ image: "", personName: "", routines: [] }}
            isSkeletonView
          />
        }
      >
        <FamousPeopleRoutines />
      </Suspense>

      <Suspense fallback={"Loading..."}>
        <SectionRandomFamous />
      </Suspense>

      {/* <section className="text-amber-200  my-4">
        <h1 className="text-2xl">
          Man is nothing else but what he makes of himself.
        </h1>
        <ul className="flex flex-wrap">
          {DATA_I_CAN_ACTIONS.map((a) => (
            <li key={a} className="border rounded border-dotted p-2 text-xs">
              {a}
            </li>
          ))}
        </ul>
      </section> */}
    </>
  );
}
