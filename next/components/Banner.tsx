import { PropsWithChildren } from "react";

export default function Banner({ children }: PropsWithChildren) {
    return (
        <section>
            {children}
        </section>
    )
}