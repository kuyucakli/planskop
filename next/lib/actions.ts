"use server";

import {
  InsertActionPlan,
  UpdateActionPlan,
  insertActionPlanSchema,
  updateActionPlanSchema,
} from "../db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  dbCreateActionPlan,
  dbDeleteActionPlan,
  dbUpdateActionPlan,
} from "@/db/queries";
import * as _wasm from "@/pkg/planskop_rust";
import { ZodSchema, z } from "zod";
import {
  FormState,
  fromErrorToFormState,
  parseFormDataToNestedObject,
} from "./utils";

export async function createActionPlan(
  prevState: FormState,
  formData: FormData
) {
  try {
    const flattenedFormData = formDataToObject(formData);
    insertActionPlanSchema.parse(flattenedFormData);
    await dbCreateActionPlan(flattenedFormData as InsertActionPlan);
  } catch (err) {
    return fromErrorToFormState(err);
  }
  revalidatePath("/dashboard");
  redirect("/habits?succes=" + "success message");
  // return toFormState('SUCCESS', 'Message created');
}

export async function updateActionPlan(
  prevState: FormState,
  formData: FormData
) {
  // const actionPlanObj = await prepareActionPlanData(formData, updateActionPlanSchema);

  try {
    const flattenedFormData = parseFormDataToNestedObject(formData);
    updateActionPlanSchema.parse(flattenedFormData);
    await dbUpdateActionPlan(flattenedFormData as UpdateActionPlan);
  } catch (err) {
    return fromErrorToFormState(err);
  }
  revalidatePath("/dashboard");
  redirect("/habits?succes=" + "success message");
  // return toFormState('SUCCESS', 'Message updated');
}

export async function deleteActionPlan(formData: FormData) {
  const id = Number(formData.get("id"));
  try {
    if (Number.isNaN(id) || id < 0) {
      throw new Error("Invalid Id");
    }
    await dbDeleteActionPlan(id);
  } catch (err) {
    return;
  }
  revalidatePath("/habits", "layout");
  redirect("/habits?deleted=true");
}

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

// Overload signatures for specific use cases
async function prepareActionPlanData<TSchema extends ZodSchema<any>>(
  formData: FormData,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  const rawObj = formDataToObject(formData);
  const actionPlanObj = schema.parse(rawObj);

  return actionPlanObj;
}
