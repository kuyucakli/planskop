import { Metadata } from "next";
import { FormDailyPlan } from "@/components/forms/FormDailyPlan";
import { ReactNode } from "react";
import { getActionPlan } from "@/db/queries";
import { SelectActionPlan } from "@/db/schema";
import { FormDelete } from "@/components/forms/FormDelete";

export const metadata: Metadata = {
  title: "I want to fill my day with...",
};

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let actionPlan: SelectActionPlan | null = null;
  const actionPlanId = (await searchParams).actionPlanId;

  if (actionPlanId) {
    const actionPlanRes = await getActionPlan(Number(actionPlanId));
    actionPlan = actionPlanRes.data;
  }

  return (
    <>
      <h1 className="font-kira-hareng text-6xl text-center mb-12">
        {metadata.title as ReactNode}
      </h1>
      {actionPlanId && actionPlan && (
        <>
          <FormDailyPlan {...actionPlan} />
          <FormDelete id={actionPlan?.id} />
        </>
      )}

      {!actionPlanId && <FormDailyPlan />}
    </>
  );
}

export default Page;
