"use client";

import ClerkUserCard from "./ClerkUserCard";

export default function ClerkUserCardWrapper({ userId }: { userId: string }) {
  return <ClerkUserCard userId={userId} />;
}
