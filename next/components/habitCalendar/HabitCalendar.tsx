"use client";

import { formatDate } from "@/lib/utils";
import { ButtonDirectional } from "../Buttons";
import styles from "./HabitCalendar.module.css";
import { SelectDailyPlan } from "@/db/schemas/daily-plans-schema";
import { RepeatDuration } from "@/lib/definitions";

import { PropsWithChildren, useState } from "react";
import { IconCheck, IconInfo, IconSchedule } from "../Icons";
import { getDetailedDailyPlanTimes, sortSlots } from "@/lib/utils/dailyPlan";
import { SlotItem } from "./SlotItem";
import { convertUtcMsToLocalMs } from "@/lib/utils/time";

function NavDate({
  interval,
  selectedDateUtcMs,
  selectedDateLocalMs,
  onDateChange,
}: {
  interval: { startMs: number; endMs: number };
  selectedDateUtcMs: number;
  selectedDateLocalMs: number;
  onDateChange: (ms: number) => void;
}) {
  const todayMs = Date.now();
  const { startMs, endMs } = interval;
  const dayMs = 24 * 60 * 60_000;
  const disablePrev = selectedDateUtcMs - dayMs < startMs;
  const disableNext =
    selectedDateUtcMs + dayMs > endMs || selectedDateUtcMs > todayMs - dayMs;
  return (
    <div className="border-1 border-dotted border-gray-400 px-1 shadow-md shadow-black/20  h-10  items-center gap-1 flex justify-between rounded-lg">
      <ButtonDirectional
        direction="prev"
        disabled={disablePrev}
        onDirectionalClick={() => {
          onDateChange(selectedDateUtcMs - dayMs);
        }}
      />
      <span className="rounded-md inline-flex text-lg  h-8 justify-center items-center bold ">
        {formatDate(selectedDateLocalMs, {
          day: "numeric",
          month: "long",
        })}
      </span>
      <ButtonDirectional
        direction="next"
        disabled={disableNext}
        onDirectionalClick={() => {
          onDateChange(selectedDateUtcMs + dayMs);
        }}
      />
    </div>
  );
}

function SectionInfo({
  interval,
  repeat,
}: {
  interval: { start: string; end: string };
  repeat: RepeatDuration | null | undefined;
}) {
  const { start, end } = interval;
  return (
    <div className="border-gray-400 rounded-2xl text-xs  my-4">
      <p>
        <IconInfo
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="size-5 stroke-gray-400 mb-2 ml-2"
        />
        Between &nbsp;
        <span className="font-bold">
          {formatDate(start, {
            month: "short",
            day: "2-digit",
          })}
        </span>
        &nbsp; - &nbsp;
        <span className="font-bold">
          {formatDate(end, {
            month: "short",
            day: "2-digit",
          })}
        </span>{" "}
        <span>
          {repeat ? `repeating for ${repeat}` : "this is a one-time plan."}
        </span>
      </p>
    </div>
  );
}

function SlotListHeader() {
  return (
    <li className="text-sm h-8  flex gap-4 text-gray-400 border-b-1 border-gray-600">
      <div className="basis-12 flex items-center justify-center">
        <IconCheck className="fill-gray-400" />
      </div>
      <div className="basis-12 flex items-center justify-center">Media</div>
      <div className="flex-1 flex items-center">Action</div>
      <div className="basis-24 flex items-center">Status</div>
      <div className="basis-24 flex items-center justify-center">
        <IconSchedule className="fill-gray-400 -translate-y-0.5" />
      </div>
    </li>
  );
}

function SlotList({ children }: PropsWithChildren) {
  return (
    <ul className="my-4">
      <SlotListHeader />
      {children}
    </ul>
  );
}

const HabitCalendar = ({ dailyPlan }: { dailyPlan: SelectDailyPlan }) => {
  const todayMs = Date.now();
  const { startDate, repeat, timezone, slots } = dailyPlan;
  const { startMs, endMs, startDtStr, endDtStr } = getDetailedDailyPlanTimes(
    startDate,
    repeat,
    timezone
  );

  const [selectedDateUtcMs, setSelectedDateUtcMs] = useState<number>(
    todayMs >= startMs && todayMs <= endMs ? todayMs : startMs
  );

  const selectedDateLocalMs = convertUtcMsToLocalMs(selectedDateUtcMs);

  return (
    <section className={`${styles.HabitCalendarWrapper} mt-2 mb-8 `}>
      <SectionInfo
        interval={{ start: startDtStr, end: endDtStr }}
        repeat={repeat}
      />
      <div className={`${styles.SlotContainer}`}>
        <div className={styles.FadeFlash} key={selectedDateUtcMs}></div>
        <NavDate
          selectedDateUtcMs={selectedDateUtcMs}
          selectedDateLocalMs={selectedDateLocalMs}
          onDateChange={setSelectedDateUtcMs}
          interval={{ startMs, endMs }}
        />
        <SlotList>
          {sortSlots(slots).map((s) => (
            <SlotItem
              key={s.id}
              actionDate={startDate}
              slotData={s}
              dailyPlanId={dailyPlan.id}
              startMs={selectedDateUtcMs}
              timezone={dailyPlan.timezone}
              userId={dailyPlan.userId}
            />
          ))}
        </SlotList>
      </div>
    </section>
  );
};

export { HabitCalendar };
