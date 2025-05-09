"use client"

import { createContext, PropsWithChildren, use, useState } from "react";


export const ThemeContext = createContext({ theme: "dark", toggleTheme: null });

export function ThemeContextProvider({ children }: PropsWithChildren) {
    const [themeObj, setTheme] = useState(use(ThemeContext));

    const toggleTheme = () => {
        if (themeObj.theme == "dark") {
            setTheme({ ...themeObj, theme: "light" });
        }
        if (themeObj.theme == "light") {
            setTheme({ ...themeObj, theme: "dark" });
        }


    };

    return (
        <ThemeContext value={themeObj}>
            {children}
        </ThemeContext>
    )
}




