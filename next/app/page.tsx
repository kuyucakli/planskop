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
        <h1 className=" lg:w-200  text-7xl text-cyan-200 font-kira-hareng absolute top-0 left-0 p-8 ">
          “Start small. Stick to it. Carpe diem.”
        </h1>
        <Image src="/images/banner_02.jpeg" alt="carpe diem" width="1920" height="350" className="w-full h-180 md:h-96 object-contain object-[100%_100%] md:object-[100%_5%] mix-blend-darken" />

      </Banner>

      <section className="my-8">
        <h1 className="text-2xl">Inspirations</h1>
        <img src="https://res.cloudinary.com/derfbfm9n/image/upload/e_background_removal/b_pink/c_fill,w_256,h_256,g_face/f_auto/q_auto/v1/famous_people/honore-de-balzac.jpg?_a=BAVAZGE70" alt="Balzac" width="200" height="200" />
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias ad saepe laudantium consequatur? Deleniti at cum illum, ut nisi fuga praesentium sapiente, delectus eum aperiam accusamus quaerat recusandae asperiores autem accusantium ex consectetur magnam quidem adipisci dolorum provident harum voluptas veritatis rerum. Nobis sit modi consequatur quas incidunt, recusandae repudiandae quasi odio, labore reprehenderit voluptatem? Modi blanditiis natus necessitatibus nesciunt, temporibus mollitia pariatur aperiam. Eos quae beatae repellendus, quidem voluptate laudantium doloribus soluta quas, molestias iure facilis. Laudantium harum reprehenderit blanditiis perspiciatis dolor soluta, error eveniet rerum alias distinctio inventore! Reiciendis minima cupiditate doloribus ipsam. Quidem harum quas consequatur quo.</p>
      </section>
      <section>
        <h1 className="text-2xl">Latest Habits</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias ad saepe laudantium consequatur? Deleniti at cum illum, ut nisi fuga praesentium sapiente, delectus eum aperiam accusamus quaerat recusandae asperiores autem accusantium ex consectetur magnam quidem adipisci dolorum provident harum voluptas veritatis rerum. Nobis sit modi consequatur quas incidunt, recusandae repudiandae quasi odio, labore reprehenderit voluptatem? Modi blanditiis natus necessitatibus nesciunt, temporibus mollitia pariatur aperiam. Eos quae beatae repellendus, quidem voluptate laudantium doloribus soluta quas, molestias iure facilis. Laudantium harum reprehenderit blanditiis perspiciatis dolor soluta, error eveniet rerum alias distinctio inventore! Reiciendis minima cupiditate doloribus ipsam. Quidem harum quas consequatur quo.</p>
      </section>

      <section className="mt-6">
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
      </section>
    </>
  );
}
