"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const UserWelcomeTitle = () => {
  const { user } = useUser();

  return (
    <span className="text-xs ml-2 capitalize">
      <Link href="/">
        {user?.firstName ||
          user?.username ||
          user?.primaryEmailAddress?.emailAddress.split("@")[0]}
        <span className="normal-case">'s</span> Habit Planning
      </Link>
    </span>
  );
};
