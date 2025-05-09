use chrono::{prelude::*, Duration, Utc};
use chrono_tz::TZ_VARIANTS;
use regex::Regex;
use rrule::{Frequency, RRuleSet, Tz};
use serde::{Deserialize, Serialize};
use serde_json::{self};
use wasm_bindgen::prelude::*;

#[macro_use]
mod macros;

#[derive(Serialize, Deserialize, Debug)]
struct ActionPlan {
    id: u32,
    title: String,
    rrule: String,
    closest: Option<String>,
    timezone: String,
}

#[wasm_bindgen]
pub enum Operation {
    Add,
    Subtract,
}

// Define enum for RemindKind
#[wasm_bindgen]
pub enum RemindKind {
    OneHourBefore,
    TwoHoursBefore,
    OneDayBefore,
    TwoDaysBefore,
}

impl RemindKind {
    // Convert remind kind into a Duration
    fn to_duration(&self) -> Duration {
        match self {
            RemindKind::OneHourBefore => Duration::hours(1),
            RemindKind::TwoHoursBefore => Duration::hours(2),
            RemindKind::OneDayBefore => Duration::days(1),
            RemindKind::TwoDaysBefore => Duration::days(2),
        }
    }
}

#[wasm_bindgen]
pub fn get_local_now() -> String {
    let now: DateTime<Local> = Local::now();
    format!("{}", now.format("%Y-%m-%dT%H:%M"))
}

// --- Closest
#[wasm_bindgen]
pub fn get_closest_action_dates(action_plans_json: &str) -> String {
    let mut action_plans: Vec<ActionPlan> =
        serde_json::from_str(action_plans_json).expect("An error occured while getting json");

    for a_p in action_plans.iter_mut() {
        let l = get_dt_vec_from_rruleset(&a_p.rrule);
        let c = get_closest_to_now(l);
        if let Some(closest_date) = c {
            a_p.closest = Some(closest_date.format("%Y-%m-%dT%H:%MZ").to_string())
        }
    }

    action_plans.sort_by(|a, b| {
        match (&a.closest, &b.closest) {
            (Some(a_date), Some(b_date)) => b_date.cmp(a_date),
            (None, Some(_)) => std::cmp::Ordering::Less, // `None` comes after `Some`
            (Some(_), None) => std::cmp::Ordering::Greater,
            (None, None) => std::cmp::Ordering::Equal,
        }
    });

    serde_json::to_string(&action_plans).expect("Failed to serialize JSON")
}

#[wasm_bindgen]
pub fn calc_with_remind_kind(dt: &str, remind_kind: RemindKind, operation: Operation) -> String {
    let naive_dt: DateTime<Utc> = dt.parse().unwrap();
    let duration = remind_kind.to_duration();
    let result = match operation {
        Operation::Add => naive_dt + duration,
        Operation::Subtract => naive_dt - duration,
    };
    result.to_string()
}

#[wasm_bindgen]
pub fn with_timezone_offset(dt: &str, offset: &str) -> String {
    let naive_dt: DateTime<Utc> = dt.parse().unwrap();
    let offset = get_offset_from_gmt_str(offset);
    let result = naive_dt + Duration::hours(offset as i64);
    result.to_string()
}

#[wasm_bindgen]
pub fn get_next_remind_dt(
    _rruleset: &str,
    remind_kind: RemindKind,
    current_remind_dt: Option<String>,
) -> String {
    let rrule: RRuleSet = _rruleset.parse().unwrap();

    let next_remind_dt = match current_remind_dt {
        Some(dt) => {
            let current_action_dt: DateTime<Utc> = dt.parse::<DateTime<Utc>>().unwrap()
                + remind_kind.to_duration()
                + Duration::seconds(5); // for rrule.after method to work for same dt

            let after = rrule.after(Tz::UTC.from_utc_datetime(&current_action_dt.naive_utc()));

            let all = after.all(2);

            all.dates[0].with_timezone(&Utc) - remind_kind.to_duration()
        }
        None => rrule.get_dt_start().with_timezone(&Utc) - remind_kind.to_duration(),
    };

    next_remind_dt.format("%Y-%m-%dT%H:%M").to_string()
}

