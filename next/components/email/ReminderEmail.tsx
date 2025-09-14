import { REMIND_AT } from "@/db/schema";
import { ReminderBody } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";
import { sortSlots } from "@/lib/utils/dailyPlan";
import * as React from "react";

async function ReminderEmail({
  dailyPlanId,
  userFullName,
  dailySlots,
  remind,
}: Pick<
  ReminderBody,
  "dailySlots" | "userFullName" | "dailyPlanId" | "remind"
>) {
  let greeting;
  switch (remind) {
    case REMIND_AT.MORNING:
      greeting = "Good morning";
      break;
    case REMIND_AT.AFTERNOON:
      greeting = "Good afternoon";
      break;
    case REMIND_AT.EVENING:
      greeting = "Good evening";
      break;
    default:
      greeting = "Hello";
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        lineHeight: "1.5",
        textAlign: "center",
        maxWidth: "700px",
        margin: "0 auto",
        border: "solid 1px #e6e6e6",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ fontWeight: "normal" }}>
        {greeting}, {userFullName}!
      </h2>
      <p>Here’s your daily actions for today:</p>
      <ul>
        {sortSlots(dailySlots).map((s, i) => (
          <li key={i}>
            {capitalizeFirstLetter(s.title)} at {s.at} for {s.duration}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "20px" }}>
        Stay consistent — small steps every day build strong habits.
      </p>
      <p style={{ textAlign: "center" }}>
        <a
          href={"https://planskop.vercel.app/habits/" + dailyPlanId}
          style={{
            backgroundColor: "#51a2ff",
            color: "white",
            fontWeight: "bold",
            padding: "20px 48px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          View Your Daily Plan
        </a>
      </p>
      <p style={{ marginTop: "20px", fontSize: "12px" }}>
        Remember: You can add an image to each daily action to mark it as done.
        You have up to 1 day after the action ends to upload it.
      </p>
    </div>
  );
}

export { ReminderEmail };
