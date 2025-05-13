import { RemindKind } from '@/pkg/planskop_rust';
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, index, timestamp, varchar, boolean, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { createSelectSchema, createUpdateSchema, createInsertSchema } from 'drizzle-zod';
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
export const remindEnum = pgEnum("remind", enumToPgEnum(RemindKind));

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
    userId: text('user_id').notNull().references(() => UserMessages.user_id, { onDelete: 'cascade' }),
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

// Omit<InferInsert, 'remind'> & {
//     remind?: RemindKind;
// };
//export type InsertActionPlan = typeof actionPlanTbl.$inferInsert;
export type UpdateActionPlan = Partial<InsertActionPlan> & { id: number };
export type SelectActionPlan = typeof actionPlanTbl.$inferSelect;

// 4. Zod inference types — used in form validation / API inputs
export type InsertActionPlanInput = z.infer<typeof insertActionPlanSchema>;
export type UpdateActionPlanInput = z.infer<typeof updateActionPlanSchema>;




export type InsertActionPlanAlbum = typeof actionPlanCategoryTbl.$inferInsert;
export type SelectActionPlanAlbum = typeof actionPlanCategoryTbl.$inferSelect;

export type ActionPlanCategoriesWithActionPlans = (InsertActionPlan & { actionPlans: SelectActionPlan[] })[];



// export const userTbl = pgTable('user', {
//     id: text("id")
//         .primaryKey()
//         .$defaultFn(() => crypto.randomUUID()),
//     name: text('name'),
//     email: text('email').unique(),
//     emailVerified: timestamp("emailVerified", { mode: "date" }),
//     image: text("image"),

// });

// export const accountTbl = pgTable(
//     "account",
//     {
//         userId: text("user_id")
//             .notNull()
//             .references(() => userTbl.id, { onDelete: "cascade" }),
//         type: text("type").$type<AdapterAccountType>().notNull(),
//         provider: text("provider").notNull(),
//         providerAccountId: text("providerAccountId").notNull(),
//         refresh_token: text("refresh_token"),
//         access_token: text("access_token"),
//         expires_at: integer("expires_at"),
//         token_type: text("token_type"),
//         scope: text("scope"),
//         id_token: text("id_token"),
//         session_state: text("session_state"),
//     },
//     (account) => ({
//         compoundKey: primaryKey({
//             columns: [account.provider, account.providerAccountId],
//         }),
//     })
// )

// export const sessionTbl = pgTable("session", {
//     sessionToken: text("session_token").primaryKey(),
//     userId: text("user_id")
//         .notNull()
//         .references(() => userTbl.id, { onDelete: "cascade" }),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
// })

// export const verificationTokenTbl = pgTable(
//     "verification_token",
//     {
//         identifier: text("identifier").notNull(),
//         token: text("token").notNull(),
//         expires: timestamp("expires", { mode: "date" }).notNull(),
//     },
//     (verificationToken) => ({
//         compositePk: primaryKey({
//             columns: [verificationToken.identifier, verificationToken.token],
//         }),
//     })
// )

// export const authenticatorTbl = pgTable(
//     "authenticator",
//     {
//         credentialID: text("credentialID").notNull().unique(),
//         userId: text("user_id")
//             .notNull()
//             .references(() => userTbl.id, { onDelete: "cascade" }),
//         providerAccountId: text("providerAccountId").notNull(),
//         credentialPublicKey: text("credentialPublicKey").notNull(),
//         counter: integer("counter").notNull(),
//         credentialDeviceType: text("credentialDeviceType").notNull(),
//         credentialBackedUp: boolean("credentialBackedUp").notNull(),
//         transports: text("transports"),
//     },
//     (authenticator) => ({
//         compositePK: primaryKey({
//             columns: [authenticator.userId, authenticator.credentialID],
//         }),
//     })
// )


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
// --- Relations --- //

// export const userRelations = relations(userTbl, ({ many }) => ({
//     actionPlans: many(actionPlanTbl),
// }));

// export const actionPlanRelations = relations(actionPlanTbl, ({ one }) => ({
//     user: one(userTbl, { fields: [actionPlanTbl.userId], references: [userTbl.id] }),
//     category: one(actionPlanCategoryTbl, {
//         fields: [actionPlanTbl.categoryId],
//         references: [actionPlanCategoryTbl.id],
//     }),
// }));

// export const actionPlanCategoryRelations = relations(actionPlanCategoryTbl, ({ many }) => ({
//     actionPlans: many(actionPlanTbl),
// }));


// export type InsertUser = typeof userTbl.$inferInsert;
// export type SelectUser = typeof userTbl.$inferSelect;

// export type InsertPost = typeof postTbl.$inferInsert;
// export type SelectPost = typeof postTbl.$inferSelect;

//export type InsertActionPlan = typeof actionPlanTbl.$inferInsert;
