import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { deleteActionPlan } from "@/lib/actions";
import { FormDelete } from "@/components/forms/FormDelete";

export const metadata: Metadata = {
    title: "😎 My Habits",
};


export default async function Page({ searchParams }: {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}) {

    const { userId, sessionClaims } = await auth()
    let content;
    if (userId && sessionClaims) {
        content = await getActionPlans(userId);
    }



    return (
        <>
            <h1 className="text-6xl font-kira-hareng">{metadata.title as ReactNode}</h1>

            <section className="mt-6">
                <h1 className="text-2xl">Your Daily Plans:</h1>
                <ul>
                    {content?.map(c => {

                        return (
                            <li key={c.id}>
                                <h2>
                                    <Link href={`/planner/?actionPlanId=${c.id}`}>{c.title}</Link>
                                </h2>
                                <p>{c.repeat}</p>
                                <ul>
                                    {c.slots.map((s, index) => <li key={index}>{s.duration}, {s.at}, {s.title}</li>)}
                                </ul>
                                <FormDelete id={c.id} />

                            </li>
                        )

                    })}


                </ul>
            </section>

        </>
    )
}