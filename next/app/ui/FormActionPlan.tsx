
import { InsertActionPlan } from "@/db/schema";
import { PropsWithChildren } from "react";
import { auth } from "@/auth";
import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import { createActionPlan, updateActionPlan } from "../lib/actions";

export async function FormActionPlan({
    userId,
    id,
    title,
    content,
    dtstart,
    until,
    rrule,
    timezone,
    remind,
}: PropsWithChildren<InsertActionPlan>) {


    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    return (

        <form action={id ? updateActionPlan : createActionPlan} >
            <input type="hidden" name="userId" value={userId} />
            {id && <input type="hidden" name="id" value={id} />}
            <label style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <span >Title</span>
                <input type="text" name="title" id="title" required min={2} defaultValue={title} placeholder="title" />
            </label>
            <label>
                <span>Content</span>
                <textarea name="content" id="content" required minLength={10} defaultValue={content} placeholder="content"></textarea>
            </label>

            <FormFieldsTimePlanning {...{ dtstart, until, rrule, timezone, remind }} />

            <button className="btn-type-1 body-md" type="submit">
                {id ? "Update" : "Save"}
            </button>
        </form >
    );
}


