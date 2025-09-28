import { DailyActionSlot } from "@/db/schemas/daily-plans-schema";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  BLOG: "/blog",
  DAILY_PLAN_DETAIL: "/daily-plans/detail/",
  SITE_URL: "https://planskop.vercel.app",
} as const;

enum Frequency {
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  Yearly = "YEARLY",
}

enum WeekDays {
  Monday = "MO",
  Tuesday = "TU",
  Wednesday = "WE",
  Thursday = "TH",
  Friday = "FR",
  Saturday = "SA",
  Sunday = "SU",
}

enum DailySlotStatus {
  Upcoming = "Upcoming",
  Ongoing = "Ongoing",
  Ended = "Ended",
}

type Rrules = {
  dtstart: string;
  until: string;
  frequency: Frequency | "";
  count: string;
  interval: string;
  byweekday: WeekDays[];
};

type timeString = `${number}:${number}`;

type ReminderBody = {
  dailyPlanId: number;
  startUtcMs: number;
  endUtcMs: number;
  dailySlots: DailyActionSlot[];
  reminderHourUtc: number;
  userFullName: string;
  userEmail: string;
  remind?: remindAt;
};

export {
  DailySlotStatus,
  Frequency,
  WeekDays,
  type ReminderBody,
  type Rrules,
  type timeString,
};

const ALLOWED_TIMES = [
  "00:00",
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "01:30",
  "01:45",
  "02:00",
  "02:15",
  "02:30",
  "02:45",
  "03:00",
  "03:15",
  "03:30",
  "03:45",
  "04:00",
  "04:15",
  "04:30",
  "04:45",
  "05:00",
  "05:15",
  "05:30",
  "05:45",
  "06:00",
  "06:15",
  "06:30",
  "06:45",
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
  "23:00",
  "23:15",
  "23:30",
  "23:45",
] as const;
type AllowedTime = (typeof ALLOWED_TIMES)[number];

const TIME_BASED_DURATIONS = [
  "15 min",
  "30 min",
  "45 min",
  "1 hour",
  "1 hour 15 min",
  "1½ hours",
  "1 hour 45 min",
  "2 hours",
  "2 hours 15 min",
  "2½ hours",
  "2 hours 45 min",
  "3 hours",
  "3 hours 15 min",
  "3½ hours",
  "3 hours 45 min",
  "4 hours",
  "4 hours 15 min",
  "4½ hours",
  "4 hours 45 min",
  "5 hours",
  "5 hours 15 min",
  "5½ hours",
  "5 hours 45 min",
  "6 hours",
] as const;
type AllowedTimeBasedDuration = (typeof TIME_BASED_DURATIONS)[number];

const REPEAT_DURATIONS = [
  "3 days",
  "4 days",
  "5 days",
  "6 days",
  "1 week",
  "2 weeks",
  "3 weeks",
  "1 month",
  "2 months",
  "3 months",
] as const;

type RepeatDuration = (typeof REPEAT_DURATIONS)[number];

const REMIND_AT = {
  NO_REMIND: "No Remind",
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  NIGHT: "Night",
} as const;

// type of all possible values
type remindAt = (typeof REMIND_AT)[keyof typeof REMIND_AT];

// mapping to hours
const REMIND_HOURS: Record<remindAt, number> = {
  [REMIND_AT.NO_REMIND]: 0,
  [REMIND_AT.MORNING]: 8,
  [REMIND_AT.AFTERNOON]: 12,
  [REMIND_AT.EVENING]: 16,
  [REMIND_AT.NIGHT]: 20,
};

const MAX_DAILY_ACTION_SLOTS = 8;

export {
  ALLOWED_TIMES,
  REMIND_HOURS,
  REMIND_AT,
  REPEAT_DURATIONS,
  TIME_BASED_DURATIONS,
  MAX_DAILY_ACTION_SLOTS,
  type AllowedTime,
  type AllowedTimeBasedDuration,
  type DailyActionSlot,
  type remindAt,
  type RepeatDuration,
};
