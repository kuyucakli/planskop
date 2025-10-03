import styles from "@/components/navs/NavUser.module.css";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UserWelcomeTitle } from "../UserWelcomeTitle";
import Logo from "../Logo";
import { IconLogin } from "../Icons";

export default async function NavUser() {
  return (
    <nav className={styles.NavUser}>
      <SignedOut>
        <Logo onlyPictogram className="mr-1.5" />
        <SignInButton>
          <button className="flex gap-1 items-center text-xs">
            <IconLogin className="fill-white size-4" />
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Logo onlyPictogram />
        <UserButton />
        <UserWelcomeTitle />
      </SignedIn>
    </nav>
  );
}
