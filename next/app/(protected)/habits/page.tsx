import { getActionPlans } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { FormDelete } from "@/components/forms/FormDelete";
import { HabitCalendar } from "@/components/HabitCalendar";
import { IconEdit } from "@/components/Icons";





export const metadata: Metadata = {
    title: "My Daily Plans",
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

                <ul>
                    {content?.map(c => {

                        return (
                            <li key={c.id}>
                                <h2 className="text-3xl">
                                    <Link href={`/planner/?actionPlanId=${c.id}`}>
                                    {c.title}
                                    <IconEdit/>
                                    </Link>
                                </h2>
                                <p>Starting from, {new Date(c.dtstart).toLocaleDateString("en-US", { year: "numeric", month: "long", weekday: "long", day: "numeric", })}</p>
                                <p>For {c.repeat}:</p>

                                <HabitCalendar dailyPlan={c} />
                                
                                <FormDelete id={c.id} />
                            </li>
                        )

                    })}


                </ul>

            </section>

        </>
    )
}