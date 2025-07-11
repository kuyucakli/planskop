"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const UserWelcomeTitle = () => {
    const { user } = useUser();

    return (
        <span className="text-xs ml-4 capitalize">
            <Link href="/">
                {user?.firstName || user?.username}<span className="normal-case">'s</span> routines
            </Link>
        </span >
    );
}