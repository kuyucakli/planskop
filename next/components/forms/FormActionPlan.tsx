"use client"

import { InsertActionPlan, UpdateActionPlan } from "@/db/schema";
import { useActionState, useState } from "react";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { EMPTY_FORM_STATE, FormState } from "@/lib/utils";
import FormComboBox from "./FormComboBox";
import { FieldError } from "./FormFieldError";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import { SubmitButton } from "./SubmitButton";
import { DATA_HABIT_PRESETS_300 } from "@/data/habit-presets-300";



export function FormActionPlan(props: InsertActionPlan | UpdateActionPlan | {}) {

    const [formState, formAction] = useActionState(createActionPlan, EMPTY_FORM_STATE);

    const noScriptFallback = useToastMessage(formState);
    const formRef = useFormReset(formState);

    const [actionSlots, setActionSlots] = useState([{ id: crypto.randomUUID(), title: "", description: "" }]);

    return (


        <form
            ref={formRef}
            action={formAction}
        >

            <section>
                <h2 className="text-xl">
                    Add an action slot for a lovely day:
                </h2>
            </section>

            {/* <HourlyRoutinesChart routines={[]} /> */}

            {
                actionSlots.map((a, index) => (
                    <ActionSlotFieldset key={index} title="" description="" formState={formState} id={a.id} />
                ))
            }


            <button type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded" onClick={() => { }}>
                + Add another action
            </button>


            <input type="hidden" name="userId" value={-1} />
            {'id' in props && props.id && (
                <input type="hidden" name="id" value={props.id} />
            )}

            {/* <InputText
                name="title"
                defaultValue={'title' in props ? props.title : ''} formState={formState}
                autoComplete="family-name"
            /> */}

            {/* <FormFieldsTimePlanning
                dtstart={'dtstart' in props ? props.dtstart : undefined}
                until={'until' in props ? props.until : undefined}
                rrule={'rrule' in props ? props.rrule : undefined}
                timezone={'timezone' in props ? props.timezone : undefined}
                remind={'remind' in props ? props.remind : undefined}
            /> */}
            <SubmitButton label={'id' in props && props.id ? "Update" : "Save"} loadingLabel="Pending..." />

            {noScriptFallback}
        </form>
    );
}


const ActionSlotFieldset = ({ id, title, description, formState }: { id: number, title: string, description: string, formState: FormState }) => {
    return (
        <fieldset style={{ backgroundColor: "pink" }} className="flex flex-row  flex-wrap rounded-lg p-6 m-2">
            I can
            <FormComboBox name="title"
                defaultValue={title}
                className="basis-full"
                options={DATA_HABIT_PRESETS_300}
                formState={formState}
                required={true}
                placeholder="swim"

            />


            <FormComboBox name="at"
                defaultValue={"12:00"}
                className="basis-full"
                options={["12:00", "12:10", "12:20"]}
                formState={formState}
                required={true}
                placeholder="At"

            />
            <FormComboBox name="for"
                defaultValue={"Half an hour"}
                className="basis-full"
                options={["One hour", "Fifteen Minutes", "12:20"]}
                formState={formState}
                required={true}
                placeholder="For"

            />

            {/* <label htmlFor="startTime" className="flex">at <input type="time" name="startTime" step="900" /></label>
            <Duration /> */}
            <label hidden>
                <span>Content</span>
                <textarea
                    name="content"
                    id="content"
                    // required
                    // minLength={10}
                    defaultValue={description}
                    placeholder="content"

                />
                <FieldError formState={formState} name="content" />
            </label>
            <button>delete</button>
        </fieldset>
    )
}


const Duration = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(10);

    const handleHourChange = (val: number) => {

        if (isNaN(val)) {
            setHours(0);

        } else if (val > 6) {
            setHours(6);
        } else {
            setHours(val);
        }

        if ((isNaN(val) || val == 0) && minutes == 0) {
            setMinutes(10);
        }

    }

    const handleMinuteChange = (val: number) => {

        if (isNaN(val)) {
            setMinutes(10);
        }
        else if (val === 60 && hours < 6) {
            setHours(hours + 1);
            setMinutes(0);
        }
        else if (val < 0 && hours > 0) {
            setHours(hours - 1);
            setMinutes(50);
        } else if (val > 50 && hours < 6) {
            setHours(hours + Math.floor(val / 60));
            setMinutes(customRound(val) % 60);
        } else {
            setMinutes(val === 0 && hours === 0 ? 10 : customRound(val));
        }

    }

    function customRound(n: number) {
        if (n < 10) return n;
        return Math.floor(n / 10) * 10;
    }

    return (
        <div className="flex">
            for
            {hours > 0 &&
                <label htmlFor="duration" className="flex"> <input type="number" step="1" min="0" max="6" name="duration" value={hours} onChange={(e) => handleHourChange(parseInt(e.target.value))} /> hours</label>
            }

            <label htmlFor="duration"><input type="number" step="10" min="-10" max="60" name="duration" value={minutes} onChange={(e) => {

                handleMinuteChange(parseInt(e.target.value))
            }} /> minutes</label>
        </div>
    )
}