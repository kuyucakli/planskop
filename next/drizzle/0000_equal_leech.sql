CREATE TYPE "public"."remind" AS ENUM('Morning', 'Afternoon', 'Evening', 'Night');--> statement-breakpoint
CREATE TYPE "public"."repeat" AS ENUM('1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '1 week', '2 weeks', '3 weeks', '1 month', '2 months', '3 months', '6 months', '7 months', '8 months', '9 months', '10 months', '11 months', '1 year');--> statement-breakpoint
CREATE TABLE "action_plan_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	CONSTRAINT "action_plan_category_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "action_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dtstart" date DEFAULT now() NOT NULL,
	"is_public" boolean NOT NULL,
	"next_remind_at_time" timestamp with time zone,
	"slots" varchar NOT NULL,
	"remind" "remind",
	"repeat" "repeat",
	"timezone" varchar NOT NULL,
	"updated_at" timestamp with time zone,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "famous_people" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"person_name" text NOT NULL,
	"occupation" text NOT NULL,
	"birth_year" integer,
	"content" text NOT NULL,
	"source" text NOT NULL,
	"notes" text NOT NULL,
	"wake_up_time" time,
	"sleep_time" time
);
--> statement-breakpoint
CREATE TABLE "famous_routine_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_name" text NOT NULL,
	"starts_at" time NOT NULL,
	"ends_at" time NOT NULL,
	"famous_person_id" integer
);
--> statement-breakpoint
ALTER TABLE "famous_routine_activities" ADD CONSTRAINT "famous_routine_activities_famous_person_id_famous_people_id_fk" FOREIGN KEY ("famous_person_id") REFERENCES "public"."famous_people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "next_remind_at_time_idx" ON "action_plan" USING btree ("next_remind_at_time");