// --- Timezone ---
#[wasm_bindgen]
pub fn get_timezones() -> String {
    // Get the current time in UTC
    let now_utc = Utc::now();

    // Create a formatted list of time zones with their GMT offset
    let timezone_list = TZ_VARIANTS
        .iter()
        .map(|tz| {
            let tz_time = now_utc.with_timezone(tz);
            let offset_seconds = tz_time.offset().fix().local_minus_utc(); // Offset in seconds
            let offset_hours = offset_seconds / 3600; // Convert to hours

            let gmt_offset = if offset_hours >= 0 {
                format!("GMT +{}", offset_hours)
            } else {
                format!("GMT {}", offset_hours) // Negative offsets will automatically have the '-'
            };

            format!("({}) {}", gmt_offset, tz.name()) // Format as (GMT ±X) Timezone
        })
        .collect::<Vec<String>>()
        .join(", ");

    timezone_list
}

#[wasm_bindgen]
pub fn get_local_timezone() -> String {
    // Get the current time in the user's local timezone
    let local_time = Local::now();

    // Calculate the offset from UTC in hours
    let offset_seconds = local_time.offset().local_minus_utc();
    let offset_hours = offset_seconds / 3600; // Convert to hours

    // Format the GMT offset (handles positive/negative)
    let gmt_offset = if offset_hours >= 0 {
        format!("GMT +{}", offset_hours)
    } else {
        format!("GMT {}", offset_hours) // Negative sign is included automatically
    };

    // Return the formatted string as (GMT ±X)
    gmt_offset
}

#[wasm_bindgen]
pub fn get_dt_str_from_rruleset(_rruleset: &str) -> String {
    let rruleset: RRuleSet = _rruleset.parse().unwrap();

    rruleset
        .into_iter()
        .take(100)
        .map(|occurrence| {
            let datetime: DateTime<Utc> = occurrence.with_timezone(&Utc);
            datetime.to_string()
        })
        .collect::<Vec<String>>()
        .join("*")
}

#[wasm_bindgen]
pub fn format_ical(
    dtstart: String,
    until: Option<String>,
    frequency: Option<String>,
    interval: Option<String>,
    count: Option<String>,
    by_week_day: Option<String>,
) -> String {
    // Parse the incoming dtstart in "YYYY-MM-DDTHH:MM" format
    let parsed_dtstart =
        NaiveDateTime::parse_from_str(&dtstart, "%Y-%m-%dT%H:%M").expect("Failed to parse dtstart");

    // Convert dtstart to UTC format and iCalendar format
    let formatted_dtstart = Utc
        .from_utc_datetime(&parsed_dtstart)
        .format("DTSTART:%Y%m%dT%H%M%SZ")
        .to_string();

    // Prepare the RRULE string
    let mut rrule = String::new();

    // Handle frequency if provided, default to "DAILY" if not provided
    let freq = frequency.unwrap_or_else(|| "DAILY".to_string());
    rrule.push_str(&format!("FREQ={}", freq));

    if let Some(count_value) = count {
        rrule.push_str(&format!(";COUNT={}", count_value));
    }

    if let Some(interval_value) = interval {
        rrule.push_str(&format!(";INTERVAL={}", interval_value));
    }

    if let Some(by_week_day) = by_week_day {
        rrule.push_str(&format!(";BYDAY={}", by_week_day));
    }

    if let Some(until) = until {
        let parsed_until =
            NaiveDateTime::parse_from_str(&until, "%Y-%m-%dT%H:%M").expect("Failed to parse until");
        let formatted_until = Utc
            .from_utc_datetime(&parsed_until)
            .format("%Y%m%dT%H%M%SZ")
            .to_string();
        rrule.push_str(&format!(";UNTIL={}", formatted_until));
    }

    // Add the week start (WKST) to the rule, defaulting to Monday
    rrule.push_str(";WKST=MO");

    // Combine DTSTART and RRULE into the final iCalendar string
    let ical_string = format!("{}\nRRULE:{}", formatted_dtstart, rrule);
    ical_string
}

