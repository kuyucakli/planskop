"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  famousPeopleTbl,
  famousRoutineActivitiesTbl,
} from "../schemas/famous-people-schema";

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

export {
  getFamousPeopleWithRoutines,
  getFamousPersonWithRoutines,
  getRandomFamousPersonWithRoutines,
};
