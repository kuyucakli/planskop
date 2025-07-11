import Banner from "@/components/Banner";
import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import Image from 'next/image';
import Link from "next/link";

export default async function Home() {


  const { userId, sessionClaims } = await auth()
  let content;
  if (userId && sessionClaims) {
    content = await getActionPlans(userId);
  }



  return (
    <>
      <Banner>
        <h1 className="text-6xl text-blue-500 font-kira-hareng">
          “Start small. Stick to it. Carpe diem.”
        </h1>
        <Image src="/images/carpediem.svg" alt="carpe diem" width="350" height="350" />

      </Banner>

      <section className="mt-6">
        <h1 className="text-2xl">Your Daily Plans:</h1>
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
      </section>
    </>
  );
}
