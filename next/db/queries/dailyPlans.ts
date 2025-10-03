"use server";

import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  SelectActionCompletion,
  SelectDailyPlan,
  actionCompletions,
  dailyPlanTbl,
} from "../schemas/daily-plans-schema";
import { clerkClient } from "@clerk/nextjs/server";

type DbResult<T> = {
  data: T | null;
  error: string | null;
};

async function getDailyPlan(id: number): Promise<DbResult<SelectDailyPlan>> {
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

async function getDailyPlans(
  userId: string,
  page = 1,
  pageSize = 5
): Promise<DbResult<SelectDailyPlan[]>> {
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

async function getLatestPublicDailyPLans(limit = 4) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Step 1: Join daily plans with actionCompletions, filter by isPublic and startDate
  return await db
    .select({
      userId: dailyPlanTbl.userId,
      dailyPlanTitle: dailyPlanTbl.title,
      dailyPlanId: dailyPlanTbl.id,
      dailyPlanStartDate: dailyPlanTbl.startDate,
      dailyPlanRepeat: dailyPlanTbl.repeat,
      dailyPlanTimezone: dailyPlanTbl.timezone,
      completionId: actionCompletions.id,
      imageUrl: actionCompletions.imageUrl,
      actionId: actionCompletions.actionId,
      actionTitle: actionCompletions.actionTitle,
      actionTime: actionCompletions.actionTime,
      imagePublicId: actionCompletions.imagePublicId,
      completed: actionCompletions.completed,
    })
    .from(dailyPlanTbl)
    .innerJoin(
      actionCompletions,
      eq(actionCompletions.dailyPlanId, dailyPlanTbl.id)
    )
    .where(
      sql`${dailyPlanTbl.isPublic} = ${true} and ${
        dailyPlanTbl.startDate
      } <= ${todayStr}`
    )
    .orderBy(desc(dailyPlanTbl.startDate)); // nearest to today first
  // .limit(limit);
}

async function getActionSlotCompletion(
  id: string
): Promise<SelectActionCompletion[]> {
  return await db
    .select()
    .from(actionCompletions)
    .where(eq(actionCompletions.actionId, id));
}

async function getClerkUser(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const userData = {
    imgUrl: user.externalAccounts[0].imageUrl,
    fullName: user.fullName,
  };
  return userData;
}

export {
  getActionSlotCompletion,
  getDailyPlan,
  getDailyPlans,
  getLatestPublicDailyPLans,
  getClerkUser,
};
