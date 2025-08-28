// emails/ReminderEmail.tsx
import { ReminderBody } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import * as React from "react";

async function ReminderEmail({
  userFullName,
  dailySlots,
}: Pick<ReminderBody, "dailySlots" | "userFullName">) {
  const { userId } = await auth();
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
      <h2>Hello {userFullName},</h2>
      <p>Here’s your daily plan for today:</p>
      <ul>
        {dailySlots.map((s, i) => (
          <li key={i}>{s.title}</li>
        ))}
      </ul>
      <p style={{ marginTop: "20px" }}>
        ✅ Stay consistent — small steps every day build strong habits.
      </p>
    </div>
  );
}

export { ReminderEmail };
