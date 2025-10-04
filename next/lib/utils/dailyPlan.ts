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

// function getDetailedDailyPlanTimes(
//   startDate: string,
//   repeat: RepeatDuration | null | undefined,
//   timezone: string,
//   remind?: remindAt
// ) {
//   const startDt = combineAsDtUtc(startDate, "00:00", "0");
//   const startMs = startDt.getTime();
//   const startDtStr = startDt.toISOString();
//   const endDt = addRepeatDuration(startDt, repeat);
//   const endMs = endDt.getTime();
//   const endDtStr = endDt.toISOString();
//   let reminderHourUtc = null;

//   if (remind) {
//     const remindLocalHour = REMIND_HOURS[remind];
//     reminderHourUtc = remindLocalHour - getNumValFromTzLabel(timezone);
//   }

//   return {
//     startDt,
//     startMs,
//     startDtStr,
//     endDt,
//     endMs,
//     endDtStr,
//     localStartDtStr: utcToGmtOffset(startDt.toISOString(), timezone),
//     localEndDtStr: utcToGmtOffset(endDt.toISOString(), timezone),
//     reminderHourUtc,
//   };
// }

function getDetailedDailyPlanTimes(
  startDate: string,
  repeat: RepeatDuration | null | undefined,
  timezone: string,
  remind?: remindAt
) {
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
      const repeatDayCount =
        (detailedDailyPlanTimes.endMs - detailedDailyPlanTimes.startMs) /
        (1000 * 60 * 60 * 24);

      acc[dailyPlanId] = {
        completions: { [actionTitle + "-" + hoursMinutes]: 1 },
        userId: userId,
        dailyPlanId,
        dailyPlanTitle: dailyPlanTitle,
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
