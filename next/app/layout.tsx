import { ClerkProvider } from "@clerk/nextjs";
import { CardFamousPersonSummary } from "@/components/Card";
import { FamousPeopleRoutines } from "./famous-people-routines";
import MainNavBar from "@/components/MainNavBar";
import { Kirang_Haerang } from "next/font/google";

import type { Metadata } from "next";
import NavUser from "@/components/navs/NavUser";
import { Roboto_Flex } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppIntro from "@/components/AppIntro";
import appIntroStyles from "@/components/AppIntro.module.css";
import Providers from "./providers";
import SummaryLatestUserSlots from "@/components/community/SummaryLatestUserSlots";
import { BasicButton } from "@/components/Buttons";
import Link from "next/link";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
});
const kiraHareng = Kirang_Haerang({
  weight: "400",
  display: "swap",
  variable: "--font-kira-hareng",
});

export const metadata: Metadata = {
  title: "Planskop",
  description:
    "Welcome to Planskop – Your Personal Guide to Building Better Habits",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <Providers>
          <body
            className={`font-mono ${kiraHareng.variable} ${appIntroStyles.AppIntroBody}`}
          >
            <AppIntro />
            <div id="root" className="md:overflow-hidden">
              <MainNavBar />
              <header className="p-2">
                <NavUser />
                <nav className="flex gap-2 text-sm">
                  <Link
                    href="/about"
                    className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs  font-bold py-2 px-4 rounded tracking-wide"
                  >
                    About
                  </Link>
                  <Link
                    href="/newsletter"
                    className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs font-bold  py-2 px-4 rounded tracking-wider"
                  >
                    Newsletter
                  </Link>
                </nav>
              </header>
              <main className="p-3 mb-4 md:p-6 limited-width overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
                {children}
                {modal}
              </main>
              <aside className="p-6 overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
                <h1 className="text-4xl/16  l-h sticky top-0 left-0 backdrop-blur-sm">
                  Community
                </h1>
                {/* <h2 className="text-sm mb-4">Small steps, shared progress</h2> */}
                <Suspense fallback="loading...">
                  <SummaryLatestUserSlots />
                </Suspense>
              </aside>
            </div>
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
