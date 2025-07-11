"use client";

import { useWasm } from "@/hooks/useWasm";
import { ChangeEvent, PropsWithChildren, useState } from "react";
import { WeekDays, Rrules, Frequency } from "@/lib/definitions";
import { REMIND_AT, REPEAT_DURATIONS, SelectActionPlan } from "@/db/schema";
import FormComboBox from "./FormComboBox";
import { FormState } from "@/lib/utils";
import { FieldError } from "./FormFieldError";


const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;

export default function
    FormFieldsTimePlanning({
        dtstart,
        timezone,
        repeat,
        remind,
        formState,


    }: PropsWithChildren<Partial<SelectActionPlan>> & { formState: FormState }) {
    const { get_local_now, get_timezones, get_local_timezone } = useWasm() || {};

    // const countMatch = rrule?.match(/COUNT=(\d+)/);
    // const intervalMatch = rrule?.match(/INTERVAL=(\d+)/);
    // const byweekdayMatch = rrule?.match(/BYDAY=([A-Z,]+);/);

    // const [rrules, setRrules] = useState<Rrules>({
    //     dtstart: dtstart || "",
    //     frequency: byweekdayMatch ? Frequency.Weekly : Frequency.Daily,
    //     until: "",
    //     count: countMatch ? countMatch[1] : "",
    //     interval: intervalMatch ? intervalMatch[1] : "",
    //     byweekday: byweekdayMatch ? byweekdayMatch[1].split(",") as WeekDays[] : [getWeekdayName()],
    // });

    const userSystemTimezone = get_local_timezone ? get_local_timezone() : undefined;



    if (!get_local_now || !get_timezones) return "loading";


    return (
        <>
            <label htmlFor="dtstart">Start Daily Plan At:
                <input type="date" id="dtstart" name="dtstart" defaultValue={dtstart || ""}></input>
                <FieldError name="dtstart" formState={formState} />
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


            <FormComboBox
                name={`remind`}
                label="Remind At"
                defaultValue={remind || ""}
                className="basis-full border-0 border-b-2 rounded-none"
                options={REMIND_AT}
                formState={formState}
                required={true}
                placeholder="Morning"
            />


            <label>
                Timezone:

                <select id="timezone" name="timezone" defaultValue={timezone || userSystemTimezone} >

                    <option value={timezone || userSystemTimezone}>{userSystemTimezone}</option>

                    {get_timezones().split(", ").map((t) => (

                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}

                </select>
            </label>



            {/* <input type="text" id="next_remind_at_time" name="next_remind_at_time" /> */}
            {/* <input type="text" id="rrule" name="rrule" readOnly value={rrule} /> */}


        </>
    );
}

