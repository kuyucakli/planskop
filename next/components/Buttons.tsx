"use client"
import { PropsWithChildren, use } from "react";
import styles from "./Buttons.module.css";
import { FormState } from "@/lib/utils";
import { FieldError } from "./forms/FormFieldError";


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


type toggleButtonProps = { ariaLabel?: string, label?: string, formState: FormState }

export function ToggleButton({ ariaLabel, label, id, name, formState, defaultChecked }: React.InputHTMLAttributes<HTMLInputElement> & toggleButtonProps) {

    return (
        <label aria-label={ariaLabel} className="flex items-center">
            {label && <span className="mr-3">{label}</span>}
            <input id={id || name} name={name || id} type="checkbox" className={styles.ToggleButton} defaultChecked={!!defaultChecked} />

            <FieldError name={name || id || ""} formState={formState} />
        </label>
    )
}