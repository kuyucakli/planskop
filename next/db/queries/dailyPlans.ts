"use server";

import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  SelectActionCompletion,
  SelectDailyPlan,
  actionCompletions,
  dailyPlanTbl,
} from "../schemas/daily-plans-schema";

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

async function getLatestPublicDailyPLans(limit = 4): Promise<
  DbResult<
    (SelectDailyPlan & {
      completions: Omit<SelectActionCompletion, "uploadedAt">[];
    })[]
  >
> {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    // Step 1: Join daily plans with actionCompletions, filter by isPublic and startDate
    const rows = await db
      .select({
        dailyPLanFields: dailyPlanTbl,
        completionId: actionCompletions.id,
        imageUrl: actionCompletions.imageUrl,
        actionId: actionCompletions.actionId,
        actionTitle: actionCompletions.actionTitle,
        imagePublicId: actionCompletions.imagePublicId,
        completed: actionCompletions.completed,
      })

      .from(dailyPlanTbl)
      .innerJoin(
        actionCompletions,
        eq(actionCompletions.dailyPlanId, dailyPlanTbl.id)
      ) // ensures at least one photo
      .where(
        sql`${dailyPlanTbl.isPublic} = ${true} and ${
          dailyPlanTbl.startDate
        } <= ${todayStr}`
      )
      .orderBy(desc(dailyPlanTbl.startDate)) // nearest to today first
      .limit(limit);

    if (!rows.length) return { data: null, error: null };

    const planWithCompletions = new Map<
      number,
      SelectDailyPlan & {
        completions: Omit<SelectActionCompletion, "uploadedAt">[];
      }
    >();

    for (const row of rows) {
      const planId = row.dailyPLanFields.id;

      if (!planWithCompletions.has(planId)) {
        planWithCompletions.set(planId, {
          ...row.dailyPLanFields,
          completions: [],
        });
      }

      planWithCompletions.get(planId)!.completions.push({
        id: row.completionId,
        userId: row.dailyPLanFields.userId,
        actionDate: row.dailyPLanFields.startDate,
        actionId: row.actionId,
        dailyPlanId: planId,
        imageUrl: row.imageUrl,
        actionTitle: row.actionTitle,
        imagePublicId: row.imagePublicId,
        completed: row.completed,
      });
    }

    const plansWithCompletions = Array.from(planWithCompletions.values());

    return { data: plansWithCompletions, error: null };
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";

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

async function getActionSlotCompletion(
  id: string
): Promise<SelectActionCompletion[]> {
  return await db
    .select()
    .from(actionCompletions)
    .where(eq(actionCompletions.actionId, id));
}

export {
  getActionSlotCompletion,
  getDailyPlan,
  getDailyPlans,
  getLatestPublicDailyPLans,
};
