"use client";

import {
    ALLOWED_DURATIONS,
    ALLOWED_TIMES,
    dailyActionsFormSchema,
    DailyActionSlot,
    InsertActionPlan,
    UpdateActionPlan,
} from "@/db/schema";
import { ChartDailyActionSlots } from "@/components/charts";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { DATA_I_CAN_ACTIONS } from "@/data";
import { EMPTY_FORM_STATE, FormState, fromErrorToFormState, parseFormDataToNestedObject, parseSlotKey, toFormState } from "@/lib/utils";
import FormComboBox from "./FormComboBox";
import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import "./Form.css";
import { FieldError } from "./FormFieldError";
import { InputText } from "./Inputs";
import { SubmitButton } from "./SubmitButton";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import usePrevious from "@/hooks/usePreviousValue";
import { useActionState, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ToggleButton } from "../Buttons";

export function FormDailyPlan(props: InsertActionPlan | UpdateActionPlan | {}) {
    const { user } = useUser();
    const [formClientState, setFormClientState] =
        useState<FormState>(EMPTY_FORM_STATE);
    const formTypeAction = "id" in props ? updateActionPlan : createActionPlan
    const [formState, formAction] = useActionState(
        formTypeAction,
        EMPTY_FORM_STATE
    );


    const noScriptFallback = useToastMessage(formState);
    const formRef = useFormReset(formState);
    const disableSaveButton =
        formClientState.status !== "SUCCESS";

    const validateSlots = () => {
        if (!formRef.current) return false;

        try {
            const formData = new FormData(formRef.current);
            const flattenedFormData = parseFormDataToNestedObject(formData);
            const result = dailyActionsFormSchema.parse(flattenedFormData);
            setFormClientState(toFormState("SUCCESS", ""));
        } catch (err) {
            setFormClientState(fromErrorToFormState(err));
        }
    };

    return (
        <form
            ref={formRef}
            action={formAction}
            onChange={() => {
                validateSlots();
            }}
            className="flex flex-col gap-y-8 text-sm max-w-3xl mx-auto"
        >
            <input type="hidden" name="userId" defaultValue={user?.id} />

            {"id" in props && props.id && (
                <input type="hidden" name="id" defaultValue={props.id} />
            )}

            <InputText
                id="title"
                name="title"
                className="floating-label w-full"
                formState={
                    formClientState.status == "ERROR" ? formClientState : formState
                }
                defaultValue={"title" in props ? props.title : ""}
                placeholder=""
            />


            <ActionSlotList
                formState={
                    formClientState.status == "ERROR" ? formClientState : formState
                }
            />

            <FormFieldsTimePlanning formState={formClientState.status == "ERROR" ? formClientState : formState} />

            <ToggleButton id="isPublic" label="Make my daily plan public" formState={formClientState.status == "ERROR" ? formClientState : formState} />

            <footer className="text-center p-8 pb-16" >
                <SubmitButton
                    className="w-full"
                    disabled={disableSaveButton}
                    label={"id" in props && props.id ? "Update" : "Save"}
                    loadingLabel="Pending..."

                />
            </footer>

            {noScriptFallback}
        </form>
    );
}

const ActionSlotList = ({ formState }: { formState: FormState }) => {

    const [actionSlots, setActionSlots] = useState([{ id: "0" }]);

    const handleAddSlot = () => {
        setActionSlots([...actionSlots, { id: actionSlots.length + "" }]);
    };

    const handleDeleteSlot = (id: string) => {

        setActionSlots(actionSlots.filter((a) => a.id != id));
    };

    const updateSlot = (slotKey: string, value: string) => {
        const parsedSlotKey = parseSlotKey(slotKey);
        if (!parsedSlotKey) return;

        const updated = actionSlots.map((s) => {
            if (s.id == parsedSlotKey.index) {
                return { ...s, [parsedSlotKey.field]: value }
            }
            return s;
        })

        setActionSlots(updated);

    }

    const prevActionSlotCount = usePrevious(actionSlots.length);
    const disableAddMoreButton =
        prevActionSlotCount != actionSlots.length ||
        actionSlots.length >= 5 ||
        formState.status == "UNSET" ||
        !!formState.fieldErrors["slots"];

    return (
        <div className="border-y-1 border-y-gray-500 py-8 flex flex-col gap-y-4" onChange={(e) => {
            const target = e.target;
            if (!(target instanceof HTMLInputElement)) return;
            const elId = target.id;
            updateSlot(elId, target.value);
        }}>


            <h2 className="text-md">Add daily actions:</h2>

            <input type="text" id="slots" name="slots" readOnly hidden defaultValue={JSON.stringify(actionSlots)} />

            <div className="relative h-24">
                <div className="absolute opacity-80 w-full">
                    <ChartDailyActionSlots actionSlots={actionSlots as DailyActionSlot[]} />
                </div>
                <div className="absolute w-full">
                    <ChartDailyActionSlots interval={60} showContent />
                </div>
            </div>

            {actionSlots.map((a, index) => (
                <ActionSlotFieldset
                    key={index}
                    title=""
                    description=""
                    formState={formState}
                    id={index + ""}
                    deleteSlot={handleDeleteSlot}
                    showBtnDelete={actionSlots.length > 1}
                />
            ))}

            <button
                disabled={disableAddMoreButton}
                type="button"
                className="bg-transparent hover:bg-bermuda-500  text-sm hover:text-white py-2 px-4 border-0  hover:border-transparent rounded"
                onClick={handleAddSlot}
            >
                + Add another action slot
            </button>
        </div>
    );
};

const ActionSlotFieldset = ({
    id,
    title,
    description,
    formState,
    deleteSlot,
    showBtnDelete,
}: {
    id: string;
    title: string;
    description: string;
    showBtnDelete: boolean;
    formState: FormState;
    deleteSlot: (id: string) => void;
}) => {
    const [showDescription, setShowDescription] = useState(false);

    return (
        <fieldset
            className="flex flex-col gap-x-4  rounded-lg p-6 m-2"
        >
            <div className="flex flex-row gap-x-4">
                <FormComboBox
                    name={`slots[${id}].title`}
                    label="I can"
                    className=" border-0 border-b-2 rounded-none block"
                    options={DATA_I_CAN_ACTIONS}
                    formState={formState}
                    required={true}
                    placeholder="swim"
                />
                <FormComboBox
                    name={`slots[${id}].at`}
                    label="at"
                    className=" border-0 border-b-2 rounded-none block"
                    options={ALLOWED_TIMES}
                    formState={formState}
                    required={true}
                    placeholder="12:00"
                />
                <FormComboBox
                    name={`slots[${id}].for`}
                    label="for"
                    className=" border-0 border-b-2 rounded-none block"
                    options={ALLOWED_DURATIONS}
                    formState={formState}
                    required={true}
                    placeholder="One Hour"
                />
            </div>

            <label>
                <button
                    type="button"
                    onClick={() => {
                        setShowDescription(!showDescription);
                    }}
                    className="flex items-center gap-x-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                    </svg>
                </button>
                <textarea
                    name={`slots[${id}].description`}
                    id="content"
                    defaultValue={description}
                    placeholder="Description"
                    hidden={!showDescription}
                />
                <FieldError formState={formState} name="description" />
            </label>
            {showBtnDelete && (
                <button
                    type="button"
                    onClick={(e) => {
                        deleteSlot(id);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            )}
        </fieldset>
    );
};




