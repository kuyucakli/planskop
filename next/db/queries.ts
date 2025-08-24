"use server";

import { asc, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  InsertActionPhoto,
  InsertActionPlan,
  SelectActionPhoto,
  SelectActionPlan,
  UpdateActionPlan,
  actionPhotos,
  dailyPlanTbl,
  famousPeopleTbl,
  famousRoutineActivitiesTbl,
} from "./schema";

import { v2 as cloudinary } from "cloudinary";

type DbResult<T> = {
  data: T | null;
  error: string | null;
};

//--- Action Plans ---

async function dbDeleteActionPlan(id: number) {
  const photos = await db
    .select({ publicId: actionPhotos.publicId })
    .from(actionPhotos)
    .where(eq(actionPhotos.dailyPlanId, id));

  const publicIds = photos.map((p) => p.publicId);

  try {
    await db.delete(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }
  } catch (err) {
    throw new Error("Failed to delete action plan: " + err);
  }
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

async function getActionPlan(id: number): Promise<DbResult<SelectActionPlan>> {
  try {
    const result = await db
      .select()
      .from(dailyPlanTbl)
      .where(eq(dailyPlanTbl.id, id));

    return {
      data: result[0] ?? null,
      error: null,
    };
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";

    // Full error message for dev, generic for prod
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : JSON.stringify(err);

    console.error("DB error fetching action plan:", err);

    return {
      data: null,
      error: isDev
        ? message
        : "Database error occurred. Please try again later.",
    };
  }
}

async function getActionPlans(
  userId: string,
  page = 1,
  pageSize = 5
): Promise<DbResult<SelectActionPlan[]>> {
  try {
    const result = await db
      .select()
      .from(dailyPlanTbl)
      .where(eq(dailyPlanTbl.userId, userId))
      .orderBy(asc(dailyPlanTbl.startDate))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";

    // Full error message for dev, generic for prod
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : JSON.stringify(err);

    console.error("DB error fetching action plan:", err);

    return {
      data: null,
      error: isDev
        ? message
        : "Database error occurred. Please try again later.",
    };
  }
}

async function getLatestPublicDailyPLan(): Promise<
  DbResult<
    SelectActionPlan & { photos: Omit<SelectActionPhoto, "uploadedAt">[] }
  >
> {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    // Step 1: Join daily plans with photos, filter by isPublic and startDate
    const rows = await db
      .select({
        dailyPLanFields: dailyPlanTbl,
        photoId: actionPhotos.id,
        imageUrl: actionPhotos.imageUrl,
        actionId: actionPhotos.actionId,
        actionTitle: actionPhotos.actionTitle,
        publicId: actionPhotos.publicId,
      })

      .from(dailyPlanTbl)
      .innerJoin(actionPhotos, eq(actionPhotos.dailyPlanId, dailyPlanTbl.id)) // ensures at least one photo
      .where(
        sql`${dailyPlanTbl.isPublic} = ${true} and ${
          dailyPlanTbl.startDate
        } <= ${todayStr}`
      )
      .orderBy(desc(dailyPlanTbl.startDate)) // nearest to today first
      .limit(1);

    if (!rows.length) return { data: null, error: null };

    const planWithPhotos = {
      ...rows[0].dailyPLanFields,
      photos: rows.map((r) => ({
        id: r.photoId,
        userId: r.dailyPLanFields.userId,
        actionDate: r.dailyPLanFields.startDate,
        actionId: r.actionId,
        dailyPlanId: r.dailyPLanFields.id,
        imageUrl: r.imageUrl,
        actionTitle: r.actionTitle,
        publicId: r.publicId,
      })),
    };

    return { data: planWithPhotos, error: null };
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";

    // Full error message for dev, generic for prod
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : JSON.stringify(err);

    console.error("DB error fetching action plan:", err);

    return {
      data: null,
      error: isDev
        ? message
        : "Database error occurred. Please try again later.",
    };
  }
}

//--- Famous People ---

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
  const ids = await db.select({ id: famousPeopleTbl.id }).from(famousPeopleTbl);

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

//--- Action Photos ---

async function dbCreateActionPhoto(data: InsertActionPhoto) {
  await db.insert(actionPhotos).values(data);
}

const getActionPhoto = async (actionId: string) => {
  try {
    return db
      .select()
      .from(actionPhotos)
      .where(eq(actionPhotos.actionId, actionId));
  } catch (err) {
    console.error("Error fetching actionæ photo:", err);
    return null;
  }
};

const getActionPhotosByDpId = async (
  dailyPlanId: number
): Promise<DbResult<SelectActionPhoto[]>> => {
  try {
    const actionPhotosRes = await db
      .select()
      .from(actionPhotos)
      .where(eq(actionPhotos.dailyPlanId, dailyPlanId));

    return {
      data: actionPhotosRes,
      error: null,
    };
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";

    // Full error message for dev, generic for prod
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : JSON.stringify(err);

    console.error("DB error fetching action plan:", err);

    return {
      data: null,
      error: isDev
        ? message
        : "Database error occurred. Please try again later.",
    };
  }
};

export {
  getActionPhoto,
  getActionPhotosByDpId,
  getActionPlan,
  getActionPlans,
  dbDeleteActionPlan,
  dbCreateActionPlan,
  dbCreateActionPhoto,
  dbUpdateActionPlan,
  getFamousPeopleWithRoutines,
  getFamousPersonWithRoutines,
  getLatestPublicDailyPLan,
  getRandomFamousPersonWithRoutines,
};
