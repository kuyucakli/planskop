"use client";

import { ActionSlotList } from "./ActionSlotFieldsetList";
import {
  dailyActionsFormSchema,
  dailyActionsUpdateFormSchema,
  InsertDailyPlan,
  UpdateDailyPlan,
} from "@/db/schemas/daily-plans-schema";
import { createDailyPlan, updateDailyPlan } from "../../lib/actions";
import {
  EMPTY_FORM_STATE,
  FormState,
  fromErrorToFormState,
  parseFormDataToNestedObject,
  toFormState,
} from "@/lib/utils";

import FormFieldsTimePlanning from "./FormFieldsTimePlanning";
import "./Form.css";
import { InputText } from "./Inputs";

import { SubmitButton } from "./SubmitButton";
import { sortSlots } from "@/lib/utils/dailyPlan";
import { ToggleButton } from "../Buttons";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useFormReset } from "@/hooks/useFormReset";
import { PropsWithChildren, useActionState, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ZodError } from "zod";

export function FormDailyPlan(
  props: (InsertDailyPlan | UpdateDailyPlan | {}) & PropsWithChildren
) {
  const { user } = useUser();
  const [formClientState, setFormClientState] =
    useState<FormState>(EMPTY_FORM_STATE);
  const formType = "id" in props ? updateDailyPlan : createDailyPlan;
  const [formState, formAction] = useActionState(formType, EMPTY_FORM_STATE);
  const noScriptFallback = useToastMessage(formState);
  const formRef = useFormReset(formState);
  const disableSaveButton = formClientState.status !== "SUCCESS";

  const validateSlots = () => {
    if (!formRef.current) return false;
    const formData = new FormData(formRef.current);
    const slots = JSON.parse((formData.get("slots") as string) || "");

    const flattenedFormData = parseFormDataToNestedObject(formData);
    try {
      if ("id" in props) {
        dailyActionsUpdateFormSchema.parse(flattenedFormData);
      } else {
        dailyActionsFormSchema.parse(flattenedFormData);
      }
      setFormClientState(toFormState("SUCCESS", ""));
    } catch (err) {
      if (err instanceof ZodError) {
        const remappedError = remapPaths(err, (path) => {
          if (path[0] === "slots" && typeof path[1] === "number") {
            const index = path[1] as number;

            const slotId = slots[index]?.id ?? `slot-${index}`;
            return ["slots", slotId, ...path.slice(2)];
          }
          return path;
        });

        setFormClientState(fromErrorToFormState(remappedError));
      } else {
        setFormClientState(fromErrorToFormState(err));
      }
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

        {props?.children}

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

function remapPaths(
  error: ZodError,
  mapper: (path: PropertyKey[]) => PropertyKey[]
) {
  return new ZodError(
    error.issues.map((issue) => ({
      ...issue,
      path: mapper(issue.path),
    }))
  );
}
