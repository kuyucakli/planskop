"use client";

import { useUser } from "@clerk/nextjs";

export const UserWelcomeTitle = () => {
    const { user } = useUser();

    return (
        <span className="text-xs">
            {user?.firstName || user?.username}'s Routines
        </span>
    );
}