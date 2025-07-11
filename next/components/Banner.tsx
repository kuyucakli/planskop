import { PropsWithChildren } from "react";

export default function Banner({ children }: PropsWithChildren) {
    return (
        <section className="bg-zinc-500">
            {children}
        </section>
    )
}