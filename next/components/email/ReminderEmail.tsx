import { ReminderBody } from "@/lib/definitions";
import * as React from "react";

async function ReminderEmail({
  dailyPlanId,
  userFullName,
  dailySlots,
}: Pick<ReminderBody, "dailySlots" | "userFullName" | "dailyPlanId">) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
      <h2>Hello {userFullName},</h2>
      <p>Here’s your daily plan for today:</p>
      <ul>
        {dailySlots.map((s, i) => (
          <li key={i}>
            {s.title} at {s.at} for {s.duration}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "20px" }}>
        ✅ Stay consistent — small steps every day build strong habits.
      </p>
      <a
        href={"https://planskop.vercel.app/habits/" + dailyPlanId}
        style={{
          backgroundColor: "#2b7fff", // Tailwind `bg-blue-600`
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        View Your Daily Plan
      </a>
      <p style={{ marginTop: "20px", fontSize: "12px" }}>
        Remember: You can add an image to each daily action to mark it as done.
        You have up to 1 day after the action ends to upload it.
      </p>
    </div>
  );
}

export { ReminderEmail };
