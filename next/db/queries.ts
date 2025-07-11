"use server"

import { asc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
    InsertActionPlan, SelectActionPlan, UpdateActionPlan,
    dailyPlanTbl, famousPeopleTbl, famousRoutineActivitiesTbl
} from './schema';

import { revalidatePath } from 'next/cache';





export async function getActionPlan(id: number) {
    return db.select().from(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
}

export async function getActionPlans(userId: string, page = 1, pageSize = 5): Promise<SelectActionPlan[] | null> {

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







