import { DATA_I_CAN_ACTIONS } from "@/data";
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, index, timestamp, varchar, pgEnum, time } from 'drizzle-orm/pg-core';
import { createUpdateSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';


export const UserMessages = pgTable('user_messages', {
    user_id: text('user_id').primaryKey().notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
    message: text('message').notNull(),
})



export const actionPlanEnum = pgEnum('state', ['on-hold', 'will-begin', 'test']);


export function enumToPgEnum(myEnum: any): [string, ...string[]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as [string, ...string[]]
}

export const remindEnum = pgEnum("remind", [
    'one_hour_before',
    'two_hours_before',
    'one_day_before',
    'two_days_before',
]);



export const actionPlanTbl = pgTable('action_plan', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    rrule: varchar('rrule').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .$onUpdate(() => new Date()),
    dtstart: timestamp('dtstart', { mode: "string" }).notNull(),
    until: timestamp('until', { mode: "string" }).notNull(),
    userId: text('user_id').notNull(),
    nextRemindAtTime: timestamp('next_remind_at_time', { withTimezone: true, mode: "string" }),
    remind: remindEnum("remind"),
    timezone: varchar('timezone').notNull(),
    categoryId: integer('action_plan_category_id')
        .references(() => actionPlanCategoryTbl.id, { onDelete: 'cascade' }),
}, (table) => ([index("next_remind_at_time_idx").on(table.nextRemindAtTime),]))



export const actionPlanCategoryTbl = pgTable('action_plan_category', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).unique().notNull(),
})

export const actionPlanCategoryRelations = relations(actionPlanCategoryTbl, ({ many }) => ({
    actionPlans: many(actionPlanTbl),
}));




// 1. ZOD schemas generated from drizzle-zod
export const baseInsertActionPlanSchema = createInsertSchema(actionPlanTbl);
export const baseUpdateActionPlanSchema = createUpdateSchema(actionPlanTbl);
// 2. For frontend forms
export const insertActionPlanSchema = baseInsertActionPlanSchema.extend({
    title: z.string().min(3).max(255),
    count: z.string().optional(),
    interval: z.string().optional(),
    frequency: z.string().optional(),
    //remind: z.nativeEnum(RemindKind).optional(), // for dropdowns etc.
});

export const updateActionPlanSchema = baseUpdateActionPlanSchema.extend({
    id: z.number(), // required for `.where(...)`
});

// 3. Drizzle types — from the table (for DB access)
type InferInsert = typeof actionPlanTbl.$inferInsert;

export type InsertActionPlan = InferInsert;


//export type InsertActionPlan = typeof actionPlanTbl.$inferInsert;
export type UpdateActionPlan = Partial<InsertActionPlan> & { id: number };
export type SelectActionPlan = typeof actionPlanTbl.$inferSelect;

// 4. Zod inference types — used in form validation / API inputs
export type InsertActionPlanInput = z.infer<typeof insertActionPlanSchema>;
export type UpdateActionPlanInput = z.infer<typeof updateActionPlanSchema>;




export type InsertActionPlanAlbum = typeof actionPlanCategoryTbl.$inferInsert;
export type SelectActionPlanAlbum = typeof actionPlanCategoryTbl.$inferSelect;

export type ActionPlanCategoriesWithActionPlans = (InsertActionPlan & { actionPlans: SelectActionPlan[] })[];




export const famousPeopleTbl = pgTable('famous_people', {
    id: serial('id').primaryKey(),
    image: text('image').notNull(),
    personName: text('person_name').notNull(),
    occupation: text('occupation').notNull(),
    birth_year: integer('birth_year'),
    content: text('content').notNull(),
    source: text('source').notNull(),
    notes: text('notes').notNull(),
    wakeUpTime: time('wake_up_time'),
    sleepTime: time('sleep_time'),

})

export const famousRoutineActivitiesTbl = pgTable('famous_routine_activities', {
    activityId: serial('id').primaryKey(),
    activityName: text('activity_name').notNull(),
    startsAt: time('starts_at').notNull(),
    endsAt: time('ends_at').notNull(),
    famousPersonId: integer('famous_person_id').references(() => famousPeopleTbl.id, { onDelete: 'cascade' }),
})


export const famousPeopleRelations = relations(famousPeopleTbl, ({ many }) => ({
    activities: many(famousRoutineActivitiesTbl),
}));


export const famousRoutineActivitiesRelations = relations(famousRoutineActivitiesTbl, ({ one }) => ({
    person: one(famousPeopleTbl, {
        fields: [famousRoutineActivitiesTbl.famousPersonId],
        references: [famousPeopleTbl.id],
    }),
}));

export type FamousPersonRoutine = typeof famousRoutineActivitiesTbl.$inferSelect;

export type FamousPersonWithRoutines = Pick<typeof famousPeopleTbl.$inferSelect, 'id' | 'personName' | 'image'> & { routines: FamousPersonRoutine[] };



const ALLOWED_TIMES = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45"
] as const;

const ALLOWED_DURATIONS = [
    "15 min",
    "30 min",
    "45 min",
    "1 hour",
    "1 hour 15 min",
    "1½ hours",
    "1 hour 45 min",
    "2 hours",
    "2 hours 15 min",
    "2½ hours",
    "2 hours 45 min",
    "3 hours",
    "3 hours 15 min",
    "3½ hours",
    "3 hours 45 min",
    "4 hours",
    "4 hours 15 min",
    "4½ hours",
    "4 hours 45 min",
    "5 hours",
    "5 hours 15 min",
    "5½ hours",
    "5 hours 45 min",
    "6 hours"
] as const;



const dailyActionSlotSchema = z.object({
    id: z.string().optional(),
    title: z.enum(DATA_I_CAN_ACTIONS, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
    description: z.string().max(50).optional(),
    at: z.enum(ALLOWED_TIMES, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
    for: z.enum(ALLOWED_DURATIONS, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
});

const dailyActionsFormSchema = insertActionPlanSchema.merge(
    z.object({
        slots: z
            .array(dailyActionSlotSchema)
            .min(1, "You must add at least one daily action slot.")
            .max(5, "You can add up to 5 daily action slots."),
    })
);



export { ALLOWED_DURATIONS, ALLOWED_TIMES, dailyActionSlotSchema, dailyActionsFormSchema };

