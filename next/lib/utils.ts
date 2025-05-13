import { ZodError } from 'zod';

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
            fieldErrors: error.flatten().fieldErrors,
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

export type { FormState }
export { fromErrorToFormState, toFormState, EMPTY_FORM_STATE };