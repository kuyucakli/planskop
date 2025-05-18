import { RemindKind } from '@/pkg/planskop_rust';
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



// export const postTbl = pgTable('post', {
//     id: serial('id').primaryKey(),
//     title: text('title').notNull(),
//     content: text('content').notNull(),
//     userId: text('user_id')
//         .notNull()
//         .references(() => userTbl.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at')
//         .notNull()
//         .$onUpdate(() => new Date()),
// });




// export const actionPlanRelations = relations(actionPlanTbl, ({ one }) => ({
//     user: one(userTbl, { fields: [actionPlanTbl.userId], references: [userTbl.id] }),
//     category: one(actionPlanCategoryTbl, {
//         fields: [actionPlanTbl.categoryId],
//         references: [actionPlanCategoryTbl.id],
//     }),
// }));


