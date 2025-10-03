"use client";

// import { clerkClient } from "@clerk/nextjs/server";
import Avatar from "./Avatar";
import { useQuery } from "@tanstack/react-query";
import { getClerkUser } from "@/db/queries/dailyPlans";

const ClerkUserCard = ({
  userId,
  showUserName = false,
}: {
  userId: string;
  showUserName?: boolean;
}) => {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return getClerkUser(userId);
    },
  });

  if (!user) return;

  return (
    <section className="inline-flex items-center gap-2 ">
      <Avatar url={user.imgUrl} name={`${user.fullName}`} />

      {showUserName && <span className="text-xs">{user.fullName}</span>}
    </section>
  );
};

export default ClerkUserCard;
