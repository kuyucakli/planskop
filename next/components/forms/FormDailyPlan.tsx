"use client";

import {
  TIME_BASED_DURATIONS,
  ALLOWED_TIMES,
  dailyActionsFormSchema,
  DailyActionSlot,
  dailyActionsUpdateFormSchema,
  InsertActionPlan,
  UpdateActionPlan,
} from "@/db/schema";
import { ChartDailyActionSlots } from "@/components/charts";
import { createActionPlan, updateActionPlan } from "../../lib/actions";
import { DATA_I_CAN_ACTIONS } from "@/data";
import {
  EMPTY_FORM_STATE,
  FormState,
  fromErrorToFormState,
  parseFormDataToNestedObject,
  parseSlotKey,
  toFormState,
} from "@/lib/utils";
import FormComboBox from "./FormComboBox";
import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import "./Form.css";
import { FieldError } from "./FormFieldError";
import { InputText } from "./Inputs";
import { SubmitButton } from "./SubmitButton";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import { useActionState, useEffect, useRef, useState } from "react";
import usePrevious from "@/hooks/usePreviousValue";
import { useUser } from "@clerk/nextjs";
import { ToggleButton } from "../Buttons";
import { IconClose, IconInfo } from "../Icons";
import { sortSlots } from "@/lib/utils/dailyPlan";

export function FormDailyPlan(props: InsertActionPlan | UpdateActionPlan | {}) {
  const { user } = useUser();
  const [formClientState, setFormClientState] =
    useState<FormState>(EMPTY_FORM_STATE);
  const formType = "id" in props ? updateActionPlan : createActionPlan;
  const [formState, formAction] = useActionState(formType, EMPTY_FORM_STATE);
  const noScriptFallback = useToastMessage(formState);
  const formRef = useFormReset(formState);
  const disableSaveButton = formClientState.status !== "SUCCESS";

  const validateSlots = () => {
    if (!formRef.current) return false;

    try {
      const formData = new FormData(formRef.current);
      const flattenedFormData = parseFormDataToNestedObject(formData);
      if ("id" in props) {
        dailyActionsUpdateFormSchema.parse(flattenedFormData);
      } else {
        dailyActionsFormSchema.parse(flattenedFormData);
      }
      setFormClientState(toFormState("SUCCESS", ""));
    } catch (err) {
      setFormClientState(fromErrorToFormState(err));
    }
  };

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onChange={() => {
          validateSlots();
        }}
        className="flex flex-col gap-y-8 text-sm max-w-3xl mx-auto"
      >
        <input type="hidden" name="userId" defaultValue={user?.id} />

        <input
          type="hidden"
          name="userEmail"
          defaultValue={user?.emailAddresses[0]?.emailAddress}
        />
        <input
          type="hidden"
          name="userFullName"
          defaultValue={user?.fullName || user?.firstName || ""}
        />

        {"id" in props && props.id && (
          <input type="hidden" name="id" readOnly defaultValue={props.id} />
        )}

        <InputText
          id="title"
          name="title"
          className="floating-label w-full h-18 text-lg px-4"
          formState={
            formClientState.status == "ERROR" ? formClientState : formState
          }
          defaultValue={"title" in props ? props.title : ""}
          placeholder="My Summer Plan"
        />

        <ActionSlotList
          defaultValue={"slots" in props ? sortSlots(props.slots) : undefined}
          formState={
            formClientState.status == "ERROR" ? formClientState : formState
          }
        />

        <FormFieldsTimePlanning
          formState={
            formClientState.status == "ERROR" ? formClientState : formState
          }
          {...props}
        />

        <ToggleButton
          id="isPublic"
          label="Make my daily plan public"
          formState={
            formClientState.status == "ERROR" ? formClientState : formState
          }
          defaultChecked={"isPublic" in props ? !!props.isPublic : undefined}
        />

        <footer className="text-center p-8 pb-16">
          <SubmitButton
            className="w-full"
            disabled={disableSaveButton}
            label={"id" in props && props.id ? "Update" : "Save"}
            loadingLabel="Pending..."
          />
        </footer>
        {noScriptFallback}
      </form>
    </>
  );
}

