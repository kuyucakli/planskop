"use client";
import { PropsWithChildren, use } from "react";
import styles from "./Buttons.module.css";
import { FormState } from "@/lib/utils";
import { FieldError } from "./forms/FormFieldError";
import { CldUploadWidget } from "next-cloudinary";
import { IconArrowBack, IconArrowForward, IconUpload } from "./Icons";
import { useRouter } from "next/navigation";

export function BasicButton({
  children,
  action,
}: PropsWithChildren & { action: (...args: any[]) => void }) {
  return (
    <button type="button" onClick={(e) => action()}>
      {children}
    </button>
  );
}

export function DeleteButton({
  id,
  action,
}: PropsWithChildren & { id: number; action: (...args: any[]) => void }) {
  return (
    <button type="button" onClick={(e) => action(id)}>
      Sil
    </button>
  );
}

export function ToggleThemeButton() {
  return (
    <label aria-label="change-theme">
      <input
        id="toggle-theme"
        type="checkbox"
        className={styles.ToggleThemeBtn}
      />
    </label>
  );
}

type toggleButtonProps = {
  ariaLabel?: string;
  label?: string;
  formState: FormState;
};

export function ToggleButton({
  ariaLabel,
  label,
  id,
  name,
  formState,
  defaultChecked,
}: React.InputHTMLAttributes<HTMLInputElement> & toggleButtonProps) {
  return (
    <label aria-label={ariaLabel} className="flex items-center">
      {label && <span className="mr-3">{label}</span>}
      <input
        id={id || name}
        name={name || id}
        type="checkbox"
        className={styles.ToggleButton}
        defaultChecked={!!defaultChecked}
      />

      <FieldError name={name || id || ""} formState={formState} />
    </label>
  );
}

export function ButtonCldUpload({
  id,
  slotStartDtMs,
  handleCldSuccess,
  disabled = false,
}: {
  id: string;
  slotStartDtMs: number;
  handleCldSuccess: (
    actionId: string,
    slotStartDtMs: number,
    result: any
  ) => void;
  disabled: boolean;
}) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      onSuccess={(result: any) => {
        handleCldSuccess(id, slotStartDtMs, result);
      }}
    >
      {({ open }) => {
        return (
          <button
            disabled={disabled}
            onClick={() => open()}
            className={`border-1 ${
              !disabled ? "border-green-300" : "border-gray-400"
            } flex justify-center items-center w-12 h-12`}
            aria-label="Upload image"
          >
            <IconUpload
              className={`${!disabled ? "fill-green-400" : "fill-gray-400"}`}
            />
          </button>
        );
      }}
    </CldUploadWidget>
  );
}

export function ButtonDirectional({
  direction,
  disabled,
  children,
  onDirectionalClick,
}: PropsWithChildren & {
  direction: "prev" | "next";
  disabled?: boolean;
  onDirectionalClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      aria-label="previous-day"
      className={`border-2  border-gray-300 w-6 h-6 inline-flex items-center justify-center cursor-pointer ${
        direction == "prev"
          ? "rounded-tl-sm rounded-bl-sm"
          : "rounded-tr-sm rounded-br-sm"
      }`}
      onClick={() => {
        if (disabled) return;
        onDirectionalClick();
      }}
    >
      {direction === "prev" ? (
        <IconArrowBack className={`fill-gray-300`} width="16" />
      ) : (
        <IconArrowForward className={`fill-gray-300 `} width="16" />
      )}
      {children}
    </button>
  );
}

export function ButtonBack() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex cursor-pointer"
    >
      <IconArrowBack className="fill-white" width="16" />
    </button>
  );
}
