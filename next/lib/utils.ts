import { ZodError } from 'zod';
import type { AllowedTime, AllowedDuration } from '@/db/schema';

type FormState = {
    status: 'UNSET' | 'SUCCESS' | 'ERROR';
    message: string;
    fieldErrors: Record<string, string[] | undefined>;
    timestamp: number;
};

const EMPTY_FORM_STATE: FormState = {
    status: 'UNSET' as const,
    message: '',
    fieldErrors: {},
    timestamp: Number(Date.now()),
};

const toFormState = (
    status: FormState['status'],
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
            status: 'ERROR' as const,
            message: '',
            fieldErrors: error.format(),
            timestamp: Date.now(),
        };
        // if another error instance, return error message
        // e.g. database error
    } else if (error instanceof Error) {
        return {
            status: 'ERROR' as const,
            message: error.message,
            fieldErrors: {},
            timestamp: Date.now(),
        };
        // if not an error instance but something else crashed
        // return generic error message
    } else {
        return {
            status: 'ERROR' as const,
            message: 'An unknown error occurred',
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




const timeStrToMinutes = (timeString: AllowedTime): number | undefined => {
    if (typeof timeString != "string") return;
    const parts = timeString.split(":");
    if (parts.length !== 2) return;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) return;

    return hours * 60 + minutes;

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

function extractMinutesFromDuration(input: AllowedDuration): number | undefined {
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
    duration: AllowedDuration,
    step: number = 15,
    excludeStart: boolean = false,
    excludeEnd: boolean = false,
): Set<number> {
    const range: Set<number> = new Set();
    const startMinutes = timeStrToMinutes(start);
    const durationMinutes = extractMinutesFromDuration(duration);


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

export type { FormState }
export { fromErrorToFormState, toFormState, resolvePath, timeStrToMinutes, extractMinutesFromDuration, extractTimeRange, EMPTY_FORM_STATE, };