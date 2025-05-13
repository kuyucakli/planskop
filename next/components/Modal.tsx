'use client'

import { useRouter } from 'next/navigation'
import styles from './Modal.module.css'

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <dialog className={styles.Dialog} open>
            <button
                onClick={() => {
                    router.back()
                }}
            >
                Close modal
            </button>
            <div>{children}</div>
        </dialog>
    )
}