import { PropsWithChildren, ReactElement } from "react";
import styles from './Popover.module.css';

type Popover = {
    id: string
} & PropsWithChildren;

type PopoverToggleBtn = {
    popoverTarget: string
} & PropsWithChildren;

type PopoverSet = {
    children: [ReactElement<PopoverToggleBtn>, ReactElement<Popover>],
}


export default function Popover({ id, children }: Popover) {
    return (
        <div className={styles.Popover} popover="auto" id={id}>
            {children}
        </div>
    )
}


export function PopoverSet({ children }: PopoverSet) {
    return (
        <>
            {children}
        </>
    )
}

export function PopoverToggleBtn({ popoverTarget, children }: PopoverToggleBtn) {
    return <button className={styles.PopoverToggleBtn} popoverTarget={popoverTarget}>{children}</button>
}