import styles from "@/components/navs/NavUser.module.css";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UserWelcomeTitle } from "../UserWelcomeTitle";
import Logo from "../Logo";

export default async function NavUser() {
  return (
    <nav className={styles.NavUser}>
      <SignedOut>
        <Logo onlyPictogram />
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Logo onlyPictogram />
        <UserButton />
        <UserWelcomeTitle />
      </SignedIn>
    </nav>
  );
}
