'use server'
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { RemindKind } from './definitions';
import { SelectActionPlan } from '@/db/schema';
import { dbCreateActionPlan, dbDeleteActionPlan, dbUpdateActionPlan, getNextReminders } from '@/db/queries';
import * as _wasm from "@/pkg/planskop_rust";
import { ActionPlanEmailTemplate } from '../ui/EmailTemplates';
import { Resend } from 'resend';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function createActionPlan(formData: FormData) {

    const actionPlanObj = await prepareActionPlanData(formData);

    try {
        await dbCreateActionPlan(actionPlanObj);

    } catch (err) {
        console.log(err);
    }
    redirect("/dashboard");
}


export async function updateActionPlan(formData: FormData) {
    const actionPlanObj = await prepareActionPlanData(formData);

    try {
        await dbUpdateActionPlan(actionPlanObj);

    } catch (err) {
        console.log(err);
    }
    redirect("/dashboard");

}

export async function deleteActionPlan(id: number) {
    try {
        await dbDeleteActionPlan(id);
    } catch (err) {
        console.log(err);
    }
    redirect("/dashboard");
}

// Overload signatures for specific use cases
async function prepareActionPlanData<T extends SelectActionPlan>(formData: FormData): Promise<T> {
    const actionPlanObj = {} as T;

    const _wasmModule = await import('@/pkg/planskop_rust');
    const { format_ical, subtract_gmt_offset, get_next_remind_dt } = _wasmModule;

    // Populate the action plan object with form data
    for (let [key, val] of formData) {
        (actionPlanObj as any)[key] = val || null;
    }

    const byweekdayStr = formData.getAll("byweekday").join(",") || undefined;

    // Extract known fields
    const { dtstart, until, count, interval, frequency, timezone, remind } = actionPlanObj as any;

    // Subtract the timezone offset from dtstart
    const dtstartNoOffset = subtract_gmt_offset(dtstart, timezone);

    // Create the iCal rule using the wasm function
    actionPlanObj.rrule = format_ical(dtstartNoOffset, until, frequency, interval, count, byweekdayStr);

    // Set the next reminder time if applicable
    if (remind) {
        actionPlanObj.nextRemindAtTime = get_next_remind_dt(actionPlanObj.rrule, RemindKind[remind]);
    }

    return actionPlanObj;
}

const resend = new Resend(process.env.RESEND_PLANSKOP_API_KEY);

export async function testing() {
    const { will_send_reminder_email, get_next_remind_dt, calc_with_remind_kind, with_timezone_offset, get_local_now, RemindKind, Operation } = _wasm;
    get_local_now();
    try {
        const remindersRes = await getNextReminders();

        console.table(remindersRes)
        for (const r of remindersRes) {

            //r.nextRemindAtTime format is 2024-09-26 19:00:00+00 (drizzle postgres?)
            const t = r.nextRemindAtTime.split(" ").join("T").split("+")[0] + "Z";

            const sendReminder = will_send_reminder_email(t, r.timezone, RemindKind[r.remind]);



            let actionPlanDt = calc_with_remind_kind(t, RemindKind[r.remind], Operation.Add);



            actionPlanDt = with_timezone_offset(actionPlanDt, r.timezone);


            //const test = get_next_remind_dt(r.rrule, RemindKind[r.remind], t as string);
            console.log(sendReminder, "ssssssss--------")

            if (sendReminder) {
                const { data, error } = await resend.emails.send({
                    from: 'Planskop - Burak <planskop@kuyucakli.com>',
                    to: [r.userEmail as string],
                    subject: `Your action ${r.title} is on ${actionPlanDt}`,
                    react: ActionPlanEmailTemplate({ userName: r.userName, title: r.title, dt: actionPlanDt }),
                });
                console.log(data, error, "-*-*--0-0*-")
                if (data) {
                    const nextRemindAtTime = get_next_remind_dt(r.rrule, RemindKind[r.remind], t);
                    dbUpdateActionPlan(
                        {
                            id: r.id,
                            nextRemindAtTime
                        }
                    );
                }
            }
        }


    } catch (err) {
        return "err";

    }
    return "ok";
}