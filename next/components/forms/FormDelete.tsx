"use client";

import { deleteDailyPlan } from "@/lib/actions";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { BasicButton, ButtonFormDelete } from "../Buttons";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const FormDelete = ({ id }: { id: number }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={deleteDailyPlan}
      id="frmDelete"
      onSubmit={(e) => {
        if (!showConfirmation) {
          e.preventDefault();
          setShowConfirmation(true);
        }
      }}
    >
      <input type="hidden" name="id" defaultValue={id} />
      <ButtonFormDelete />

      <ConfirmationDialog
        hasOwnCloseButton={true}
        message={`You are about to delete your daily plan with id ${id}`}
        open={showConfirmation}
      >
        <BasicButton
          className="bg-red-600 hover:bg-red-500"
          action={() => {
            formRef.current?.requestSubmit();
          }}
        >
          Delete Anyway
        </BasicButton>
      </ConfirmationDialog>
    </form>
  );
};
