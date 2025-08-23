"use client";
import { PropsWithChildren, use } from "react";
import styles from "./Buttons.module.css";
import { FormState } from "@/lib/utils";
import { FieldError } from "./forms/FormFieldError";
import { CldUploadWidget } from "next-cloudinary";
import {
  IconArrowBack,
  IconArrowForward,
  IconArrowHistoryBack,
  IconDelete,
  IconUpload,
} from "./Icons";
import { useRouter } from "next/navigation";

export function BasicButton({
  children,
  action,
  className,
}: PropsWithChildren & {
  className?: string;
  action?: (...args: any[]) => void;
}) {
  return (
    <button
      type="button"
      className={`${className} rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600 h-12 cursor-pointer`}
      onClick={(e) => action && action()}
    >
      {children}
    </button>
  );
}

export function ButtonFormDelete({
  action,
  className,
}: React.HTMLAttributes<HTMLButtonElement> & {
  action?: (...args: any[]) => void;
}) {
  return (
    <button
      type="submit"
      className={`${className} text-red-300 text-xs items-center bg-none border-none p-0 cursor-pointer flex gap-1 ml-auto`}
      onClick={(e) => action && action()}
    >
      <IconDelete className="fill-red-300" width="16" /> Delete
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
  slotTitle,
  handleCldSuccess,
  disabled = false,
}: {
  id: string;
  slotStartDtMs: number;
  slotTitle: string;
  handleCldSuccess: (
    actionId: string,
    slotStartDtMs: number,
    slotTitle: string,
    result: any
  ) => void;
  disabled: boolean;
}) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      onSuccess={(result: any) => {
        handleCldSuccess(id, slotStartDtMs, slotTitle, result);
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
      <IconArrowHistoryBack className="fill-white" width="20" />
    </button>
  );
}
