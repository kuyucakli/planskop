DO $$ BEGIN
 CREATE TYPE "public"."remind" AS ENUM('AtEventTime', 'OneHourBefore', 'TwoHoursBefore', 'OneDayBefore', 'TwoDaysBefore');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "action_plan" ADD COLUMN "remind" "remind";