import {
  AllowedTimeBasedDuration,
  REMIND_HOURS,
  remindAt,
  RepeatDuration,
} from "@/db/schema";
import {
  addRepeatDuration,
  combineAsDtUtc,
  getNumValFromTzLabel,
  timeBasedDurationToMinutes,
  utcToGmtOffset,
} from "../utils";

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
  timezone: string,
  remind?: remindAt
) {
  const startDt = combineAsDtUtc(start, "00:00", "0");
  const startMs = startDt.getTime();
  const startDtStr = startDt.toISOString();
  const endDt = addRepeatDuration(startDt, repeat);
  const endMs = endDt.getTime();
  const endDtStr = endDt.toISOString();
  let reminderHourUtc = null;

  if (remind) {
    const remindLocalHour = REMIND_HOURS[remind];
    reminderHourUtc = remindLocalHour - getNumValFromTzLabel(timezone);
  }

  return {
    startDt,
    startMs,
    startDtStr,
    endDt,
    endMs,
    endDtStr,
    localStartDtStr: utcToGmtOffset(startDt.toISOString(), timezone),
    localEndDtStr: utcToGmtOffset(endDt.toISOString(), timezone),
    reminderHourUtc,
  };
}

export { getDetailedDailyPlanTimes, getDetailedSlotTimes };
