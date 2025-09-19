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
      <table
        role="presentation"
        align="center"
        cellPadding={0}
        cellSpacing={0}
        border={0}
      >
        <tr>
          <td>
            <img
              src="https://res.cloudinary.com/derfbfm9n/image/upload/v1758093474/sm-on-dark-planskop-pictogram_i6isyn.png"
              alt="Planskop Logo"
              width="48"
              height="48"
              style={{
                display: "block",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <img
              src="https://res.cloudinary.com/derfbfm9n/image/upload/v1758317507/reminder-good-morning-drawing-01_pjpq9u.jpg"
              alt="Planskop Logo"
              width="200"
              height="211"
              style={{
                display: "block",
                marginTop: "0px",
                marginBottom: "8px",
              }}
            />
          </td>
        </tr>
      </table>
      //
      <h2 style={{ fontWeight: "normal", fontSize: "24px" }}>
        {greeting}, {userFullName}!
      </h2>
      <p>Here’s your daily actions for today:</p>
      {sortSlots(dailySlots).map((s, i) => (
        <p key={i}>
          🔵
          {capitalizeFirstLetter(s.title)} at {s.at} for {s.duration}
          {s.description ? (
            <span style={{ fontSize: "14px", display: "block" }}>
              * {s.description}
            </span>
          ) : (
            ""
          )}
        </p>
      ))}
      <p style={{ marginTop: "20px" }}>
        Stay consistent — small steps every day build strong habits.
      </p>
      <p style={{ marginTop: "20px", fontSize: "13px" }}>
        Remember: You can add an image to each daily action to mark it as done.
        You have up to 1 day after the action ends to upload it.
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
    </div>
  );
}

export { ReminderEmail };
