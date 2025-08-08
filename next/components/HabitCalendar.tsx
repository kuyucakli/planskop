"use client";

import { addAllowedDuration, calculateRemainingDuration } from "@/lib/utils";
import { CldUploadWidget } from "next-cloudinary";
import { Fragment } from "react";
import styles from "./HabitCalendar.module.css";
import { SelectActionPlan } from "@/db/schema";
import { useWasm } from "@/hooks/useWasm";
import RemainingDuration from "./RemainingDuration";
import { dbCreateActionPhoto, dbUpdateActionPlan } from "@/db/queries";

import { CardImage } from "./Card";

export const HabitCalendar = ({
  dailyPlan,
}: {
  dailyPlan: SelectActionPlan;
}) => {
  const { format_ical, get_dt_str_from_rruleset } = useWasm() || {};

  if (!format_ical || !get_dt_str_from_rruleset) return;

  const { dtstart, repeat } = dailyPlan;
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    //month: "long",
    day: "numeric",
  };

  //const formatted = today.toLocaleDateString("en-US", options);
  const dtstartObj = new Date(dtstart);
  const endDateStr = addAllowedDuration(dtstartObj, repeat)
    .toISOString()
    .slice(0, 10);
  const rrulesetStr = format_ical(dtstart, endDateStr);
  const dailyPlanDatesStr = get_dt_str_from_rruleset(rrulesetStr);
  const dailyPlanDatesArr = [
    ...dailyPlanDatesStr.matchAll(/\d{4}-\d{2}-\d{2}/g),
  ].map((m) => new Date(m[0]));

  let weekIndex: number;

  const handleCloudinarySuccess = (actionId: string, result: any) => {
    const imageUrl = result.info.secure_url;
    //const publicId = result.info.public_id;
    const updatedSlots = dailyPlan.slots.map((slot) => {
      if (slot.id === actionId) {
        return { ...slot, completedPhotoUrl: imageUrl}
      }
      return slot;
    });

    const updatedDailyPlan = {
      ...dailyPlan,
      slots: updatedSlots,
    };

    
    dbCreateActionPhoto({
      userId: dailyPlan.userId,
      actionDate: dtstart,
      imageUrl,
      actionId: dtstart + actionId,
    })
    .then(()=>{
      dbUpdateActionPlan(updatedDailyPlan);
    })
    .catch((err) => {
      console.error("Failed to create action photo:", err);
    });
  };

  return (
    <section className={`${styles.HabitCalendarWrapper} mt-6 mb-8 `}>
      {/* <ul className={styles.HabitCalendar}>
                {getWeekDays().map((d, index) => <li key={index} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">{d.toLocaleDateString("en-US", options)}</li>)}
            </ul> */}

      <ul className={`${styles.HabitCalendar}`}>
        {dailyPlanDatesArr.map((d, index) => {
          const showWeekIndex = getWeekOfMonth(d) != weekIndex;
          weekIndex = getWeekOfMonth(d);
          return (
            <Fragment key={index}>
              {showWeekIndex && (
                <span className="bg-emerald-600/50 sticky top-0 left-0  h-full basis-auto block pl-6 pr-8 pt-2 pb-2  rounded backdrop-blur-sm z-10">
                  <span className="text-2xl">{getMonthName(d)}</span>{" "}
                  {ordinals[getWeekOfMonth(d) + "."]} week
                </span>
              )}
              <li className="flex justify-center items-center max-w-sm   border  border-gray-700 rounded shadow-sm  bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-sm ">
                {d.toLocaleDateString("en-US", options)}
              </li>
            </Fragment>
          );
        })}
      </ul>

      <ul>
        {dailyPlan.slots.map((s) => (
          <li key={s.id} className="flex  rounded bg-gray-800 mt-0.5 ">
            <div className="flex p-4 gap-4 flex-11/12">
              <h2>{s.title}</h2>
              <p>{s.at}</p>
              <p> for {s.duration}</p>
              <RemainingDuration
                targetDateTime={new Date(dtstart + `T${s.at}:00.000+03:00`)}
              />
            </div>
            {
              s.completedPhotoUrl 
              &&
              <CardImage path={s.completedPhotoUrl} altText={`${s.title} completed`}/>
            }
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result: any) => {
                handleCloudinarySuccess(s.id, result);
              }}
            >
              {({ open }) => {
                return (
                  <button
                    onClick={() => open()}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4  hover:border-blue-500 rounded flex-1/12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                  </button>
                );
              }}
            </CldUploadWidget>
          </li>
        ))}
      </ul>
    </section>
  );
};

function getWeekDays(): Date[] {
  const today = new Date();
  let cursorDate = getPrevDate(today, 3);
  const res = [];

  for (let i = 0; i < 7; i++) {
    cursorDate = getNextDate(cursorDate, 1);
    res.push(cursorDate);
  }

  return res;
}

function getNextDate(date: Date, daysAhead: number): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + daysAhead);
  return next;
}

function getPrevDate(date: Date, daysBack: number): Date {
  const prev = new Date(date);
  prev.setDate(date.getDate() - daysBack);
  return prev;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

function getWeekOfMonth(date: Date): number {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDayOfWeek = (startOfMonth.getDay() + 6) % 7;

  const adjustedDate = date.getDate() + startDayOfWeek;

  return Math.ceil(adjustedDate / 7);
}

function getMonthName(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}

const ordinals: Record<string, string> = {
  "1.": "first",
  "2.": "second",
  "3.": "third",
  "4.": "fourth",
  "5.": "fifth",
};
