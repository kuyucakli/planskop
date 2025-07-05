import Banner from "@/components/Banner";
import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import Image from 'next/image';

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
      {userId}
      {content && JSON.stringify(content)}
    </>
  );
}
