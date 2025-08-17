import { ClerkProvider } from '@clerk/nextjs'
import { CardFamousPersonSummary } from "@/components/Card";
import { FamousPeopleRoutines } from "./famous-people-routines";
import MainNavBar from "@/components/MainNavBar";
import { Kirang_Haerang } from "next/font/google";

import type { Metadata } from "next";
import NavUser from "@/components/navs/NavUser";
import { Roboto_Flex } from "next/font/google";
import { Suspense } from "react";
import { ThemeContextProvider } from "@/context/ThemeContext";
import "./globals.css";
import AppIntro from '@/components/AppIntro';
import appIntroStyles from "@/components/AppIntro.module.css";

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
      <ThemeContextProvider>

      </ThemeContextProvider>
      <html lang="en" >
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`font-mono ${kiraHareng.variable} ${appIntroStyles.AppIntroBody}`}>
          <AppIntro/>
          <div id="root" className="md:overflow-hidden">
            <MainNavBar />
            <header className="p-2 ">
              
              <NavUser />
             
            </header>
            <main className="p-3 md:p-6 limited-width overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">

              {children}

            </main>

            <aside className="p-6 overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
              <h1 className="text-4xl/16  l-h sticky top-0 left-0 backdrop-blur-sm">Inspiration</h1>
              <Suspense fallback={<CardFamousPersonSummary famousPerson={{ image: "", personName: "", routines: [] }} isSkeletonView />}>
                <FamousPeopleRoutines />
              </Suspense>
            </aside>

          </div>
        </body>
      </html>
    </ClerkProvider>

  );
}
