import {
  AllowedTimeBasedDuration,
  CompletionsMap,
  DailyActionSlot,
  DailyPlanWithCompletion,
  REMIND_HOURS,
  remindAt,
  RepeatDuration,
} from "@/lib/definitions";
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

function getProgress(nowMs: number, startMs: number, endMs: number) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return {
    daysSinceStart: Math.floor((nowMs - startMs) / MS_PER_DAY),
    daysUntilEnd: Math.ceil((endMs - nowMs) / MS_PER_DAY),
  };
}

function getDetailedDailyPlanTimes(
  startDate: string,
  repeat: RepeatDuration | null | undefined,
  timezone: string,
  remind?: remindAt
) {
  const now = Date.now(); // current UTC timestamp in ms
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const startDt = combineAsDtUtc(startDate, "00:00", "0");
  const endDt = addRepeatDuration(startDt, repeat);

  const startMs = startDt.getTime();
  const endMs = endDt.getTime();

  // Reminder hour in UTC
  const reminderHourUtc = remind
    ? REMIND_HOURS[remind] - getNumValFromTzLabel(timezone)
    : null;

  // --- Local conversions ---
  const localStartStr = utcToGmtOffset(startDt.toISOString(), timezone);
  const localEndStr = utcToGmtOffset(endDt.toISOString(), timezone);

  const localStartDt = new Date(localStartStr);
  const localEndDt = new Date(localEndStr);

  const localStartMs =
    localStartDt.getTime() - localStartDt.getTimezoneOffset() * 60_000;
  const localEndMs =
    localEndDt.getTime() - localEndDt.getTimezoneOffset() * 60_000;

  // --- Days passed and remaining ---
  const daysSinceStart = Math.floor((now - startMs) / MS_PER_DAY);
  const daysUntilEnd = Math.ceil((endMs - now) / MS_PER_DAY);

  return {
    // UTC
    startDt,
    startMs,
    startDtStr: startDt.toISOString(),
    endDt,
    endMs,
    endDtStr: endDt.toISOString(),

    // Local
    localStartDt,
    localStartMs,
    localStartDtStr: localStartStr,
    localEndDt,
    localEndMs,
    localEndDtStr: localEndStr,

    // Reminder
    reminderHourUtc,

    daysSinceStart,
    daysUntilEnd,
  };
}

const sortSlots = (slots: DailyActionSlot[]) =>
  [...slots].sort((a, b) => a.at.localeCompare(b.at));

function createCompletionId(
  slotStartDtMs: number,
  slotId: string,
  dailyPlanId: number
) {
  return `${dailyPlanId}-${slotId}-${slotStartDtMs}`;
}

function createCompletionsMap(data: Awaited<DailyPlanWithCompletion[]>) {
  const completionsMap = data.reduce((acc, current) => {
    const {
      userId,
      dailyPlanId,
      dailyPlanStartDate,
      dailyPlanTitle,
      dailyPlanRepeat,
      dailyPlanSlots,
      dailyPlanTimezone,
      actionTitle,
      actionTime: iso,
    } = current;

    const isoString = utcToGmtOffset(iso!!.toISOString(), dailyPlanTimezone);

    const hoursMinutes = isoString.slice(11, 16);

    if (!acc[dailyPlanId]) {
      const detailedDailyPlanTimes = getDetailedDailyPlanTimes(
        dailyPlanStartDate,
        dailyPlanRepeat,
        dailyPlanTimezone
      );
      const DAY_MS = 1000 * 60 * 60 * 24;

      const repeatDayCount =
        (detailedDailyPlanTimes.endMs -
          detailedDailyPlanTimes.startMs +
          DAY_MS) /
        DAY_MS;

      acc[dailyPlanId] = {
        completions: { [actionTitle + "-" + hoursMinutes]: 1 },
        userId: userId,
        dailyPlanId,
        dailyPlanTitle: dailyPlanTitle,
        dailyPlanStartDate,
        dailyPlanTimezone,
        dailyPlanRepeat,
        allSlots: dailyPlanSlots,
        repeatDayCount,
      };
    } else {
      const val =
        acc[dailyPlanId].completions[actionTitle + "-" + hoursMinutes] || 0;

      acc[dailyPlanId].completions[actionTitle + "-" + hoursMinutes] = val + 1;
    }
    return acc;
  }, {} as CompletionsMap);

  Object.entries(completionsMap).forEach(([dailyPlanId, data]) => {
    data.allSlots.forEach(({ title, at }) => {
      if (!data.completions[title + "-" + at]) {
        data.completions[title + "-" + at] = 0;
      }
    });

    const sortedEntries = Object.entries(data.completions).sort(
      ([keyA], [keyB]) => {
        const [, timeA] = keyA.split("-");
        const [, timeB] = keyB.split("-");
        return timeA.localeCompare(timeB);
      }
    );

    data.completions = Object.fromEntries(sortedEntries);
  });

  return completionsMap;
}

export {
  createCompletionsMap,
  getDetailedDailyPlanTimes,
  getDetailedSlotTimes,
  sortSlots,
  createCompletionId,
};
