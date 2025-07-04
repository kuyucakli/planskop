"use server"

import { asc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
    InsertActionPlan, SelectActionPlan, UpdateActionPlan,
    dailyPlanTbl, famousPeopleTbl, famousRoutineActivitiesTbl
} from './schema';
import { revalidatePath } from 'next/cache';




/* Users */

// export async function getUserById(id: SelectUser['id']): Promise<
//     Array<SelectUser>
// > {
//     return db.select().from(userTbl).where(eq(userTbl.id, id));
// }

// export async function getUserByEmail(email: string) {
//     try {
//         return db.select().from(userTbl).where(eq(userTbl.email, email));
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     }
// }


// export async function getPostsForLast24Hours(
//     page = 1,
//     pageSize = 5,
// ): Promise<
//     Array<{
//         id: number;
//         title: string;
//     }>
// > {
//     return db
//         .select({
//             id: postTbl.id,
//             title: postTbl.title,
//         })
//         .from(postTbl)
//         .where(between(postTbl.createdAt, sql`now() - interval '1 day'`, sql`now()`))
//         .orderBy(asc(postTbl.title), asc(postTbl.id))
//         .limit(pageSize)
//         .offset((page - 1) * pageSize);
// }



// export async function getSlow() {
//     try {
//         // We artificially delay a response for demo purposes.
//         // Don't do this in production :)
//         console.log('Fetching revenue data...');
//         await new Promise((resolve) => setTimeout(resolve, 6000));

//         const data = await getPostsForLast24Hours();

//         console.log('Data fetch completed after 3 seconds.');

//         return data;
//     } catch (error) {
//         console.error('Database Error:', error);
//         throw new Error('Failed to fetch revenue data.');
//     }
// }

export async function getActionPlan(id: number) {
    return db.select().from(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
}

export async function getActionPlans(userId: string, page = 1, pageSize = 5): Promise<Partial<SelectActionPlan>[] | null> {

    try {
        return db
            .select({
                ...getTableColumns(dailyPlanTbl),
            })
            .from(dailyPlanTbl)
            .where(eq(dailyPlanTbl.userId, userId))
            .orderBy(asc(dailyPlanTbl.title), asc(dailyPlanTbl.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize);
    }
    catch (err) {
        console.log("err");
        return null;
    }


}



export async function dbDeleteActionPlan(id: number) {
    await db.delete(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
    revalidatePath("/");

}


export async function dbCreateActionPlan(data: InsertActionPlan) {
    await db.insert(dailyPlanTbl).values(data);
}

export async function dbUpdateActionPlan(data: UpdateActionPlan) {
    try {
        await db.update(dailyPlanTbl).set(data).where(eq(dailyPlanTbl.id, data.id));

    } catch (err) {
        console.log(err);
    }

}


export const getFamousPeopleWithRoutines = async () => {
    return db
        .select({
            personId: famousPeopleTbl.id,
            personName: famousPeopleTbl.personName,
            image: famousPeopleTbl.image,
            activityId: famousRoutineActivitiesTbl.activityId,
            activityName: famousRoutineActivitiesTbl.activityName,
            startsAt: famousRoutineActivitiesTbl.startsAt,
            endsAt: famousRoutineActivitiesTbl.endsAt,
        })
        .from(famousPeopleTbl)
        .innerJoin(famousRoutineActivitiesTbl, eq(famousPeopleTbl.id, famousRoutineActivitiesTbl.famousPersonId));
}





// export async function getNextReminders() {
//     // We can check for the actionPlan user has email or email verified
//     return db.select({ userName: userTbl.name, userEmail: userTbl.email, nextRemindAtTime: actionPlanTbl.nextRemindAtTime, title: actionPlanTbl.title, timezone: actionPlanTbl.timezone, remind: actionPlanTbl.remind, id: actionPlanTbl.id, rrule: actionPlanTbl.rrule })
//         .from(actionPlanTbl)
//         .innerJoin(userTbl, eq(userTbl.id, actionPlanTbl.userId))
//         .where(sql`${actionPlanTbl.nextRemindAtTime} >= (now() at time zone 'utc' - INTERVAL '4 minutes')`);
// }



