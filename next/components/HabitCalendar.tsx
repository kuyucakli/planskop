"use client";

import {
  addRepeatDuration,
  combineAsDtUtc,
  formatDate,
  formatDuration,
  timeBasedDurationToMinutes,
  utcToGmtOffset,
} from "@/lib/utils";
import { ButtonCldUpload, ButtonDirectional } from "./Buttons";
import { CardImage } from "./Card";
import { dbCreateActionPhoto, dbUpdateActionPlan } from "@/db/queries";
import LabelState from "./LabelState";
import styles from "./HabitCalendar.module.css";
import {
  AllowedTimeBasedDuration,
  DailyActionSlot,
  InsertActionPhoto,
  RepeatDuration,
  SelectActionPlan,
} from "@/db/schema";

import { PropsWithChildren, useState } from "react";
import { useTimeDiffToNow } from "@/hooks/useTimeDiff";
import { Wheel } from "./WheelAnim";
import {
  IconArrowBack,
  IconArrowForward,
  IconCheck,
  IconSchedule,
} from "./Icons";

function NavDate({
  interval,
  selectedDateMs,
  onDateChange,
}: {
  interval: { startMs: number; endMs: number };
  selectedDateMs: number;
  onDateChange: (ms: number) => void;
}) {
  const { startMs, endMs } = interval;
  const dayMs = 24 * 60 * 60_000;
  const disablePrev = selectedDateMs - dayMs < startMs;
  const disableNext = selectedDateMs + dayMs > endMs;
  return (
    <div className="shadow-md shadow-black/20 h-8 flex items-center gap-1">
      <ButtonDirectional direction="prev" disabled={disablePrev}
      onDirectionalClick={() => {
  
        onDateChange(selectedDateMs - dayMs);}
      }
      />

      <ButtonDirectional direction="next" disabled={disableNext}
      onDirectionalClick={() => {
  
        onDateChange(selectedDateMs + dayMs);}
      }
      />
 
     
      <span className="rounded-md inline-flex w-24 h-8 justify-center items-center bold">
        {formatDate(selectedDateMs, { day: "numeric", month: "short" })}
      </span>
     
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
    <div className="border-gray-400 rounded-2xl text-sm  my-6">
      <p>Your daily plan starting from, {start}</p>
      <p>
        Planned to last for {repeat} ends at {end}
      </p>
    </div>
  );
}

const SlotItem = ({
  slotData: s,
  startMs,
  timezone,
  handleCldSuccess,
}: {
  slotData: DailyActionSlot;
  startMs: number;
  timezone: string;
  handleCldSuccess: (actionId: string, result: any) => void;
}) => {
  const { startDtMs, endDtMs, endMsProofImg } = getDetailedSlotTimes(
    new Date(startMs).toISOString().slice(0, 10), //startDateStr.slice(0, 10),
    s.at,
    s.duration,
    timezone
  );

  const durationToStart = useTimeDiffToNow(startDtMs, endDtMs);

  return (
    <li key={s.id} className={`flex gap-4  my-4 `}>
      <div className="basis-12 relative">
        {s.completedPhotoUrl && (
          <CardImage
            path={s.completedPhotoUrl}
            altText={`${s.title} completed`}
            className="absolute top-0 left-0 "
          />
        )}
        <ButtonCldUpload
          id={s.id}
          handleCldSuccess={handleCldSuccess}
          disabled={Date.now() < startDtMs || Date.now() > endMsProofImg}
        />
      </div>

      <div className="flex gap-4 flex-1">
        <div className={`flex flex-col justify-between`}>
          <h2 className="text-lg capitalize">{s.title}</h2>

          <p className="text-xs ">
            at {s.at} for {s.duration}
          </p>
        </div>
      </div>
      <div className="basis-24 flex items-center">
        <LabelState state={durationToStart.state} />
      </div>
      <div className="basis-24 flex items-center ">
        <p
          className={`text-xs ${
            durationToStart.state == "ongoing"
              ? "text-gray-100"
              : "text-gray-300"
          }`}
        >
          {durationToStart.state != "ended" && formatDuration(durationToStart)}
          {durationToStart.state == "ongoing" && <Wheel />}
        </p>
      </div>
    </li>
  );
};

