"use client"
import { PropsWithChildren, use } from "react";
import styles from "./Buttons.module.css";


export function BasicButton({ children, action }: PropsWithChildren & { action: (...args: any[]) => void }) {
    return (
        <button type="button" onClick={e => action()}>
            {children}
        </button>
    )
}


export function DeleteButton({ id, action }: PropsWithChildren & { id: number, action: (...args: any[]) => void }) {
    return (
        <button type="button" onClick={e => action(id)}>
            Sil
        </button>
    )
}



export function ToggleThemeButton() {

    return (


        <label aria-label="change-theme">
            <input id="toggle-theme" type="checkbox" className={styles.ToggleThemeBtn} />
        </label>



    )
}