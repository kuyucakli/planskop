"use server"

import { asc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
    InsertActionPhoto,
    InsertActionPlan, SelectActionPlan, UpdateActionPlan,
    actionPhotos,
    dailyPlanTbl, famousPeopleTbl, famousRoutineActivitiesTbl
} from './schema';



//Action Plans

async function dbDeleteActionPlan(id: number) {
    await db.delete(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
}

async function dbCreateActionPlan(data: InsertActionPlan) {
    await db.insert(dailyPlanTbl).values(data);
}

async function dbUpdateActionPlan(data: UpdateActionPlan) {
    try {
        await db.update(dailyPlanTbl).set(data).where(eq(dailyPlanTbl.id, data.id));
    } catch (err) {
        throw new Error("Failed to update action plan: " + err);
    }
}

async function getActionPlan(id: number) {
    return db.select().from(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
}

async function getActionPlans(userId: string, page = 1, pageSize = 5): Promise<SelectActionPlan[] | null> {
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





//Famous People

const baseFamousRoutineQuery = db
    .select({
        personId: famousPeopleTbl.id,
        personName: famousPeopleTbl.personName,
        personContent: famousPeopleTbl.content,
        image: famousPeopleTbl.image,
        activityId: famousRoutineActivitiesTbl.activityId,
        activityName: famousRoutineActivitiesTbl.activityName,
        startsAt: famousRoutineActivitiesTbl.startsAt,
        endsAt: famousRoutineActivitiesTbl.endsAt,
    })
    .from(famousPeopleTbl)
    .innerJoin(
        famousRoutineActivitiesTbl,
        eq(famousPeopleTbl.id, famousRoutineActivitiesTbl.famousPersonId)
    );

const getFamousPeopleWithRoutines = async () => {
    return baseFamousRoutineQuery;
};

const getFamousPersonWithRoutines = async (personId: number) => {
    return baseFamousRoutineQuery.where(eq(famousPeopleTbl.id, personId));
};

const getRandomFamousPersonWithRoutines = async () => {
    const ids = await db
        .select({ id: famousPeopleTbl.id })
        .from(famousPeopleTbl);

    if (ids.length === 0) return null;

    const randomId = ids[Math.floor(Math.random() * ids.length)].id;

    return db
        .select({
            personId: famousPeopleTbl.id,
            personName: famousPeopleTbl.personName,
            personContent: famousPeopleTbl.content,
            image: famousPeopleTbl.image,
            activityId: famousRoutineActivitiesTbl.activityId,
            activityName: famousRoutineActivitiesTbl.activityName,
            startsAt: famousRoutineActivitiesTbl.startsAt,
            endsAt: famousRoutineActivitiesTbl.endsAt,
        })
        .from(famousPeopleTbl)
        .innerJoin(
            famousRoutineActivitiesTbl,
            eq(famousPeopleTbl.id, famousRoutineActivitiesTbl.famousPersonId)
        )
        .where(eq(famousPeopleTbl.id, randomId));
};


//Action Photos

async function dbCreateActionPhoto(data:InsertActionPhoto) {
  
    await db.insert(actionPhotos).values(data);
    
}

const getActionPhoto = async (actionId: number) => {
    return db
        .select()
        .from(actionPhotos)
        .where( eq(actionPhotos, actionId) );

};

export {
    getActionPlan,
    getActionPlans,
    dbDeleteActionPlan,
    dbCreateActionPlan,
    dbCreateActionPhoto,
    dbUpdateActionPlan,
    getFamousPeopleWithRoutines,
    getFamousPersonWithRoutines,
    getRandomFamousPersonWithRoutines
};







