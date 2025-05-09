import { signIn, signOut } from "@/auth"
import { IconUserCircle } from "./Icons"


export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("keycloak", { redirectTo: "/dashboard" })
            }}
        >
            <button type="submit">
                <IconUserCircle />
                Sign In
            </button>
        </form>
    )
}


export async function SignOut() {

    return (

        <form action={async () => {
            'use server'
            await signOut({ redirectTo: "/" });
        }}>
            <button type="submit">

                <span aria-label="Sign Out">Sign Out</span>
            </button>
        </form>

    )
}

