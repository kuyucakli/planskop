"use client";

import { useRouter } from "next/navigation";
import styles from "./Modal.module.css";
import { IconClose } from "./Icons";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <dialog className={styles.Dialog} open>
      <button
        onClick={() => {
          router.back();
        }}
      >
        <IconClose className="fill-white" />
      </button>

      <div>{children}</div>
    </dialog>
  );
}
