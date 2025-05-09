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
        <div style={{
            positionAnchor: "--anchor_1",
            top: "anchor(--anchor_1 top)",
            left: "anchor(--anchor_1 left)",
            margin: 0,
        }} className={styles.Popover} popover="auto" id={id}>
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
    return <button style={{
        anchorName: "--anchor_1",
    }} popoverTarget={popoverTarget}>{children}</button>
}