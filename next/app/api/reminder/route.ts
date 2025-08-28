// app/api/reminder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { ReminderEmail } from "@/components/email/ReminderEmail";
import { resend } from "@/lib/resend";
import { ReminderBody } from "@/lib/definitions";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("Upstash-Signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const bodyText = await req.text(); // raw text needed for verification

    const isValid = await receiver.verify({ signature, body: bodyText });
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body: ReminderBody = JSON.parse(bodyText);
    const { dailySlots, endUtcMs, startUtcMs, userEmail, userFullName } = body;
    const now = Date.now();
    // Skip if outside reminder range
    if (now < startUtcMs || now > endUtcMs)
      return NextResponse.json({ status: "skipped" });

    await resend.emails.send({
      from: "Planskop <onboarding@resend.dev>",
      to: userEmail,
      subject: "Your Daily Plan Reminder",
      react: ReminderEmail({ dailySlots, userFullName }),
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Reminder error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
