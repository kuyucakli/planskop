/* tslint:disable */
/* eslint-disable */
export function get_local_now(): string;
export function get_closest_action_dates(action_plans_json: string): string;
export function calc_with_remind_kind(dt: string, remind_kind: RemindKind, operation: Operation): string;
export function with_timezone_offset(dt: string, offset: string): string;
export function get_next_remind_dt(_rruleset: string, remind_kind: RemindKind, current_remind_dt?: string | null): string;
export function get_timezones(): string;
export function get_local_timezone(): string;
export function get_dt_str_from_rruleset(_rruleset: string): string;
export function format_ical(dtstart: string, until?: string | null, frequency?: string | null, interval?: string | null, count?: string | null, by_week_day?: string | null): string;
export function subtract_gmt_offset(dt: string, gmt_offset_str: string): string;
export function get_human_readable_rrule(_rruleset: string): string;
export function will_send_reminder_email(next_remind_at: string, timezone: string, remind_kind: RemindKind): boolean;
export enum Operation {
  Add = 0,
  Subtract = 1,
}
export enum RemindKind {
  OneHourBefore = 0,
  TwoHoursBefore = 1,
  OneDayBefore = 2,
  TwoDaysBefore = 3,
}
