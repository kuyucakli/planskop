import styles from "@/components/navs/NavUser.module.css";
import Popover, { PopoverSet, PopoverToggleBtn } from "@/components/Popover";
import { ToggleThemeButton } from "@/components/Buttons";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'


export default async function NavUser() {


    return (
        <nav className={styles.NavUser}>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            {/* <ul>
                <li>
                    <PopoverSet>
                        <PopoverToggleBtn popoverTarget="user-popover">
                    
                        </PopoverToggleBtn>
                        <Popover id="user-popover">
                          

                            <ToggleThemeButton />

                        </Popover>
                    </PopoverSet>

                </li>
            </ul> */}
        </nav>
    )
}