#[wasm_bindgen]
pub fn subtract_gmt_offset(dt: &str, gmt_offset_str: &str) -> String {
    let gmt_hr = get_offset_from_gmt_str(gmt_offset_str);

    let parsed_dt =
        NaiveDateTime::parse_from_str(&dt, "%Y-%m-%dT%H:%M").expect("Failed to parse dtstart");

    // Convert dtstart to UTC format and iCalendar format
    let formatted_dt = Utc.from_utc_datetime(&parsed_dt) - Duration::hours(gmt_hr as i64);

    formatted_dt.format("%Y-%m-%dT%H:%M").to_string()
}

#[wasm_bindgen]
pub fn get_human_readable_rrule(_rruleset: &str) -> String {
    // Parse the RRULE string
    let rrule_set: RRuleSet = _rruleset.parse().unwrap();
    let rrule = rrule_set.get_rrule();

    // Determine frequency
    let frequency = match rrule[0].get_freq() {
        Frequency::Daily => "day".to_string(),
        Frequency::Weekly => "week".to_string(),
        Frequency::Monthly => "month".to_string(),
        Frequency::Yearly => "year".to_string(),
        _ => "unknown frequency".to_string(),
    };

    // Handle the interval (if provided)
    let interval = rrule[0].get_interval();

    let interval_str = if interval > 1 {
        format!("every {interval} {frequency}s")
    } else {
        format!("every {frequency}")
    };

    // Handle the count (if provided)
    let count = rrule[0]
        .get_count()
        .map_or("an unknown number of times".to_string(), |c| {
            format!("{c} times")
        });

    // Handle byday (if provided)
    let byday = rrule[0]
        .get_by_weekday()
        .iter()
        .map(|wd| wd.to_string())
        .collect::<Vec<_>>()
        .join(", ");

    // Build the human-readable result
    if byday.is_empty() {
        format!("{interval_str} for {count}")
    } else {
        format!("{interval_str} on {byday} for {count}")
    }
}

#[wasm_bindgen]
pub fn will_send_reminder_email(
    next_remind_at: &str,
    timezone: &str,
    remind_kind: RemindKind,
) -> bool {
    let parsed = DateTime::parse_from_rfc3339(next_remind_at).unwrap();

    let gmt_offset = get_offset_from_gmt_str(&timezone);
    let action_dt = parsed + remind_kind.to_duration();
    let action_dt_with_gmt = action_dt + Duration::hours(gmt_offset as i64);

    let now_with_gmt = Utc::now() + Duration::hours(gmt_offset as i64);

    let delta = action_dt_with_gmt.signed_duration_since(now_with_gmt);
    let delta_minutes = delta.num_minutes();

    match remind_kind {
        RemindKind::OneHourBefore => delta_minutes <= 60,
        RemindKind::TwoHoursBefore => delta_minutes > 60 && delta_minutes <= 120,
        RemindKind::OneDayBefore | RemindKind::TwoDaysBefore => {
            action_dt_with_gmt.day() == now_with_gmt.day()
        }
    }
}

fn get_closest_to_now(dates: Vec<DateTime<Utc>>) -> Option<DateTime<Utc>> {
    // Get the current time
    let now = Utc::now();
    // Find the date with the smallest difference to "now"
    dates
        .into_iter()
        .filter(|date| *date >= now) // Only consider dates in the future or equal to now
        .min_by_key(|date| (now.signed_duration_since(*date).num_seconds()).abs())
    // Find the closest
}

fn get_dt_vec_from_rruleset(_rruleset: &str) -> Vec<DateTime<Utc>> {
    let rruleset: RRuleSet = _rruleset.parse().unwrap();
    let dates = rruleset
        .into_iter()
        .take(100)
        .map(|occurrence| DateTime::from(occurrence.with_timezone(&Utc)))
        .collect();

    dates
}

fn get_offset_from_gmt_str(gmt_str: &str) -> i32 {
    // Regular expression to capture the number after 'GMT'
    let re = Regex::new(r"\(?\s*GMT\s*([+-]\d+)\s*\)?/?").unwrap();

    // Try to capture the offset
    if let Some(captures) = re.captures(gmt_str) {
        // Convert the captured group to an i32 number
        if let Some(offset_str) = captures.get(1) {
            return offset_str.as_str().parse::<i32>().unwrap_or(0);
        }
    }

    0
}

mod candle_test;

#[wasm_bindgen]
pub fn test_the_candle() {
    candle_test::test();
}
