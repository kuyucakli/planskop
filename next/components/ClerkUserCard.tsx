import { clerkClient } from "@clerk/nextjs/server";
import Avatar from "./Avatar";

const ClerkUserCard = async ({ userId }: { userId: string }) => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (
    <section className="inline-flex items-center gap-2 bg-neutral-800 p-2 rounded-lg shadow-lg">
      <Avatar
        url={user.externalAccounts[0].imageUrl}
        name={`${user.fullName}`}
      />
      <span className="text-xs">{user.fullName}</span>
    </section>
  );
};

export default ClerkUserCard;
