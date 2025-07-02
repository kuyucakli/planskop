"use client";

import { useWasm } from "@/hooks/useWasm";
import { ChangeEvent, PropsWithChildren, useState } from "react";
import { WeekDays, Rrules, Frequency } from "@/lib/definitions";
import { REMIND_AT, REPEAT_DURATIONS, SelectActionPlan } from "@/db/schema";
import FormComboBox from "./FormComboBox";
import { FormState } from "@/lib/utils";


const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;

export default function FormFieldsTimePlanning({
    dtstart,
    until,
    rrule,
    timezone,
    remind,
    formState
}: PropsWithChildren<Partial<SelectActionPlan>> & { formState: FormState }) {
    const { get_local_now, get_timezones, get_local_timezone } = useWasm() || {};

    const countMatch = rrule?.match(/COUNT=(\d+)/);
    const intervalMatch = rrule?.match(/INTERVAL=(\d+)/);
    const byweekdayMatch = rrule?.match(/BYDAY=([A-Z,]+);/);

    const [rrules, setRrules] = useState<Rrules>({
        dtstart: dtstart || "",
        frequency: byweekdayMatch ? Frequency.Weekly : Frequency.Daily,
        until: until || "",
        count: countMatch ? countMatch[1] : "",
        interval: intervalMatch ? intervalMatch[1] : "",
        byweekday: byweekdayMatch ? byweekdayMatch[1].split(",") as WeekDays[] : [getWeekdayName()],
    });

    const userSystemTimezone = get_local_timezone ? get_local_timezone() : undefined;

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        let valuesObj;

        if (name == "dtstart") {
            valuesObj = {
                ...rrules,
                dtstart: value,
                byweekday: [getWeekdayName(value)],
            };
        } else if (name == "byweekday") {
            const byweekday =
                rrules.byweekday.indexOf(value as WeekDays) === -1
                    ? [...rrules.byweekday, value as WeekDays]
                    : rrules.byweekday.filter((d) => d !== value);
            valuesObj = { ...rrules, byweekday };
        } else {
            valuesObj = { ...rrules, [name]: value };
        }
        setRrules(valuesObj);
    };


    if (!get_local_now || !get_timezones) return "loading";


    return (
        <>

            <FormComboBox
                name={`repeatDuration`}
                label="Repeat For"
                className="basis-full border-0 border-b-2 rounded-none"
                options={REPEAT_DURATIONS}
                formState={formState}
                required={true}
                placeholder="1 week"
            />


            <FormComboBox
                name={`remind`}
                label="Remind At"
                className="basis-full border-0 border-b-2 rounded-none"
                options={REMIND_AT}
                formState={formState}
                required={true}
                placeholder="Morning"
            />

            <label htmlFor="startDailyPlan">Start Daily Plan At:
                <input type="date" id="startDailyPlan" name="startDailyPlan"></input>
            </label>


            {/*Timezone */}
            <label>
                Timezone:

                <select id="timezone" name="timezone" defaultValue={timezone || userSystemTimezone} >

                    <option value={userSystemTimezone}>{userSystemTimezone}</option>

                    {get_timezones().split(", ").map((t) => (

                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}

                </select>
            </label>


            {/* Hidden Fields */}
            <input type="text" id="next_remind_at_time" name="next_remind_at_time" hidden />
            {/* <input type="text" readOnly hidden value={rrule} /> */}


        </>
    );
}



function getWeekdayName(dateStr?: string) {
    const dayIndex = new Date(dateStr || Date.now()).getDay();
    return WeekDays[weekDaysKeys[(dayIndex + 6) % 7]];
}
