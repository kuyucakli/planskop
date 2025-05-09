import { Metadata } from "next";
import { FormActionPlan } from "@/app/ui/FormActionPlan";
import { ReactNode } from "react";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";


export const metadata: Metadata = {
    title: "😎 Planner, I've a plan...",
};

export default async function Page({ searchParams }: { searchParams: { actionPlanId: number } }) {


    let actionPlanRes: SelectActionPlan[] | undefined;

    if (searchParams.actionPlanId) {

        actionPlanRes = await getActionPlan(searchParams.actionPlanId);

    }


    return (
        <>
            <h1 >{metadata.title as ReactNode}</h1>
            {
                actionPlanRes
                    ?
                    <FormActionPlan  {...actionPlanRes[0]} />
                    :
                    <FormActionPlan />
            }

        </>
    )
}