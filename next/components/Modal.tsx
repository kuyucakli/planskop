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

      <div className="w-full max-w-3xl">{children}</div>
    </dialog>
  );
}
