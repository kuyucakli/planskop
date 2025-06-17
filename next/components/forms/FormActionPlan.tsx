"use client"

import { InsertActionPlan, UpdateActionPlan } from "@/db/schema";
import { useActionState } from "react";
import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { FieldError } from "./FormFieldError";
import { EMPTY_FORM_STATE } from "@/lib/utils";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import { InputText } from "./Inputs";
import { SubmitButton } from "./SubmitButton";
import HourlyRoutinesChart from "../HourlyRoutinesChart";
import { DATA_HABIT_PRESETS_300 } from "@/data/habit-presets-300";



export function FormActionPlan(props: InsertActionPlan | UpdateActionPlan | {}) {

    const [formState, formAction] = useActionState(createActionPlan, EMPTY_FORM_STATE);

    const noScriptFallback = useToastMessage(formState);
    const formRef = useFormReset(formState);

    return (


        <form
            ref={formRef}
            action={formAction}
        >

            <HourlyRoutinesChart routines={[]} />

            <select>
                <option value="">Select a habit preset</option>
                {DATA_HABIT_PRESETS_300.map((preset: string, index: number) => (
                    <option key={index} value={preset}>
                        {preset}
                    </option>
                ))}
            </select>

            <input type="hidden" name="userId" value={-1} />
            {'id' in props && props.id && (
                <input type="hidden" name="id" value={props.id} />
            )}
            <InputText
                name="title"
                defaultValue={'title' in props ? props.title : ''} formState={formState}
                autoComplete="family-name"
            />
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


