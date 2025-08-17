import Banner from "@/components/Banner";
import { SectionRandomFamous } from "@/components/SectionRandomFamous";
import { DATA_I_CAN_ACTIONS } from "@/data";
import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  let content;
  if (userId && sessionClaims) {
    content = await getActionPlans(userId);
  }

  return (
    <>
      <Banner>
        <div className="absolute top-0 left-0 p-8">
          <h1 className=" lg:w-200  text-7xl text-cyan-200 font-kira-hareng mb-8">
            “Habits, start small. Stick to it. Carpe diem.”
          </h1>
          <Link
            href={"/planner"}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold  px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-48 h-14 inline-flex justify-center items-center"
          >
            Create
          </Link>
        </div>
        <Image
          src="/images/banner_02.jpeg"
          alt="carpe diem"
          width="1920"
          height="350"
          className="w-full h-180 md:h-96 object-contain object-[100%_100%] md:object-[100%_5%] mix-blend-darken pointer-events-none"
        />
      </Banner>

      <Suspense fallback={"Loading"}>
        <SectionRandomFamous />
      </Suspense>

      <section className="text-amber-200">
        <h1 className="text-7xl">
          Man is nothing else but what he makes of himself.
        </h1>
        <ul className="flex flex-wrap">
          {DATA_I_CAN_ACTIONS.map((a) => (
            <li key={a} className="border rounded p-2 ">
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="text-2xl">Latest Habits</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias ad
          saepe laudantium consequatur? Deleniti at cum illum, ut nisi fuga
          praesentium sapiente, delectus eum aperiam accusamus quaerat
          recusandae asperiores autem accusantium ex consectetur magnam quidem
          adipisci dolorum provident harum voluptas veritatis rerum. Nobis sit
          modi consequatur quas incidunt, recusandae repudiandae quasi odio,
          labore reprehenderit voluptatem? Modi blanditiis natus necessitatibus
          nesciunt, temporibus mollitia pariatur aperiam. Eos quae beatae
          repellendus, quidem voluptate laudantium doloribus soluta quas,
          molestias iure facilis. Laudantium harum reprehenderit blanditiis
          perspiciatis dolor soluta, error eveniet rerum alias distinctio
          inventore! Reiciendis minima cupiditate doloribus ipsam. Quidem harum
          quas consequatur quo.
        </p>
      </section>

      {/* <section className="mt-6">
        <h1 className="text-2xl">Your Daily Habits:</h1>
        <ul>
          {content?.map(c => {


            return (
              <li key={c.id}>
                <h2>
                  <Link href={`/planner/?actionPlanId=${c.id}`}>{c.title}</Link>
                </h2>
                <p>for {c.repeat}</p>
                <ul>
                  {c.slots.map((s, index) => <li key={index}>{s.duration}, {s.at}, {s.title}</li>)}
                </ul>

              </li>
            )

          })}


        </ul>
      </section> */}
    </>
  );
}
