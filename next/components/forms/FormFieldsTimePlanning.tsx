"use client";

import { useWasm } from "@/hooks/useWasm";
import { PropsWithChildren } from "react";
import { WeekDays } from "@/lib/definitions";
import { REMIND_AT, REPEAT_DURATIONS } from "@/lib/definitions";
import { SelectDailyPlan } from "@/db/schemas/daily-plans-schema";
import FormComboBox from "./FormComboBox";
import { FormState } from "@/lib/utils";
import { FieldError } from "./FormFieldError";

const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;

export default function FormFieldsTimePlanning({
  startDate,
  timezone,
  repeat,
  remind,
  formState,
}: PropsWithChildren<Partial<SelectDailyPlan>> & { formState: FormState }) {
  const { get_timezones, get_local_timezone } = useWasm() || {};

  const userSystemTimezone = get_local_timezone
    ? get_local_timezone()
    : undefined;

  if (!get_timezones) return "loading";

  return (
    <>
      <label htmlFor="startDate">
        Start Daily Plan At:
        <input
          type="date"
          id="startDate"
          name="startDate"
          min={
            startDate
              ? new Date(startDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          defaultValue={startDate || ""}
        ></input>
        <FieldError name="startDate" formState={formState} />
      </label>

      <FormComboBox
        name={`repeat`}
        label="Repeat For"
        defaultValue={repeat || ""}
        className="basis-full border-0 border-b-2 rounded-none"
        options={REPEAT_DURATIONS}
        formState={formState}
        required={true}
        placeholder="1 week"
      />

      <label>
        Remind Me:
        <select
          id="remind"
          name="remind"
          defaultValue={remind || REMIND_AT.NO_REMIND}
        >
          {Object.values(REMIND_AT).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <FieldError name="remind" formState={formState} />
      </label>

      <label>
        Timezone:
        <select
          id="timezone"
          name="timezone"
          defaultValue={timezone || userSystemTimezone}
        >
          <option value={userSystemTimezone}>{userSystemTimezone}</option>

          {get_timezones()
            .split(", ")
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
      </label>
    </>
  );
}
