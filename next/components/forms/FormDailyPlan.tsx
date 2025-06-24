"use client"

import { ALLOWED_DURATIONS, ALLOWED_TIMES, dailyActionsFormSchema, dailyActionSlotSchema, InsertActionPlan, UpdateActionPlan } from "@/db/schema";
import { useActionState, useState } from "react";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { DATA_I_CAN_ACTIONS } from "@/data";
import { EMPTY_FORM_STATE, FormState, fromErrorToFormState } from "@/lib/utils";
import FormComboBox from "./FormComboBox";
import { FieldError } from "./FormFieldError";
import HourlyRoutinesChart from "../HourlyRoutinesChart";
import { SubmitButton } from "./SubmitButton";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import usePrevious from "@/hooks/usePreviousValue";



export function FormDailyPlan(props: InsertActionPlan | UpdateActionPlan | {}) {

    const [formState, formAction] = useActionState(createActionPlan, EMPTY_FORM_STATE);
    const [formClientState, setFormClientState] = useState<FormState>(EMPTY_FORM_STATE);

    const noScriptFallback = useToastMessage(formState);
    const formRef = useFormReset(formState);





    const validateSlots = () => {
        if (!formRef.current) return false;
        try {
            const flattenedFormData = parseFormDataToNestedObject(new FormData(formRef.current));
            const result = dailyActionsFormSchema.parse(flattenedFormData);
        } catch (err) {
            setFormClientState(fromErrorToFormState(err));
        }
    }

    return (
        <form
            ref={formRef}
            action={formAction}
            onChange={(e) => { validateSlots() }}
        >
            <div>
                <input type="hidden" name="userId" value={-1} />
                {'id' in props && props.id && (
                    <input type="hidden" name="id" value={props.id} />
                )}

                <ActionSlotList formState={formClientState.status == "ERROR" ? formClientState : formState} />


            </div>
            <footer>
                <SubmitButton label={'id' in props && props.id ? "Update" : "Save"} loadingLabel="Pending..." />
            </footer>

            {noScriptFallback}
        </form>
    );
}


const ActionSlotList = ({ formState }: { formState: FormState }) => {
    const EmptyActionSlot = {
        id: crypto.randomUUID(),
        title: "Swim",
        at: "",
        for: "",
        description: ""
    }

    const [actionSlots, setActionSlots] = useState([EmptyActionSlot]);

    const handleDeleteSlot = (id: string) => {
        setActionSlots(actionSlots.filter(a => a.id != id));
    }

    const prevActionSlotCount = usePrevious(actionSlots.length);
    const disableAddMoreButton = prevActionSlotCount != actionSlots.length || actionSlots.length >= 5 || formState.status == "UNSET" || !!formState.fieldErrors["slots"];


    return (
        <div>
            <HourlyRoutinesChart routines={[]} />

            <section>
                <h2 className="text-xl">
                    Add daily actions:
                </h2>
            </section>


            {
                actionSlots.map((a, index) => (
                    <ActionSlotFieldset key={index} title="" description="" formState={formState} id={index + ''} deleteSlot={handleDeleteSlot} showBtnDelete={actionSlots.length > 1} />
                ))
            }

            <button disabled={disableAddMoreButton} type="button" className="bg-transparent hover:bg-bermuda-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-gray-400 hover:border-transparent rounded" onClick={() => {
                setActionSlots([...actionSlots, EmptyActionSlot]);
            }}>
                + Add another action slot
            </button>
        </div>
    )
}

const ActionSlotFieldset = ({ id, title, description, formState, deleteSlot, showBtnDelete }: { id: string, title: string, description: string, showBtnDelete: boolean, formState: FormState, deleteSlot: (id: string) => void }
) => {
    const [showDescription, setShowDescription] = useState(false);
    return (
        <fieldset style={{ backgroundColor: "black" }} className="flex flex-col gap-x-2  rounded-lg p-6 m-2">

            <div className="flex flex-row" >
                <FormComboBox name={`slots[${id}].title`}
                    label="I can"
                    className="basis-full"
                    options={DATA_I_CAN_ACTIONS}
                    formState={formState}
                    required={true}
                    placeholder="swim"
                />
                <FormComboBox name={`slots[${id}].at`}
                    label="at"
                    className="basis-full"
                    options={ALLOWED_TIMES}
                    formState={formState}
                    required={true}
                    placeholder="12:00"

                />
                <FormComboBox name={`slots[${id}].for`}
                    label="for"
                    className="basis-full"
                    options={ALLOWED_DURATIONS}
                    formState={formState}
                    required={true}
                    placeholder="One Hour"
                />
            </div>

            <label >
                <button type="button" onClick={() => { setShowDescription(!showDescription) }} className="flex items-center gap-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>

                </button>
                <textarea
                    name={`slots[${id}].description`}
                    id="content"
                    // required
                    // minLength={10}
                    defaultValue={description}
                    placeholder="Description"
                    hidden={!showDescription}

                />
                <FieldError formState={formState} name="description" />
            </label>
            {
                showBtnDelete &&
                <button type="button" onClick={(e) => {
                    deleteSlot(id);
                }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>


                </button>
            }

        </fieldset>
    )
}




function parseFormDataToNestedObject(formData: FormData) {
    const result: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        const match = key.match(/^slots\[(\d+)\]\.(\w+)$/);
        if (!match) continue;

        const [_, indexStr, field] = match;
        const index = parseInt(indexStr);

        if (!result.slots) result.slots = [];
        if (!result.slots[index]) result.slots[index] = {};

        result.slots[index][field] = value;
    }

    return result;
}