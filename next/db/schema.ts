import { DATA_I_CAN_ACTIONS } from "@/data";
import { extractTimeRange } from "@/lib/utils";
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, index, timestamp, date, varchar, pgEnum, time, boolean, json, unique } from 'drizzle-orm/pg-core';
import { createUpdateSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';


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
type AllowedTime = (typeof ALLOWED_TIMES)[number];

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
type AllowedDuration = (typeof ALLOWED_DURATIONS)[number];

const REPEAT_DURATIONS = [
    "1 day",
    "2 days",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "1 week",
    "2 weeks",
    "3 weeks",
    "1 month",
    "2 months",
    "3 months",
    "6 months",
    "7 months",
    "8 months",
    "9 months",
    "10 months",
    "11 months",
    "1 year"
] as const;
type RepeatDurations = (typeof REPEAT_DURATIONS)[number];

const REMIND_AT = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night"
] as const;
type remindAt = (typeof REMIND_AT)[number];



export const remindEnum = pgEnum("remind", REMIND_AT);
export const repeatEnum = pgEnum("repeat", REPEAT_DURATIONS);


export const dailyPlanTbl = pgTable('action_plan', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    dtstart: date('dtstart', { mode: "string" }).notNull().defaultNow(),
    isPublic: boolean('is_public'),
    // nextRemindAtTime: timestamp('next_remind_at_time', { withTimezone: true, mode: "string" }),
    slots: json('slots').notNull().$type<DailyActionSlot[]>(),
    // rrule: varchar('rrule').notNull(),
    remind: remindEnum("remind"),
    repeat: repeatEnum("repeat"),
    timezone: varchar('timezone').notNull(),
    // until: timestamp('until', { mode: "string" }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .$onUpdate(() => new Date()),
    userId: text('user_id').notNull(),
    // categoryId: integer('action_plan_category_id')
    //     .references(() => actionPlanCategoryTbl.id, { onDelete: 'cascade' }),
}, /*(table) => ([index("next_remind_at_time_idx").on(table.nextRemindAtTime),]) */)



export const actionPlanCategoryTbl = pgTable('action_plan_category', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).unique().notNull(),
})

export const actionPlanCategoryRelations = relations(actionPlanCategoryTbl, ({ many }) => ({
    actionPlans: many(dailyPlanTbl),
}));




// 1. ZOD schemas generated from drizzle-zod
export const baseInsertActionPlanSchema = createInsertSchema(dailyPlanTbl);
export const baseUpdateActionPlanSchema = createUpdateSchema(dailyPlanTbl);
// 2. Shared extension for form validation
const sharedActionPlanFields = {
    title: z.string().min(3).max(30),
    isPublic: z
        .union([z.literal("on"), z.boolean()])
        .transform((val) => val === "on"),
    dtstart: z
        .string()
        .min(1, "Date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, {
            message: "Invalid date",
        }),
};

// 3. Final form schemas
export const insertActionPlanSchema = baseInsertActionPlanSchema.extend(sharedActionPlanFields);

export const updateActionPlanSchema = baseUpdateActionPlanSchema.extend({
    id: z.preprocess((val) => Number(val), z.number().int().positive()), // required for update
    ...sharedActionPlanFields,
});

// 3. Drizzle types — from the table (for DB access)
type InferInsert = typeof dailyPlanTbl.$inferInsert;

export type InsertActionPlan = InferInsert;


//export type InsertActionPlan = typeof actionPlanTbl.$inferInsert;
export type UpdateActionPlan = Partial<InsertActionPlan> & { id: number };
export type SelectActionPlan = typeof dailyPlanTbl.$inferSelect;

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





const dailyActionSlotSchema = z.object({
    id: z.string(),
    title: z.enum(DATA_I_CAN_ACTIONS, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
    description: z.string().max(50).optional(),
    at: z.enum(ALLOWED_TIMES, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
    duration: z.enum(ALLOWED_DURATIONS, {
        errorMap: (issue) => ({ message: 'Select from the list' })
    }),
});

type DailyActionSlot = z.infer<typeof dailyActionSlotSchema>;

const dailyActionsFormSchemaBase = z.object({
    slots: z
        .array(dailyActionSlotSchema)
        .min(1, "You must add at least one daily action slot.")
        .max(5, "You can add up to 5 daily action slots.")
        .superRefine((slots, ctx) => {
            const startTimes = new Set();
            const reserved: number[] = [];
            const titleToIndex = new Map<string, number>();


            slots.forEach((slot, index) => {
                if (startTimes.has(slot.at)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Start time "${slot.at}" is duplicated`,
                        path: [index, 'at'],
                    });
                } else {
                    startTimes.add(slot.at);
                }

                const slotTimeRange = extractTimeRange(slot.at, slot.duration, 15, false, true);

                for (const time of slotTimeRange) {
                    if (reserved.includes(time)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Time slot "${slot.at} - ${slot.duration}" overlaps with another action`,
                            path: [index, 'duration'],
                        });
                    } else {
                        reserved.push(time);
                    }
                }



                const title = slot.title;

                if (titleToIndex.has(title)) {

                    const firstIndex = titleToIndex.get(title)!;

                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Title "${title}" is duplicated`,
                        path: [index, "title"],
                    });

                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Title "${title}" is also used here`,
                        path: [firstIndex, "title"],
                    });
                } else {
                    titleToIndex.set(title, index);
                }

            });
        })
});

const dailyActionsFormSchema = insertActionPlanSchema.merge(
    dailyActionsFormSchemaBase
);

const dailyActionsUpdateFormSchema = updateActionPlanSchema.merge(
    dailyActionsFormSchemaBase
)


export const actionPhotos = pgTable("action_photos", {
    id: serial("id").primaryKey(),
    userId: text('user_id').notNull(),
    actionDate: date("action_date").notNull(), // e.g. 2025-07-17
    actionId: text("action_id").notNull(),     // e.g. "0", "1" from JSON
    imageUrl: text("image_url").notNull(),     // stored in Cloudinary, etc.
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow(),
}, (t) => ([
    unique().on(t.userId, t.actionDate, t.actionId),
]));

export const likes = pgTable("likes", {
    id: serial("id").primaryKey(),
    userId: text('user_id').notNull(),
    targetId: integer("target_id").notNull(),
    targetType: text("target_type").notNull(), // 'post', 'image', etc.
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => ([
    unique().on(t.userId, t.targetId, t.targetType),
]));


export { ALLOWED_DURATIONS, ALLOWED_TIMES, dailyActionSlotSchema, dailyActionsFormSchema, dailyActionsUpdateFormSchema, REPEAT_DURATIONS, REMIND_AT, type DailyActionSlot, type AllowedTime, type AllowedDuration, type RepeatDurations, type remindAt };

