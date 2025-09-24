"use server";

import {
  InsertActionPlan,
  REMIND_AT,
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
import {
  FormState,
  fromErrorToFormState,
  parseFormDataToNestedObject,
} from "./utils";
import { cancelReminder, scheduleReminder } from "./reminders/scheduler";

import { getDetailedDailyPlanTimes } from "./utils/dailyPlan";
import { ReminderBody } from "./definitions";

export async function createActionPlan(
  prevState: FormState,
  formData: FormData
) {
  try {
    const flattenedFormData = formDataToObject(formData) as InsertActionPlan &
      Pick<ReminderBody, "userFullName" | "userEmail">;
    insertActionPlanSchema.parse(flattenedFormData);
    const res = await dbCreateActionPlan(flattenedFormData);

    const {
      startDate,
      repeat,
      timezone,
      remind,
      slots,
      userEmail,
      userFullName,
    } = flattenedFormData;
    const { startMs, endMs, reminderHourUtc } = getDetailedDailyPlanTimes(
      startDate!,
      repeat,
      timezone,
      remind
    );

    if (res.data?.id && reminderHourUtc && remind !== REMIND_AT.NO_REMIND) {
      await scheduleReminder({
        dailyPlanId: res.data.id,
        startUtcMs: startMs,
        endUtcMs: endMs,
        dailySlots: slots,
        userEmail: userEmail,
        userFullName: userFullName,
        reminderHourUtc,
        remind,
      });
    }
  } catch (err) {
    return fromErrorToFormState(err);
  }
  revalidatePath("/dashboard");
  revalidatePath("/planner");
  revalidatePath("/daily-plans", "layout");
  redirect("/daily-plans?succes=" + "success message");
}

export async function updateActionPlan(
  prevState: FormState,
  formData: FormData
) {
  try {
    const flattenedFormData = parseFormDataToNestedObject(
      formData
    ) as UpdateActionPlan & Pick<ReminderBody, "userFullName" | "userEmail">;
    updateActionPlanSchema.parse(flattenedFormData);
    const res = await dbUpdateActionPlan(flattenedFormData);

    const {
      id,
      startDate,
      repeat,
      timezone,
      remind,
      slots,
      userEmail,
      userFullName,
    } = flattenedFormData;
    const { startMs, endMs, reminderHourUtc } = getDetailedDailyPlanTimes(
      startDate!,
      repeat,
      timezone,
      remind
    );

    if (remind === REMIND_AT.NO_REMIND) {
      await cancelReminder(id);
    } else if (reminderHourUtc) {
      await scheduleReminder({
        dailyPlanId: id,
        startUtcMs: startMs,
        endUtcMs: endMs,
        dailySlots: slots,
        userEmail: userEmail,
        userFullName: userFullName,
        reminderHourUtc,
        remind,
      });
    }
  } catch (err) {
    return fromErrorToFormState(err);
  }
  revalidatePath("/planner");
  redirect("/daily-plans?succes=" + "success message");
}

export async function deleteActionPlan(formData: FormData) {
  const id = Number(formData.get("id"));
  try {
    if (Number.isNaN(id) || id < 0) {
      throw new Error("Invalid Id");
    }
    await dbDeleteActionPlan(id);
    await cancelReminder(id);
  } catch (err) {
    return;
  }
  revalidatePath("/daily-plans", "layout");
  redirect("/daily-plans?deleted=true");
}

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}
