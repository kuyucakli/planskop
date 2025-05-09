import { auth } from "@/auth";
import { SignOut as ButtonSignOut, SignIn as ButtonSignIn } from "./Sign";
import Avatar from "./Avatar";
import styles from "./NavUser.module.css";
import Popover, { PopoverSet, PopoverToggleBtn } from "./Popover";
import { ToggleThemeButton } from "./Buttons";


export default async function NavUser() {

    const session = await auth();

    if (!session) {
        return <ButtonSignIn />;
    }

    return (
        <nav className={styles.NavUser}>
            <ul>
                <li>
                    <PopoverSet>
                        <PopoverToggleBtn popoverTarget="user-popover">
                            { }
                            <Avatar url={session.user?.image} name={session.user?.name} />
                        </PopoverToggleBtn>
                        <Popover id="user-popover">
                            <Avatar url={session.user?.image} name={session.user?.name} useCaption />

                            <ButtonSignOut />
                            <ToggleThemeButton />

                        </Popover>
                    </PopoverSet>

                </li>
            </ul>
        </nav>
    )
}