import type { Metadata } from "next";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import NavUser from "@/components/navs/NavUser";
import { ClerkProvider } from '@clerk/nextjs'
import { Kirang_Haerang } from "next/font/google";
import { Roboto_Flex } from "next/font/google";
import { FamousPeopleRoutines } from "./famous-people-routines";
import { Suspense } from "react";
import Loading from "./loading";
import "./globals.css";

const robotoFlex = Roboto_Flex({ subsets: ["latin"], display: "swap", variable: '--font-roboto-flex', });
const kiraHareng = Kirang_Haerang({ weight: "400", display: "swap", variable: '--font-kira-hareng', });

export const metadata: Metadata = {
  title: "Planskop",
  description: "Welcome to Planskop – Your Personal Guide to Building Better Habits",
};

export default async function RootLayout({
  children,


}: Readonly<{
  children: React.ReactNode;

}>) {


  return (

    <ClerkProvider>
      <html lang="en" >
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`font-mono ${kiraHareng.variable}`}>
          <div id="root">
            <Header />
            <header className="p-2">
              <Logo onlyPictogram />
              <form>
                <input type="text" name="search" id="search" placeholder="search" />
              </form>
              <NavUser />
            </header>
            <main className="limited-width p-8">

              {children}

            </main>

            <aside className="p-6 overflow-y-auto ">
              <h1 className="text-4xl  sticky top-0 left-0 backdrop-blur-sm">Inspiration</h1>
              <Suspense fallback={<Loading />}>
                <FamousPeopleRoutines />
              </Suspense>
            </aside>

          </div>
        </body>
      </html>
    </ClerkProvider>

  );
}
