import { Client } from "@upstash/qstash";
import { ReminderBody } from "../definitions";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

/**
 * Schedule a daily reminder for a user
 */
export async function scheduleReminder(reminderBody: ReminderBody) {
  // Build cron: "0 X * * *" = every day at X:00 UTC
  const cron = `0 ${reminderBody.reminderHourUtc} * * *`;

  await client.schedules.create({
    scheduleId: `reminder-${reminderBody.dailyPlanId}`,
    destination: "https://planskop.vercel.app/api/reminder",
    cron,
    body: JSON.stringify(reminderBody),
  });
}

/**
 * Cancel an existing reminder
 */
export async function cancelReminder(dailyPlanId: number) {
  await client.schedules.delete(`reminder-${dailyPlanId}`);
}
