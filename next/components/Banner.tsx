import { PropsWithChildren } from "react";

export default function Banner({ children }: PropsWithChildren) {
    return (
        <section className="bg-emerald-500 relative">
            {children}
        </section>
    )
}