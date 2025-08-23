"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { BasicButton } from "../Buttons";

export default function ConfirmationDialog({
  open = false,
  message,
  children,
  hasOwnCloseButton = true,
}: React.HtmlHTMLAttributes<HTMLDialogElement> & {
  open?: boolean;
  message?: string;
  hasOwnCloseButton?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(open);
  const refDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!mounted) return null;
  return (
    isOpen &&
    createPortal(
      <dialog open ref={refDialog} className={styles.Dialog}>
        <div>
          <p>{message} </p>
          <div className="flex gap-4 mt-4 justify-center">
            {hasOwnCloseButton && (
              <BasicButton action={handleClose}>Close</BasicButton>
            )}
            {children}
          </div>
        </div>
      </dialog>,
      document.body
    )
  );
}