function SlotListHeader() {
  return (
    <li className="text-sm h-8  flex gap-4 text-gray-400 border-b-1 border-gray-600">
      <div className="basis-12 flex items-center justify-center">
        <IconCheck className="fill-gray-400" />
      </div>
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

const HabitCalendar = ({ dailyPlan }: { dailyPlan: SelectActionPlan }) => {
  const todayMs = Date.now();
  const { startDate, repeat, timezone } = dailyPlan;
  const { startMs, endMs, startDtStr, endDtStr } = getDetailedDailyPlanTimes(
    startDate,
    repeat,
    timezone
  );
  const [selectedDateMs, setSelectedDateMs] = useState<number>(
    todayMs >= startMs && todayMs <= endMs ? todayMs : startMs
  );

  const handleCldSuccess = (slotId: string, result: any) => {
    const imageUrl = result.info.secure_url;
    const updatedDailyPlan = updateSlots(slotId, imageUrl);

    completeSlotMission(
      {
        userId: dailyPlan.userId,
        actionDate: startDate,
        imageUrl,
        actionId:`${startMs}-${slotId}-${dailyPlan.id}`,
      },
      updatedDailyPlan
    );
  };

  const completeSlotMission = (
    actionPhoto: InsertActionPhoto,
    dailyPlan: SelectActionPlan
  ) => {
    dbCreateActionPhoto(actionPhoto)
      .then(() => {
        return dbUpdateActionPlan(dailyPlan);
      })
      .then(() => {

        console.log("Action photo created and daily plan updated successfully.");
      })
      .catch((err) => {
        console.error("Failed to create action photo:", err);
      });
  };

  const updateSlots = (inSlotId: string, imageUrl: string) => {
    const updatedSlots = dailyPlan.slots.map((slot) => {
      if (slot.id === inSlotId) {
        return { ...slot, completedPhotoUrl: imageUrl };
      }
      return slot;
    });

    return {
      ...dailyPlan,
      slots: updatedSlots,
    };
  };

  return (
    <section className={`${styles.HabitCalendarWrapper} mt-6 mb-16 `}>
      <SectionInfo
        interval={{ start: startDtStr, end: endDtStr }}
        repeat={repeat}
      />
      <div className={``}>
        <NavDate
          selectedDateMs={selectedDateMs}
          onDateChange={setSelectedDateMs}
          interval={{ startMs, endMs }}
        />
        <SlotList>
          {dailyPlan.slots.map((s) => (
            <SlotItem
              key={s.id}
              slotData={s}
              handleCldSuccess={handleCldSuccess}
              startMs={selectedDateMs}
              timezone={dailyPlan.timezone}
            />
          ))}
        </SlotList>
      </div>
    </section>
  );
};

/* --- Utils ---*/

function getDetailedSlotTimes(
  startDateStr: string,
  slotStartTime: string,
  slotDuration: AllowedTimeBasedDuration,
  timezone: string
) {
  const startDt = combineAsDtUtc(startDateStr, slotStartTime, timezone);
  const startDtMs = startDt.getTime();
  const durationMinutes = timeBasedDurationToMinutes(slotDuration) || 0;
  const endDt = new Date(startDtMs + durationMinutes * 60_000);
  const endDtMs = endDt.getTime();
  const endDtProofImg = new Date(endDtMs + 24 * 60 * 60_000);
  const endMsProofImg = endDtProofImg.getTime();

  return {
    startDt,
    endDt,
    startDtMs,
    endDtMs,
    endDtProofImg,
    endMsProofImg,
  };
}

function getDetailedDailyPlanTimes(
  start: string,
  repeat: RepeatDuration | null | undefined,
  timezone: string
) {
  const startDt = combineAsDtUtc(start, "00:00", "0");
  const startMs = startDt.getTime();
  const startDtStr = startDt.toISOString();
  const endDt = addRepeatDuration(startDt, repeat);
  const endMs = endDt.getTime();
  const endDtStr = endDt.toISOString();

  return {
    startDt,
    startMs,
    startDtStr,
    endDt,
    endMs,
    endDtStr,
    localStartDtStr: utcToGmtOffset(startDt.toISOString(), timezone),
    localEndDtStr: utcToGmtOffset(endDt.toISOString(), timezone),
  };
}

export { HabitCalendar };
