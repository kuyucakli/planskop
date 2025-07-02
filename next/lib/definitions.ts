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


type Rrules = {
    dtstart: string;
    until: string;
    frequency: Frequency | "";
    count: string;
    interval: string;
    byweekday: WeekDays[];
};



type timeString = `${number}:${number}`;

export { Frequency, WeekDays, type Rrules, type timeString };