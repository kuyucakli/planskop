import { DATA_I_CAN_ACTIONS } from "@/data";
import { extractTimeRange } from "@/lib/utils";
import {
  REMIND_AT,
  REPEAT_DURATIONS,
  ALLOWED_TIMES,
  TIME_BASED_DURATIONS,
  MAX_DAILY_ACTION_SLOTS,
} from "@/lib/definitions";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  date,
  varchar,
  pgEnum,
  boolean,
  json,
  unique,
} from "drizzle-orm/pg-core";
import { createUpdateSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const remindEnum = pgEnum("remind", REMIND_AT);
const repeatEnum = pgEnum("repeat", REPEAT_DURATIONS);

const dailyPlanTbl = pgTable("action_plan", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  startDate: date("startDate", { mode: "string" }).notNull().defaultNow(),
  isPublic: boolean("is_public"),
  slots: json("slots").notNull().$type<DailyActionSlot[]>(),
  remind: remindEnum("remind").notNull().default("No Remind"),
  repeat: repeatEnum("repeat"),
  timezone: varchar("timezone").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  userId: text("user_id").notNull(),
});

// 1. ZOD schemas generated from drizzle-zod
const baseInsertDailyPlanSchema = createInsertSchema(dailyPlanTbl);
const baseUpdateDailyPlanSchema = createUpdateSchema(dailyPlanTbl);
// 2. Shared extension for form validation
const sharedDailyPlanFields = (isUpdate: boolean) => ({
  title: z
    .string()
    .min(3, "Minimum 3, maximum 30 characters needed")
    .max(30, "Minimum 3, maximum 30 characters needed"),
  isPublic: z.preprocess((val) => val === "on" || val === true, z.boolean()),
  startDate: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date",
      }
    )
    .superRefine((val, ctx) => {
      if (!isUpdate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(val);
        if (date < today) {
          ctx.addIssue({
            code: "custom",
            message: "Date cannot be earlier than today",
          });
        }
      }
    }),
});

// 3. Final form schemas
const insertDailyPlanSchema = z.object({
  ...baseInsertDailyPlanSchema.shape,
  ...sharedDailyPlanFields(false),
});

const updateDailyPlanSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
  ...sharedDailyPlanFields(true),
});

// 3. Drizzle types — from the table (for DB access)
type InferInsertDp = typeof dailyPlanTbl.$inferInsert;

type InsertDailyPlan = InferInsertDp;

//type InsertDailyPlan = typeof DailyPlanTbl.$inferInsert;
type UpdateDailyPlan = typeof dailyPlanTbl.$inferSelect & {
  id: number;
};
type SelectDailyPlan = typeof dailyPlanTbl.$inferSelect;

// 4. Zod inference types — used in form validation / API inputs
type InsertDailyPlanInput = z.infer<typeof insertDailyPlanSchema>;
type UpdateDailyPlanInput = z.infer<typeof updateDailyPlanSchema>;

type DailyPlanCategoriesWithDailyPlans = (InsertDailyPlan & {
  DailyPlans: SelectDailyPlan[];
})[];

type DailyActionSlot = z.infer<typeof dailyActionSlotSchema>;

const dailyActionSlotSchema = z.object({
  id: z.string(),
  title: z.enum(DATA_I_CAN_ACTIONS, "Select from the list"),
  description: z.string().max(250).optional(),
  at: z.enum(ALLOWED_TIMES, "Select from the list"),
  duration: z.enum(TIME_BASED_DURATIONS, "Select from the list"),
});

const dailyActionsFormSchemaBase = z.object({
  slots: z
    .array(dailyActionSlotSchema)
    .min(1, "You must add at least one daily action slot.")
    .max(
      MAX_DAILY_ACTION_SLOTS,
      "You can add up to " + MAX_DAILY_ACTION_SLOTS + " daily action slots."
    )
    .superRefine((slots, ctx) => {
      const startTimes = new Set();
      const reserved: number[] = [];

      slots.forEach((slot, index) => {
        console.log("sdjskkhfkdfhkdfhdjfdfjfhdfjdhdjh");
        if (startTimes.has(slot.at)) {
          ctx.addIssue({
            code: "custom",
            message: `Start time "${slot.at}" is duplicated`,
            path: [index, "at"],
            input: slots,
          });
        } else {
          startTimes.add(slot.at);
        }

        const slotTimeRange = extractTimeRange(
          slot.at,
          slot.duration,
          15,
          false,
          true
        );

        for (const time of slotTimeRange) {
          if (reserved.includes(time)) {
            ctx.addIssue({
              code: "custom",
              message: `Time slot "${slot.at} - ${slot.duration}" overlaps with another action`,
              path: [index, "duration"],
              input: slots,
            });
          } else {
            reserved.push(time);
          }
        }
      });
    }),
});

const dailyActionsFormSchema = insertDailyPlanSchema.extend(
  dailyActionsFormSchemaBase.shape
);

const dailyActionsUpdateFormSchema = updateDailyPlanSchema.extend(
  dailyActionsFormSchemaBase.shape
);

type InsertActionCompletion = typeof actionCompletions.$inferInsert;
type SelectActionCompletion = typeof actionCompletions.$inferSelect;

const actionCompletions = pgTable(
  "action_completions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    actionDate: date("action_date").notNull(),
    actionTitle: text("action_title").notNull(),
    actionId: text("action_id").notNull(),
    dailyPlanId: integer("dailyPlanId")
      .references(() => dailyPlanTbl.id, { onDelete: "cascade" })
      .notNull(),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    completed: boolean("completed").default(false),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [unique().on(t.userId, t.actionDate, t.actionId)]
);

export {
  remindEnum,
  repeatEnum,
  dailyPlanTbl,
  baseInsertDailyPlanSchema,
  baseUpdateDailyPlanSchema,
  insertDailyPlanSchema,
  updateDailyPlanSchema,
  actionCompletions,
  dailyActionSlotSchema,
  dailyActionsFormSchema,
  dailyActionsUpdateFormSchema,
};

export type {
  InsertDailyPlan,
  UpdateDailyPlan,
  SelectDailyPlan,
  InsertDailyPlanInput,
  UpdateDailyPlanInput,
  DailyPlanCategoriesWithDailyPlans,
  DailyActionSlot,
  InsertActionCompletion,
  SelectActionCompletion,
};
