import { DATA_I_CAN_ACTIONS } from "@/data";
import { TIME_BASED_DURATIONS, ALLOWED_TIMES } from "@/lib/definitions";
import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, time } from "drizzle-orm/pg-core";
import { z } from "zod";

export const famousPeopleTbl = pgTable("famous_people", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  personName: text("person_name").notNull(),
  occupation: text("occupation").notNull(),
  birth_year: integer("birth_year"),
  content: text("content").notNull(),
  source: text("source").notNull(),
  notes: text("notes").notNull(),
  wakeUpTime: time("wake_up_time"),
  sleepTime: time("sleep_time"),
});

export const famousRoutineActivitiesTbl = pgTable("famous_routine_activities", {
  activityId: serial("id").primaryKey(),
  activityName: text("activity_name").notNull(),
  startsAt: time("starts_at").notNull(),
  endsAt: time("ends_at").notNull(),
  famousPersonId: integer("famous_person_id").references(
    () => famousPeopleTbl.id,
    { onDelete: "cascade" }
  ),
});

export const famousPeopleRelations = relations(famousPeopleTbl, ({ many }) => ({
  activities: many(famousRoutineActivitiesTbl),
}));

export const famousRoutineActivitiesRelations = relations(
  famousRoutineActivitiesTbl,
  ({ one }) => ({
    person: one(famousPeopleTbl, {
      fields: [famousRoutineActivitiesTbl.famousPersonId],
      references: [famousPeopleTbl.id],
    }),
  })
);

export type FamousPersonRoutine =
  typeof famousRoutineActivitiesTbl.$inferSelect;

export type FamousPersonWithRoutines = Pick<
  typeof famousPeopleTbl.$inferSelect,
  "id" | "personName" | "image"
> & { routines: FamousPersonRoutine[] };
