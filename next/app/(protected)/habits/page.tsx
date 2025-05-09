import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "😎 My Habits",
};


export default function Page() {
    return (
        <>
            <h1>{metadata.title as ReactNode}</h1>

        </>
    )
}