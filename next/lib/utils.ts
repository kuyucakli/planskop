import { ZodError } from "zod";
import type {
  AllowedTime,
  AllowedTimeBasedDuration,
  RepeatDuration,
} from "@/db/schema";
import { DailySlotStatus } from "./definitions";

type FormState = {
  status: "UNSET" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

const EMPTY_FORM_STATE: FormState = {
  status: "UNSET" as const,
  message: "",
  fieldErrors: {},
  timestamp: Number(Date.now()),
};

const toFormState = (
  status: FormState["status"],
  message: string
): FormState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
  };
};

const fromErrorToFormState = (error: unknown) => {
  // if validation error with Zod, return first error message
  if (error instanceof ZodError) {
    return {
      status: "ERROR" as const,
      message: "",
      fieldErrors: error.format(),
      timestamp: Date.now(),
    };
    // if another error instance, return error message
    // e.g. database error
  } else if (error instanceof Error) {
    return {
      status: "ERROR" as const,
      message: error.message,
      fieldErrors: {},
      timestamp: Date.now(),
    };
    // if not an error instance but something else crashed
    // return generic error message
  } else {
    return {
      status: "ERROR" as const,
      message: "An unknown error occurred",
      fieldErrors: {},
      timestamp: Date.now(),
    };
  }
};

type FormattedFieldError = { _errors: string[] };

function resolvePath<T = FormattedFieldError>(
  obj: unknown,
  path: string
): T | undefined {
  if (!obj || typeof path !== "string") return undefined;

  const keys = path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");

  return keys.reduce<Record<string, unknown> | undefined>((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key] as Record<string, unknown>;
    }
    return undefined;
  }, obj as Record<string, unknown>) as T | undefined;
}

const unicodeFractions: Record<string, number> = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
};

function parseFractionalNumber(str: string): number {
  const match = str.match(/^(\d+)?([½¼¾⅓⅔])?$/);
  if (!match) return NaN;

  const [, wholeStr, fracChar] = match;
  const whole = wholeStr ? parseInt(wholeStr, 10) : 0;
  const fraction = fracChar ? unicodeFractions[fracChar] ?? 0 : 0;

  return whole + fraction;
}

const timeStrToMinutes = (timeString: AllowedTime): number | undefined => {
  if (typeof timeString != "string") return;
  const parts = timeString.split(":");
  if (parts.length !== 2) return;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return;

  return hours * 60 + minutes;
};

function timeBasedDurationToMinutes(
  input: AllowedTimeBasedDuration
): number | undefined {
  if (typeof input != "string") return;
  const reg = /(?:(\d*[½¼¾⅓⅔]?)\s*hour[s]?)?\s*(?:(\d+)\s*min[s]?)?/;
  const match = input.match(reg);
  if (!match) return undefined;

  const hoursStr = match[1];
  const minutesStr = match[2];

  if (!hoursStr && !minutesStr) return undefined;

  const hours = hoursStr ? parseFractionalNumber(hoursStr) : 0;
  const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;

  return Math.round(hours * 60 + minutes);
}

function extractTimeRange(
  start: AllowedTime,
  duration: AllowedTimeBasedDuration,
  step: number = 15,
  excludeStart: boolean = false,
  excludeEnd: boolean = false
): Set<number> {
  const range: Set<number> = new Set();
  const startMinutes = timeStrToMinutes(start);
  const durationMinutes = timeBasedDurationToMinutes(duration);

  if (startMinutes === undefined || durationMinutes === undefined) {
    return range;
  }

  for (let m = startMinutes; m <= durationMinutes + startMinutes; m += step) {
    const MINUTES_IN_DAY = 1440;
    const normalized = m % MINUTES_IN_DAY;
    range.add(normalized);
  }

  if (excludeStart) {
    range.delete(startMinutes);
  }

  if (excludeEnd) {
    range.delete(durationMinutes + startMinutes);
  }
  return range;
}

function parseSlotKey(key: string): { index: string; field: string } | null {
  const match = key.match(/^slots\[(\d+)\]\.(\w+)$/);
  if (!match) return null;

  const [, indexStr, field] = match;
  return {
    index: indexStr,
    field,
  };
}

function parseFormDataToNestedObject(formData: FormData) {
  const result: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    const slotKey = parseSlotKey(key);
    console.log("key:", key, "value:", value);
    if (slotKey) {
      const { index, field } = slotKey;
      result.slots ??= [];
      result.slots[index] ??= {};
      result.slots[index][field] = value;
      result.slots[index]["id"] = index;
    } else {
      if (key !== "slots") result[key] = value;
    }
  }

  if (!("isPublic" in result)) {
    result.isPublic = false;
  }

  return result;
}

