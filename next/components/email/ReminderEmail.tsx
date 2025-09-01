import { ReminderBody } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";
import * as React from "react";

async function ReminderEmail({
  dailyPlanId,
  userFullName,
  dailySlots,
}: Pick<ReminderBody, "dailySlots" | "userFullName" | "dailyPlanId">) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
      <h2 style={{ fontWeight: "normal" }}>Hi {userFullName},</h2>
      <p>Here’s your daily plan for today:</p>
      <ul>
        {dailySlots.map((s, i) => (
          <li key={i}>
            {capitalizeFirstLetter(s.title)} at {s.at} for {s.duration}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "20px" }}>
        Stay consistent — small steps every day build strong habits.
      </p>
      <div style={{ textAlign: "center" }}>
        <a
          href={"https://planskop.vercel.app/habits/" + dailyPlanId}
          style={{
            backgroundColor: "#51a2ff",
            color: "black",
            fontWeight: "bold",
            padding: "20px 48px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          View Your Daily Plan
        </a>
      </div>
      <p style={{ marginTop: "20px", fontSize: "12px" }}>
        Remember: You can add an image to each daily action to mark it as done.
        You have up to 1 day after the action ends to upload it.
      </p>
    </div>
  );
}

export { ReminderEmail };
