"use client";

import { useUser } from "@clerk/nextjs";

export const UserWelcomeTitle = () => {
    const { user } = useUser();

    return (
        <span className="text-xs ml-4 capitalize">
            {user?.firstName || user?.username}<span className="normal-case">'s</span> routines
        </span >
    );
}