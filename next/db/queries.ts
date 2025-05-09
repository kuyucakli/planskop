"use server"

import { asc, between, count, eq, ne, getTableColumns, sql, gt } from 'drizzle-orm';
import { db } from '@/db';
import { InsertActionPlan, SelectActionPlan, SelectPost, SelectUser, actionPlanTbl, postTbl, userTbl, } from './schema';
import { revalidatePath } from 'next/cache';
import { act } from 'react-dom/test-utils';



/* Users */

export async function getUserById(id: SelectUser['id']): Promise<
    Array<SelectUser>
> {
    return db.select().from(userTbl).where(eq(userTbl.id, id));
}

export async function getUserByEmail(email: string) {
    try {
        return db.select().from(userTbl).where(eq(userTbl.email, email));
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export async function getPostsForLast24Hours(
    page = 1,
    pageSize = 5,
): Promise<
    Array<{
        id: number;
        title: string;
    }>
> {
    return db
        .select({
            id: postTbl.id,
            title: postTbl.title,
        })
        .from(postTbl)
        .where(between(postTbl.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        .orderBy(asc(postTbl.title), asc(postTbl.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
}



export async function getSlow() {
    try {
        // We artificially delay a response for demo purposes.
        // Don't do this in production :)
        console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 6000));

        const data = await getPostsForLast24Hours();

        console.log('Data fetch completed after 3 seconds.');

        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function getActionPlan(id: number) {
    return db.select().from(actionPlanTbl).where(eq(actionPlanTbl.id, id));
}

export async function getActionPlans(userId: string, page = 1, pageSize = 5): Promise<Partial<SelectActionPlan>[]> {

    return db
        .select({
            ...getTableColumns(actionPlanTbl),
        })
        .from(actionPlanTbl)
        .where(eq(actionPlanTbl.userId, userId))
        .orderBy(asc(actionPlanTbl.title), asc(actionPlanTbl.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
}

export async function getNextReminders() {
    // We can check for the actionPlan user has email or email verified
    return db.select({ userName: userTbl.name, userEmail: userTbl.email, nextRemindAtTime: actionPlanTbl.nextRemindAtTime, title: actionPlanTbl.title, timezone: actionPlanTbl.timezone, remind: actionPlanTbl.remind, id: actionPlanTbl.id, rrule: actionPlanTbl.rrule })
        .from(actionPlanTbl)
        .innerJoin(userTbl, eq(userTbl.id, actionPlanTbl.userId))
        .where(sql`${actionPlanTbl.nextRemindAtTime} >= (now() at time zone 'utc' - INTERVAL '4 minutes')`);
}


export async function dbDeleteActionPlan(id: number) {
    await db.delete(actionPlanTbl).where(eq(actionPlanTbl.id, id));
    revalidatePath("/");

}

export async function dbCreateActionPlan(data: InsertActionPlan) {
    await db.insert(actionPlanTbl).values(data);
}

export async function dbUpdateActionPlan(data: Partial<Omit<SelectActionPlan, 'id'>> & { id: number }) {
    try {
        await db.update(actionPlanTbl).set(data).where(eq(actionPlanTbl.id, data.id));
        console.log("updated with", data.nextRemindAtTime);
    } catch (err) {
        console.log(err);
    }

}


