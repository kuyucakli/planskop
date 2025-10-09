import Banner from "@/components/Banner";
import { CardFamousPersonSummary } from "@/components/Card";

import { SectionRandomFamous } from "@/components/SectionRandomFamous";
import { getDailyPlans } from "@/db/queries/dailyPlans";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FamousPeopleRoutines } from "./famous-people-routines";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  let content;
  if (userId && sessionClaims) {
    //content = await getDailyPlans(userId);
    redirect("/daily-plans");
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

      <h1 className="text-2xl  l-h sticky top-0 left-0 backdrop-blur-sm my-4">
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

      <section className="mt-8">
        <h1 className="text-sm">Media Sources of atomic habits </h1>
        <h2 className="text-xl  l-h sticky top-0 left-0 backdrop-blur-sm mb-4">
          Library
        </h2>
        <ul className="flex gap-6">
          <li className="w-1/9 ">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759583790/47573e80-71d3-40bb-8d59-05d0cee38822.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759584371/8a207ad8-add0-4158-aa93-b8580cf58aec.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759585094/78a1fb35-12f4-49bb-89cf-6a3ab7513625.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759585193/2e9aed94-377d-416e-aad6-88e45aa2925f.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759585278/77cd8aa3-27dc-4a4b-85a8-93383704f377.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759585334/5dd7d608-b3ba-45cf-afd1-1c1c3479d13c.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759583790/47573e80-71d3-40bb-8d59-05d0cee38822.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759583790/47573e80-71d3-40bb-8d59-05d0cee38822.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
          <li className="w-1/9">
            <figure className="h-40 bg-amber-300 rounded">
              <Image
                className="object-contain block w-full h-full"
                src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759583790/47573e80-71d3-40bb-8d59-05d0cee38822.png"
                alt="atomic habits"
                width="600"
                height="600"
              />
            </figure>
          </li>
        </ul>
      </section>

      <Suspense fallback={"Loading..."}>
        <SectionRandomFamous />
      </Suspense>
    </>
  );
}
