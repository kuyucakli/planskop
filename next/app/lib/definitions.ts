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

enum RemindKind {
    OneHourBefore,
    TwoHoursBefore,
    OneDayBefore,
    TwoDaysBefore,
}

type Rrules = {
    dtstart: string;
    until: string;
    frequency: Frequency | "";
    count: string;
    interval: string;
    byweekday: WeekDays[];
};




export { Frequency, WeekDays, RemindKind, type Rrules };