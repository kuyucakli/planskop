"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  actionCompletions,
  dailyPlanTbl,
  InsertActionCompletion,
  InsertDailyPlan,
  UpdateDailyPlan,
} from "../schemas/daily-plans-schema";

import { v2 as cloudinary } from "cloudinary";

type DbResult<T> = {
  data: T | null;
  error: string | null;
};

async function dbDeleteDailyPlan(id: number) {
  const completions = await db
    .select({ imagePublicId: actionCompletions.imagePublicId })
    .from(actionCompletions)
    .where(eq(actionCompletions.dailyPlanId, id));

  const publicIds = completions
    .map((p) => p.imagePublicId)
    .filter((id): id is string => id !== null);

  try {
    await db.delete(dailyPlanTbl).where(eq(dailyPlanTbl.id, id));
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }
  } catch (err) {
    throw new Error("Failed to delete action plan: " + err);
  }
}

async function dbCreateDailyPlan(data: InsertDailyPlan) {
  try {
    const [result] = await db
      .insert(dailyPlanTbl)
      .values(data)
      .returning({ id: dailyPlanTbl.id });
    return {
      data: result,
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : JSON.stringify(err);
    return {
      data: null,
      error: message,
    };
  }
}

async function dbUpdateDailyPlan(data: UpdateDailyPlan) {
  try {
    await db.update(dailyPlanTbl).set(data).where(eq(dailyPlanTbl.id, data.id));
  } catch (err) {
    throw new Error("Failed to update action plan: " + err);
  }
}

async function upsertActionSlotCompletion(props: InsertActionCompletion) {
  const { completed, imagePublicId, imageUrl } = props;
  return await db
    .insert(actionCompletions)
    .values({ ...props })
    .onConflictDoUpdate({
      target: [
        actionCompletions.userId,
        actionCompletions.actionDate,
        actionCompletions.actionId,
      ],
      set: { completed, imagePublicId, imageUrl },
    })
    .returning();
}

async function deleteActionSlotCompletion(
  id: number,
  imagePublicId?: string | null
) {
  if (imagePublicId) {
    try {
      await cloudinary.api.delete_resources([imagePublicId]);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    } finally {
    }
  }
  return await db
    .delete(actionCompletions)
    .where(eq(actionCompletions.id, id))
    .returning();
}

export {
  dbDeleteDailyPlan,
  dbCreateDailyPlan,
  deleteActionSlotCompletion,
  dbUpdateDailyPlan,
  upsertActionSlotCompletion,
};
