import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const client = await clerkClient();
  const user = await client.users.getUser(id);

  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  });
}
