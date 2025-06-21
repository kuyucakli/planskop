"use client";

import { useWasm } from "@/hooks/useWasm";
import { ChangeEvent, PropsWithChildren, useState } from "react";
import { WeekDays, Rrules, Frequency } from "@/lib/definitions";
import { SelectActionPlan } from "@/db/schema";


const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;

export default function FormFieldsTimePlanning({
    dtstart,
    until,
    rrule,
    timezone,
    remind
}: PropsWithChildren<Partial<SelectActionPlan>>) {
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

            {/* Starts At ( dtstart ) */}
            {/* <label htmlFor="dtstart">
                Starts At
                <input
                    type="datetime-local"
                    id="dtstart"
                    name="dtstart"
                    value={rrules["dtstart"] || get_local_now()}
                    onChange={handleChange}
                    min={new Date().getDate()}
                />
            </label> */}

            {/* Until */}
            {/* <label htmlFor="until">
                Until
                <input
                    type="datetime-local"
                    id="until"
                    name="until"
                    value={rrules["until"]}
                    min={rrules["dtstart"]}
                    onChange={handleChange}
                />
            </label> */}

            {/* Count */}
            {/* <label htmlFor="count">
                Count
                <input type="number" name="count" id="count" min="1" defaultValue={rrules.count} />
            </label> */}


            {/* Interval */}
            {/* <label htmlFor="interval">
                Interval
                <input type="number" name="interval" id="interval" min="1" defaultValue={rrules.interval} />
            </label> */}


            {/* Frequency */}
            <label htmlFor="frequency">
                <select
                    id="frequency"
                    name="frequency"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        handleChange(e);
                    }}
                    defaultValue={rrules.frequency}
                >
                    <option value={Frequency.Daily} >
                        Daily Repeat
                    </option>
                    <option value={Frequency.Weekly}>Weekly Repeat</option>
                </select>
            </label>


            {/* Frequency Weekly*/}
            <fieldset hidden={rrules.frequency != Frequency.Weekly}>
                <legend aria-hidden aria-label="Weekly Repeat">
                    Weekly Repeat
                </legend>
                {weekDaysKeys.map((key) => (
                    <label htmlFor={key} key={key}>
                        <span>{WeekDays[key]}</span>
                        <input
                            type="checkbox"
                            checked={rrules.frequency == Frequency.Weekly && rrules.byweekday?.includes(WeekDays[key])}
                            value={WeekDays[key]}
                            id={key}
                            name="byweekday"
                            onChange={handleChange}
                        />
                    </label>
                ))}
            </fieldset>

            {/* Remind */}
            <label htmlFor="remind">
                Remind
                <select id="remind" name="remind" defaultValue={remind || ""}>
                    <option value="">never</option>
                    <option value="OneHourBefore">1 hour before</option>
                    <option value="TwoHoursBefore">2 hours before</option>
                    <option value="OneDayBefore">1 day before</option>
                    <option value="TwoDaysBefore">2 days before</option>
                </select>
            </label>

            {/*Timezone */}
            <label>
                {timezone}
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
            <input type="text" readOnly hidden value={rrule} />


        </>
    );
}



function getWeekdayName(dateStr?: string) {
    const dayIndex = new Date(dateStr || Date.now()).getDay();
    return WeekDays[weekDaysKeys[(dayIndex + 6) % 7]];
}
