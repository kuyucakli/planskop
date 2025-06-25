import styles from "@/components/navs/NavUser.module.css";

import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { UserWelcomeTitle } from "../UserWelcomeTitle";


export default async function NavUser() {


    return (
        <nav className={styles.NavUser}>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
                <UserWelcomeTitle />
            </SignedIn>
        </nav>
    )
}