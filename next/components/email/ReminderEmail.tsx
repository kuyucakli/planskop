import { REMIND_AT } from "@/lib/definitions";
import { ReminderBody, ROUTES } from "@/lib/definitions";
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
        border: "solid 1px #e8e8e8",
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
          <td align="center" style={{ textAlign: "center" }}>
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
      </table>

      <table
        role="presentation"
        align="center"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ width: "100%" }}
      >
        <tr style={{ backgroundColor: "#68ff8c" }}>
          <td align="center" style={{ textAlign: "center" }}>
            <img
              src="https://res.cloudinary.com/derfbfm9n/image/upload/v1758356238/reminder-good-morning-drawing-vector-02_vlseus.png"
              alt="A new day..."
              width="290"
              height="235"
              style={{
                display: "block",
                margin: "0 auto 8px",
              }}
            />
          </td>
        </tr>
      </table>

      <h2 style={{ fontWeight: "bold", fontSize: "26px" }}>{greeting}</h2>
      <h3>Dear, {userFullName}</h3>
      <p>Here’s your daily actions for today:</p>
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ width: "100%", textAlign: "left" }}
      >
        {sortSlots(dailySlots).map((s, i) => (
          <>
            <tr key={i} style={{ margin: 0 }}>
              <td
                style={{
                  fontSize: "12px",
                  width: "32px",
                  height: "44px",
                  padding: "0",
                  margin: "0",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    border: "2px solid #04d49a",
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    margin: "2px 0",
                    paddingTop: "4px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "6px",
                      backgroundColor: "#81d9c3",
                      margin: "4px auto",
                    }}
                  ></span>
                </div>
              </td>
              <td style={{ paddingRight: "8px", height: "44px" }}>
                <p
                  style={{
                    fontSize: "15px",
                    backgroundColor: "#04d49a",
                    padding: "4px 20px 0",
                    height: "100%",
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                    border: "2px solid #04d49a",
                    margin: 0,
                  }}
                >
                  {capitalizeFirstLetter(s.title)} at{" "}
                  <span style={{ fontWeight: "bold" }}>{s.at}</span> for{" "}
                  <span style={{ fontWeight: "bold" }}>{s.duration}</span>
                </p>
              </td>
            </tr>
            {s.description ? (
              <tr style={{ margin: 0 }}>
                <td
                  style={{
                    fontSize: "12px",
                    width: "24px",
                    padding: "0",
                    margin: "0",
                  }}
                ></td>
                <td
                  style={{
                    padding: "4px 8px 0 0",
                    margin: "0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "4px 12px 12px 20px",
                      margin: 0,
                      backgroundColor: "#eee",
                      color: "#888888",
                    }}
                  >
                    <img
                      src="https://res.cloudinary.com/derfbfm9n/image/upload/v1758461058/info_16dp_888888_FILL0_wght400_GRAD0_opsz20_krdxkk.png"
                      width="16"
                      height="16"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    {s.description}
                  </p>
                </td>
              </tr>
            ) : (
              ""
            )}
          </>
        ))}
      </table>
      <p style={{ marginTop: "20px" }}>
        Stay consistent — small steps every day build strong habits.
      </p>
      <p style={{ margin: "20px auto 0", fontSize: "14px", maxWidth: "300px" }}>
        Remember: You can add an image to each daily action to mark it as done.
        You have up to 1 day after the action ends to upload it.
      </p>
      <p style={{ textAlign: "center", marginRight: "8px", marginLeft: "8px" }}>
        <a
          href={`${ROUTES.SITE_URL + ROUTES.DAILY_PLAN_DETAIL + dailyPlanId}`}
          style={{
            border: "2px solid #04d49a",
            color: "#04d49a",
            fontWeight: "bold",
            padding: "12px 48px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "block",
          }}
        >
          View Your Daily Plan
        </a>
      </p>
      <a
        target="_blank"
        href={`${ROUTES.SITE_URL + ROUTES.API_REMINDER_CANCEL}${dailyPlanId}`}
        style={{ fontSize: "12px" }}
      >
        Cancel this reminder
      </a>
    </div>
  );
}

export { ReminderEmail };
