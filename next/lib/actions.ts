"use server";

import {
  InsertDailyPlan,
  UpdateDailyPlan,
  insertDailyPlanSchema,
  updateDailyPlanSchema,
} from "../db/schemas/daily-plans-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  dbCreateDailyPlan,
  dbDeleteDailyPlan,
  dbUpdateDailyPlan,
} from "@/db/mutations/dailyPlans";
import * as _wasm from "@/pkg/planskop_rust";
import {
  FormState,
  fromErrorToFormState,
  parseFormDataToNestedObject,
} from "./utils";
import { cancelReminder, scheduleReminder } from "./reminders/scheduler";
import { getDetailedDailyPlanTimes } from "./utils/dailyPlan";
import { ReminderBody } from "./definitions";
import { REMIND_AT } from "./definitions";

async function createDailyPlan(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const flattenedFormData = formDataToObject(formData) as InsertDailyPlan &
      Pick<ReminderBody, "userFullName" | "userEmail">;
    insertDailyPlanSchema.parse(flattenedFormData);
    const res = await dbCreateDailyPlan(flattenedFormData);

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

async function updateDailyPlan(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const flattenedFormData = parseFormDataToNestedObject(
      formData
    ) as UpdateDailyPlan & Pick<ReminderBody, "userFullName" | "userEmail">;
    updateDailyPlanSchema.parse(flattenedFormData);
    const res = await dbUpdateDailyPlan(flattenedFormData);

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

async function deleteDailyPlan(formData: FormData) {
  const id = Number(formData.get("id"));
  try {
    if (Number.isNaN(id) || id < 0) {
      throw new Error("Invalid Id");
    }
    await dbDeleteDailyPlan(id);
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

export { createDailyPlan, updateDailyPlan, deleteDailyPlan, formDataToObject };
