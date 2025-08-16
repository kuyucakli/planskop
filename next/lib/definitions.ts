enum Frequency {
    Daily = "DAILY",
    Weekly = "WEEKLY",
    Monthly = "MONTHLY",
    Yearly = "YEARLY",
};

enum WeekDays {
    Monday = "MO",
    Tuesday = "TU",
    Wednesday = "WE",
    Thursday = "TH",
    Friday = "FR",
    Saturday = "SA",
    Sunday = "SU",
};


// enum RemindKind {
//     OneHourBefore = "OneHourBefore",
//     TwoHoursBefore = "TwoHoursBefore",
//     OneDayBefore = "OneDayBefore",
//     TwoDaysBefore = "TwoDaysBefore",
// }

enum DailySlotStatus  {
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

export { DailySlotStatus, Frequency, WeekDays, type Rrules, type timeString };