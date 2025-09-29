import { ROUTES } from "@/lib/definitions";
import { Client } from "@upstash/qstash";
import { NextRequest } from "next/server";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await client.schedules.delete(`reminder-${id}`);

    return Response.redirect(
      new URL(`/reminder/cancelled?id=${id}`, ROUTES.SITE_URL),
      302
    );
  } catch (error: any) {
    return Response.redirect(
      new URL(`/reminder/error?id=${id}`, ROUTES.SITE_URL),
      302
    );
  }
}
