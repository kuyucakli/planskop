"use client";

import { useRouter } from "next/navigation";
import styles from "./Modal.module.css";
import { IconClose } from "@/components/Icons";
import { ButtonBack } from "../Buttons";
import { useEffect } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleclickOutsideToClose = (e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "MAIN") {
      router.back();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleclickOutsideToClose);
    return () => {
      window.removeEventListener("click", handleclickOutsideToClose);
    };
  }, []);

  return (
    <dialog className={styles.Dialog} open>
      <ButtonBack className={styles.BackButton} />
      <button
        className={styles.CloseButton}
        onClick={() => {
          router.back();
        }}
      >
        <IconClose className="fill-white" />
      </button>

      <div className={`${styles.DialogContent} w-full max-w-3xl`}>
        {children}
      </div>
    </dialog>
  );
}
