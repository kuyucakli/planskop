"use client"

import { createContext, PropsWithChildren, use, useContext, useState } from "react";

const colors = [
    "oklch(0.7806 0.2336 157.8 / 36%)", // rgb(0 255 153)
    "oklch(0.7353 0.1413 186.9 / 36%)", // rgb(48 200 180)
    "oklch(0.8819 0.1451 101.4 / 64%)", // rgb(255 215 73)
    "oklch(0.5944 0.1668 265.8 / 36%)", // rgb(100 120 203)
    "oklch(0.7524 0.1037 217.3 / 36%)", // rgb(100 192 203)
    "oklch(0.7901 0.0913 228.5 / 36%)", // rgb(150 192 203)
    "oklch(0.6863 0.1186 266.2 / 36%)", // rgb(100 140 203)
    "oklch(0.7601 0.0782 177.7 / 36%)", // rgb(100 192 160)
    "oklch(0.6479 0.1259 267.2 / 36%)", // rgb(90 140 203)
    "oklch(0.7386 0.0875 155.3 / 36%)", // rgb(100 192 120)
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

