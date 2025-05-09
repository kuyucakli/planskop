import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import { ThemeContext, ThemeContextProvider } from "@/context/ThemeContext";
import "./globals.css";
import { use } from "react";



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
  // async function handleSignOut() {
  //   'use server'
  //   await signOut();
  // }



  return (


    <html lang="en" >
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className={`${robotoFlex.className}`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>


  );
}
