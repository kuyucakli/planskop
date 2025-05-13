import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import NavUser from "@/components/navs/NavUser";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import "./globals.css";

const robotoFlex = Roboto_Flex({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planskop",
  description: "Welcome to Planskop – Your Personal Guide to Building Better Habits",
};

export default async function RootLayout({
  children,


}: Readonly<{
  children: React.ReactNode;

}>) {

  let { userId } = await auth();


  console.log(userId)



  return (

    <ClerkProvider>
      <html lang="en" >
        <head>
          <link rel="icon" href="/logo.svg" />
        </head>
        <body className={`${robotoFlex.className}`}>
          <div id="root">
            <Header />
            <header className="p-2">
              <Logo onlyPictogram={!!userId} />
              <form>
                <input type="text" name="search" id="search" placeholder="search" />
              </form>
              <NavUser />
            </header>
            <main className="limited-width">

              {children}

            </main>
            <aside>
              <Card>
                <h2 className="title-lg">Famous Routines</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quaerat nesciunt harum in vero quas, odio hic perspiciatis facere fugit.</p>
              </Card>

              <Card>
                <h2 className="title-lg">Journey</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quaerat nesciunt harum in vero quas, odio hic perspiciatis facere fugit.</p>
              </Card>
            </aside>
          </div>
        </body>
      </html>
    </ClerkProvider>

  );
}
