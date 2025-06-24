'use server'

import { auth } from '@clerk/nextjs/server'
import { insertActionPlanSchema, updateActionPlanSchema, UserMessages } from '../db/schema'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache';
import { dbCreateActionPlan, dbDeleteActionPlan, dbUpdateActionPlan } from '@/db/queries';
import * as _wasm from "@/pkg/planskop_rust";
import { ZodSchema, z } from 'zod';
import { FormState, fromErrorToFormState, toFormState } from './utils'


// import { ActionPlanEmailTemplate } from '@/components/EmailTemplates';
// import { Resend } from 'resend';

export async function createUserMessage(formData: FormData) {
    const { userId } = await auth()
    if (!userId) throw new Error('User not found')

    const message = formData.get('message') as string
    await db.insert(UserMessages).values({
        user_id: userId,
        message,
    })
}

export async function deleteUserMessage() {
    const { userId } = await auth()
    if (!userId) throw new Error('User not found')

    await db.delete(UserMessages).where(eq(UserMessages.user_id, userId))
}



export async function createActionPlan(prevState: FormState, formData: FormData) {

    let validateRes;


    try {
        validateRes = insertActionPlanSchema.parse({
            title: formData.get('title'),
            text: formData.get('content'),
        });
        const actionPlanObj = await prepareActionPlanData(formData, insertActionPlanSchema);
        await dbCreateActionPlan(actionPlanObj);

    } catch (err) {
        return fromErrorToFormState(err);
    }
    revalidatePath("/dashboard");
    return toFormState('SUCCESS', 'Message created');
}


export async function updateActionPlan(formData: FormData) {
    const actionPlanObj = await prepareActionPlanData(formData, updateActionPlanSchema);

    try {
        await dbUpdateActionPlan(actionPlanObj);

    } catch (err) {
        console.log(err);
    }
    revalidatePath("/dashboard");

}

export async function deleteActionPlan(id: number) {
    try {
        await dbDeleteActionPlan(id);
    } catch (err) {
        console.log(err);
    }
    revalidatePath("/dashboard");
}



function formDataToObject(formData: FormData): Record<string, FormDataEntryValue> {
    const obj: Record<string, FormDataEntryValue> = {};
    for (const [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}

// Overload signatures for specific use cases
async function prepareActionPlanData<TSchema extends ZodSchema<any>>(
    formData: FormData,
    schema: TSchema
): Promise<z.infer<TSchema>> {

    const _wasmModule = await import('@/pkg/planskop_rust');
    const { format_ical, subtract_gmt_offset, get_next_remind_dt } = _wasmModule;

    const rawObj = formDataToObject(formData);
    const actionPlanObj = schema.parse(rawObj);


    const byweekdayStr = formData.getAll("byweekday").join(",") || undefined;

    // Extract known fields
    const { dtstart, until, count, interval, frequency, timezone, remind } = actionPlanObj;

    // Subtract the timezone offset from dtstart
    const dtstartNoOffset = subtract_gmt_offset(dtstart, timezone);

    // Create the iCal rule using the wasm function
    actionPlanObj.rrule = format_ical(dtstartNoOffset, until, frequency, interval, count, byweekdayStr);

    // Set the next reminder time if applicable
    if (remind) {
        actionPlanObj.nextRemindAtTime = get_next_remind_dt(actionPlanObj.rrule, remind);
    }

    return actionPlanObj;
}

// const resend = new Resend(process.env.RESEND_PLANSKOP_API_KEY);

// export async function testing() {
//     const { will_send_reminder_email, get_next_remind_dt, calc_with_remind_kind, with_timezone_offset, get_local_now, RemindKind, Operation } = _wasm;
//     get_local_now();
//     try {
//         const remindersRes = await getNextReminders();

//         console.table(remindersRes)
//         for (const r of remindersRes) {

//             //r.nextRemindAtTime format is 2024-09-26 19:00:00+00 (drizzle postgres?)
//             const t = r.nextRemindAtTime.split(" ").join("T").split("+")[0] + "Z";

//             const sendReminder = will_send_reminder_email(t, r.timezone, RemindKind[r.remind]);



//             let actionPlanDt = calc_with_remind_kind(t, RemindKind[r.remind], Operation.Add);



//             actionPlanDt = with_timezone_offset(actionPlanDt, r.timezone);


//             //const test = get_next_remind_dt(r.rrule, RemindKind[r.remind], t as string);
//             console.log(sendReminder, "ssssssss--------")

//             if (sendReminder) {
//                 const { data, error } = await resend.emails.send({
//                     from: 'Planskop - Burak <planskop@kuyucakli.com>',
//                     to: [r.userEmail as string],
//                     subject: `Your action ${r.title} is on ${actionPlanDt}`,
//                     react: ActionPlanEmailTemplate({ userName: r.userName, title: r.title, dt: actionPlanDt }),
//                 });
//                 console.log(data, error, "-*-*--0-0*-")
//                 if (data) {
//                     const nextRemindAtTime = get_next_remind_dt(r.rrule, RemindKind[r.remind], t);
//                     dbUpdateActionPlan(
//                         {
//                             id: r.id,
//                             nextRemindAtTime
//                         }
//                     );
//                 }
//             }
//         }


//     } catch (err) {
//         return "err";

//     }
//     return "ok";
// }