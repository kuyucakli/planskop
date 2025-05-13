"use client"

import { InsertActionPlan, UpdateActionPlan } from "@/db/schema";
import { useActionState } from "react";
import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { SubmitButton } from "./SubmitButton";
import { FieldError } from "./FormFieldError";
import { EMPTY_FORM_STATE } from "@/lib/utils";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";



export function FormActionPlan(props: InsertActionPlan | UpdateActionPlan | {}) {

    const [formState, formAction, isPending] = useActionState(createActionPlan, EMPTY_FORM_STATE);

    const noScriptFallback = useToastMessage(formState);
    const formRef = useFormReset(formState);

    return (

        <form
            ref={formRef}
            action={formAction}
        >
            {JSON.stringify(formState)}
            <input type="hidden" name="userId" value={-1} />
            {'id' in props && props.id && (
                <input type="hidden" name="id" value={props.id} />
            )}
            <label style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <span>Title</span>
                <input
                    type="text"
                    name="title"
                    id="title"
                    // required
                    // min={2}
                    defaultValue={'title' in props ? props.title : ''}
                    placeholder="title"
                />
                <FieldError formState={formState} name="title" />
            </label>
            <label>
                <span>Content</span>
                <textarea
                    name="content"
                    id="content"
                    // required
                    // minLength={10}
                    defaultValue={'content' in props ? props.content : ''}
                    placeholder="content"
                />
                <FieldError formState={formState} name="content" />
            </label>
            <FormFieldsTimePlanning
                dtstart={'dtstart' in props ? props.dtstart : undefined}
                until={'until' in props ? props.until : undefined}
                rrule={'rrule' in props ? props.rrule : undefined}
                timezone={'timezone' in props ? props.timezone : undefined}
                remind={'remind' in props ? props.remind : undefined}
            />
            <SubmitButton label={'id' in props && props.id ? "Update" : "Save"} loadingLabel="Pending..." />

            {noScriptFallback}
        </form>
    );
}


