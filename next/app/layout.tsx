import { ClerkProvider } from "@clerk/nextjs";
import MainNavBar from "@/components/MainNavBar";
import { Kirang_Haerang } from "next/font/google";
import type { Metadata } from "next";
import NavUser from "@/components/navs/NavUser";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import AppIntro from "@/components/AppIntro";
import appIntroStyles from "@/components/AppIntro.module.css";
import Providers from "./providers";
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
  aside,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  aside: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <Providers>
          <body
            className={`font-mono ${kiraHareng.variable} ${appIntroStyles.AppIntroBody} text-neutral-300`}
          >
            <AppIntro />
            <div id="root" className="md:overflow-hidden">
              <MainNavBar />
              <header className="p-2">
                <NavUser />
                <nav className="flex gap-2 text-sm">
                  <Link
                    href="/about"
                    className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wide"
                    scroll={false}
                  >
                    About
                  </Link>
                  <Link
                    href="/newsletter"
                    className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wider"
                    scroll={false}
                  >
                    Newsletter
                  </Link>
                </nav>
              </header>
              <main className="p-3 mb-4 md:p-6 limited-width overflow-y-auto bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900">
                {children}
                {modal}
              </main>
              {aside}
            </div>
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
