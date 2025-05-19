"use client"

import { createContext, PropsWithChildren, use, useContext, useState } from "react";

const colors = [
    "rgb(0 255 153 / 36%)",
    "rgb(48 200 180 / 36%)",
    "rgb(255 215 73 / 64%)",
    "rgb(100 120 203 / 36%)",
    "rgb(100 192 203 / 36%)",
    "rgb(150 192 203 / 36%)",
    "rgb(100 140 203 / 36%)",
    "rgb(100 192 160 / 36%)",
    "rgb(90 140 203 / 36%)",
    "rgb(100 192 120 / 36%)",
];

const ThemeContext = createContext({ theme: "dark", toggleTheme: null, colors });

function ThemeContextProvider({ children }: PropsWithChildren) {
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

const UseThemeContext = () => {
    return useContext(ThemeContext);
}


export { ThemeContext, ThemeContextProvider, UseThemeContext };