const ActionSlotList = ({
  formState,
  defaultValue,
}: {
  formState: FormState;
  defaultValue?: DailyActionSlot[] | undefined;
}) => {
  const maxSlotCount = 5;
  const slotsDefault = defaultValue
    ? defaultValue
    : [{ id: "0", title: "", at: "", duration: "" }];
  const [actionSlots, setActionSlots] = useState(slotsDefault);

  const handleAddSlot = () => {
    setActionSlots([
      ...actionSlots,
      { id: actionSlots.length + "", title: "", duration: "", at: "" },
    ]);
  };

  const handleDeleteSlot = (id: string) => {
    const filtered = actionSlots.filter((a) => a.id !== id);
    setActionSlots(filtered);
  };

  const updateSlot = (slotKey: string, value: string) => {
    const parsedSlotKey = parseSlotKey(slotKey);

    if (!parsedSlotKey) return;

    const updated = actionSlots.map((s) => {
      if (s.id == parsedSlotKey.index) {
        return { ...s, [parsedSlotKey.field]: value };
      }
      return s;
    });

    setActionSlots(updated);
  };

  const disableAddMoreButton = actionSlots.length >= maxSlotCount;

  return (
    <div
      className="border-y-1 border-y-gray-500 py-8 flex flex-col gap-y-4"
      onChange={(e) => {
        const target = e.target;
        if (!(target instanceof HTMLInputElement)) return;
        const elId = target.id;
        updateSlot(elId, target.value);
      }}
    >
      <h2 className="text-md">Add daily actions:</h2>

      <input
        type="text"
        id="slots"
        name="slots"
        readOnly
        hidden
        value={JSON.stringify(actionSlots) || ""}
      />

      <div className="relative h-24">
        <div className="absolute opacity-80 w-full">
          <ChartDailyActionSlots
            actionSlots={actionSlots as DailyActionSlot[]}
          />
        </div>
        <div className="absolute w-full">
          <ChartDailyActionSlots interval={60} showContent />
        </div>
      </div>

      {actionSlots.map((a) => (
        <ActionSlotFieldset
          key={a.id}
          title={a?.title || ""}
          at={a?.at || ""}
          duration={a?.duration || ""}
          description=""
          formState={formState}
          id={a.id}
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
        {`+ Add another action slot.`}
        <span className="text-xs text-gray-100"> {`Max ${maxSlotCount}`}</span>
      </button>
    </div>
  );
};

const ActionSlotFieldset = ({
  id,
  title,
  at,
  duration,
  description,
  formState,
  deleteSlot,
  showBtnDelete,
}: {
  id: string;
  title: string;
  description: string;
  at: string;
  duration: string;
  showBtnDelete: boolean;
  formState: FormState;
  deleteSlot: (id: string) => void;
}) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <fieldset className="bg-stone-900 flex flex-col gap-2 rounded-xl p-6 ">
      <div className="flex flex-row flex-wrap gap-x-2 gap-y-8 @container">
        <FormComboBox
          name={`slots[${id}].title`}
          label="I can"
          labelClassName="flex-1 @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={DATA_I_CAN_ACTIONS}
          formState={formState}
          required={true}
          placeholder="swim"
          defaultValue={title}
        />
        <FormComboBox
          name={`slots[${id}].at`}
          label="at"
          labelClassName="flex-1  @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={ALLOWED_TIMES}
          formState={formState}
          required={true}
          placeholder="12:00"
          defaultValue={at}
        />
        <FormComboBox
          name={`slots[${id}].duration`}
          label="duration"
          labelClassName="flex-[0_1_100%]  @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={TIME_BASED_DURATIONS}
          formState={formState}
          required={true}
          placeholder="1 Hour"
          defaultValue={duration}
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
          <IconInfo
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          />
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
          className="self-end"
          onClick={(e) => {
            deleteSlot(id);
          }}
        >
          <IconClose
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#EA3323"
          />
        </button>
      )}
    </fieldset>
  );
};