// --- Time Utils ---

type dtparts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function addRepeatDuration(
  startDate: Date | string,
  duration: RepeatDuration | null | undefined
): Date {
  if (typeof startDate == "string") startDate = new Date(startDate);
  if (!startDate || !duration) return startDate;
  const result = new Date(startDate.getTime());
  const match = duration.match(/(\d+)\s*(day|week|month|year)s?/i);
  if (!match) throw new Error("Invalid duration");

  const [_, numStr, unit] = match;
  const amount = parseInt(numStr, 10);

  switch (unit.toLowerCase()) {
    case "day":
      result.setDate(result.getDate() + amount);
      break;
    case "week":
      result.setDate(result.getDate() + amount * 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + amount);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + amount);
      break;
    default:
      throw new Error("Unsupported duration unit");
  }

  return result;
}

function addTimeBasedDurationToTime(
  timeStr: `${number}:${number}`,
  timeBasedDuration: AllowedTimeBasedDuration
) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  const durationMinutes = timeBasedDurationToMinutes(timeBasedDuration) || 0;
  const totalMinutes = hours * 60 + minutes + durationMinutes;

  hours = Math.floor(totalMinutes / 60) % 24; // wrap after 24h
  minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function msTimeDiff(
  msA: number,
  msB: number
): { days: number; hours: number; minutes: number; seconds: number } {
  const diff = msA - msB;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return { days, hours, minutes, seconds };
}

function formatDuration({ days, hours, minutes, seconds }: dtparts): string {
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0)
    return `${hours} hour${hours > 1 ? "s" : ""} ${
      minutes > 0 ? (minutes % 60) + " minutes" : ""
    }`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

function getNumValFromTzLabel(tzLabel: string) {
  const match = tzLabel.match(/\(*GMT\s*([+-](\d+))(?::\d{2})?\)*\s*/);
  if (match) {
    return Number(match[1]);
  }
  return 0;
}

function getDateParts(
  date: number | string | Date,
  locale = "en-US",
  timeZone = "UTC"
) {
  if (typeof date === "number" || typeof date === "string") {
    date = new Date(date);
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const parts: Record<string, string> = {};
  for (const p of formatter.formatToParts(date)) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }
  return {
    year: parts.year,
    monthName: parts.month,
    dayOfMonth: parts.day,
    weekdayName: parts.weekday,
  };
}

function utcToGmtOffset(utcStr: string, timezone: string): string {
  const date = new Date(utcStr);
  // Add offset in milliseconds
  const localMs =
    date.getTime() + getNumValFromTzLabel(timezone) * 60 * 60 * 1000;
  const localDate = new Date(localMs);

  return localDate.toISOString();
}

function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  tz: string = "UTC"
) {
  if (typeof date === "string" || typeof date === "number") {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: "${date}"`);
  }
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: tz,
  }).format(date);
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

/**
 * Combines a date string and a time string into a UTC Date object.
 *
 * @param dateStr - Date in "YYYY-MM-DD" format (e.g. "2025-08-13")
 * @param timeStr - Time in "HH:mm" 24-hour format (e.g. "08:15")
 * @returns Date object representing the given date/time in UTC
 *
 * @example
 * createUtcDate("2025-08-13", "08:15").toISOString();
 * // "2025-08-13T08:15:00.000Z"
 */
function combineAsDtUtc(
  dateStr: string,
  timeStr: string,
  timezone?: string
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  let [hour, minute] = timeStr.split(":").map(Number);

  if (timezone) {
    const offsetHours = getNumValFromTzLabel(timezone);
    hour -= offsetHours;
  }

  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

export type { FormState, dtparts };
export {
  addRepeatDuration,
  addTimeBasedDurationToTime,
  combineAsDtUtc,
  EMPTY_FORM_STATE,
  extractTimeRange,
  formatDate,
  formatDuration,
  fromErrorToFormState,
  getDateParts,
  getNextDate,
  getPrevDate,
  getNumValFromTzLabel,
  msTimeDiff,
  parseFormDataToNestedObject,
  parseSlotKey,
  resolvePath,
  timeBasedDurationToMinutes,
  timeStrToMinutes,
  toFormState,
  utcToGmtOffset,
};
