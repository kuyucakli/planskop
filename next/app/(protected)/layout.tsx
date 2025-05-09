import { Metadata } from "next";
import { Logo, LogoPictogramApp } from "../ui/Logo";
import { NavMain } from "../ui/Navs";
import NavUser from "../ui/NavUser";



export const metadata: Metadata = {
    title: {
        template: '%s',
        default: 'Ben planskop',
    },
    description: "Welcome to Planskop – Your Personal Guide to Building Better Habits",

};

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>

            <header className="protected">

                <LogoPictogramApp />

                <NavMain />

                <NavUser />

            </header>

            <main>
                {children}
            </main>




        </>
    )
}