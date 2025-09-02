import { DailyActionSlot, remindAt } from "@/db/schema";

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
