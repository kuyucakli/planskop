/* tslint:disable */
/* eslint-disable */
/**
* @returns {string}
*/
export function get_local_now(): string;
/**
* @param {string} action_plans_json
* @returns {string}
*/
export function get_closest_action_dates(action_plans_json: string): string;
/**
* @param {string} dt
* @param {RemindKind} remind_kind
* @param {Operation} operation
* @returns {string}
*/
export function calc_with_remind_kind(dt: string, remind_kind: RemindKind, operation: Operation): string;
/**
* @param {string} dt
* @param {string} offset
* @returns {string}
*/
export function with_timezone_offset(dt: string, offset: string): string;
/**
* @param {string} _rruleset
* @param {RemindKind} remind_kind
* @param {string | undefined} [current_remind_dt]
* @returns {string}
*/
export function get_next_remind_dt(_rruleset: string, remind_kind: RemindKind, current_remind_dt?: string): string;
/**
* @returns {string}
*/
export function get_timezones(): string;
/**
* @returns {string}
*/
export function get_local_timezone(): string;
/**
* @param {string} _rruleset
* @returns {string}
*/
export function get_dt_str_from_rruleset(_rruleset: string): string;
/**
* @param {string} dtstart
* @param {string | undefined} [until]
* @param {string | undefined} [frequency]
* @param {string | undefined} [interval]
* @param {string | undefined} [count]
* @param {string | undefined} [by_week_day]
* @returns {string}
*/
export function format_ical(dtstart: string, until?: string, frequency?: string, interval?: string, count?: string, by_week_day?: string): string;
/**
* @param {string} dt
* @param {string} gmt_offset_str
* @returns {string}
*/
export function subtract_gmt_offset(dt: string, gmt_offset_str: string): string;
/**
* @param {string} _rruleset
* @returns {string}
*/
export function get_human_readable_rrule(_rruleset: string): string;
/**
* @param {string} next_remind_at
* @param {string} timezone
* @param {RemindKind} remind_kind
* @returns {boolean}
*/
export function will_send_reminder_email(next_remind_at: string, timezone: string, remind_kind: RemindKind): boolean;
/**
*/
export enum RemindKind {
  OneHourBefore = 0,
  TwoHoursBefore = 1,
  OneDayBefore = 2,
  TwoDaysBefore = 3,
}
/**
*/
export enum Operation {
  Add = 0,
  Subtract = 1,
}
