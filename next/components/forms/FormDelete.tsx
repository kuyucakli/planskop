"use client";

import { deleteActionPlan } from "@/lib/actions";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { BasicButton, ButtonFormDelete } from "../Buttons";
import { useRef, useState } from "react";

export const FormDelete = ({ id }: { id: number }) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const toggleConfirmation = () => {
    setIsConfirmation(!isConfirmation);
  };

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={deleteActionPlan}
      id="frmDelete"
      onSubmit={(e) => {
        e.preventDefault();
        setIsConfirmation(true);
      }}
    >
      <input type="hidden" name="id" defaultValue={id} />
      <ButtonFormDelete action={toggleConfirmation} />

      <ConfirmationDialog
        hasOwnCloseButton={true}
        message={`You are about to delete your daily plan with id ${id}`}
        open={isConfirmation}
      >
        <BasicButton
          className="bg-red-600 hover:bg-red-500"
          action={() => {
            formRef.current?.submit();
          }}
        >
          Delete Anyway
        </BasicButton>
      </ConfirmationDialog>
    </form>
  );
};
