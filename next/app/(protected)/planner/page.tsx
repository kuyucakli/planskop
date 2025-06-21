import { Metadata } from "next";
import { FormActionPlan } from "@/components/forms/FormActionPlan";
import { ReactNode } from "react";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";


export const metadata: Metadata = {
    title: "😎 I want to fill my day with...",
};

async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {


    let actionPlanRes: SelectActionPlan[] | undefined;
    const actionPlanId = (await searchParams).actionPlanId;

    if (actionPlanId) {

        actionPlanRes = await getActionPlan(Number(actionPlanId));

    }


    return (
        <>
            <h1 className="font-kira-hareng text-6xl">{metadata.title as ReactNode}</h1>
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

export default Page;