import { Metadata } from "next";
import { FormDailyPlan } from "@/components/forms/FormDailyPlan";
import { ReactNode } from "react";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";
import { FormDelete } from "@/components/forms/FormDelete";

export const metadata: Metadata = {
    title: "I want to fill my day with...",
};

async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {


    let actionPlans: SelectActionPlan[] | undefined;
    const actionPlanId = (await searchParams).actionPlanId;



    if (actionPlanId) {
        actionPlans = await getActionPlan(Number(actionPlanId));
    }



    return (
        <>
            <h1 className="font-kira-hareng text-6xl text-center mb-12">{metadata.title as ReactNode}</h1>
            {
                actionPlanId && actionPlans && (
                    <>
                        <FormDailyPlan  {...actionPlans[0]} />
                        <FormDelete id={actionPlans[0]?.id} />
                    </>

                )


            }

            {!actionPlanId && <FormDailyPlan />}

        </>
    )
}

export default Page;