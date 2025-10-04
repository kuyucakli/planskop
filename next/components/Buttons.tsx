"use client";
import {
  HTMLProps,
  PropsWithChildren,
  ReactElement,
  use,
  useState,
} from "react";
import styles from "./Buttons.module.css";
import { FormState } from "@/lib/utils";
import { FieldError } from "./forms/FormFieldError";
import { CldUploadWidget } from "next-cloudinary";
import {
  IconAddPhotoAlternate,
  IconArrowBack,
  IconArrowForward,
  IconArrowHistoryBack,
  IconAttachFile,
  IconCheckCircle,
  IconCircle,
  IconDelete,
  IconUpload,
} from "./Icons";
import { useRouter } from "next/navigation";

function BasicButton({
  children,
  action,
  className,
  disabled,
}: HTMLProps<HTMLButtonElement> & {
  className?: string;
  action?: (...args: any[]) => void;
}) {
  return (
    <button
      disabled={disabled}
      type="button"
      className={`${className} rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600 h-12 cursor-pointer`}
      onClick={(e) => action && action()}
    >
      {children}
    </button>
  );
}

function ButtonFormDelete({
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

function ToggleThemeButton() {
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

function ToggleButton({
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

function ButtonCldUpload({
  onCldSuccess,
  disabled = false,
}: {
  onCldSuccess: (result: any) => void;
  disabled: boolean;
}) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      onSuccess={(result: any) => {
        onCldSuccess(result);
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            disabled={disabled}
            onClick={() => open()}
            className={`flex justify-center items-center w-12 h-12`}
            aria-label="Upload image"
          >
            <IconAddPhotoAlternate
              className={`${!disabled ? "fill-gray-100" : "fill-gray-400"}`}
            />
          </button>
        );
      }}
    </CldUploadWidget>
  );
}

function ButtonDirectional({
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
      type="button"
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

function ButtonBack({ className }: HTMLProps<HTMLButtonElement>) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`${className} inline-flex cursor-pointer`}
      type="button"
    >
      <IconArrowHistoryBack className="fill-white" width="20" />
    </button>
  );
}

function ButtonCheckable({
  checked,
  disabled,
  onCheck,
}: React.HTMLProps<HTMLInputElement> & {
  onCheck: (checked: boolean) => void;
}) {
  const className = "fill-gray-200";

  return (
    <button
      type="button"
      onClick={() => onCheck(!checked)}
      className="cursor-pointer inline-flex items-center justify-center w-12 h-12"
      disabled={disabled}
    >
      {checked && <IconCheckCircle className={className} />}
      {!checked && <IconCircle className={className} />}
    </button>
  );
}

export {
  BasicButton,
  ButtonFormDelete,
  ButtonCldUpload,
  ButtonCheckable,
  ButtonBack,
  ButtonDirectional,
  ToggleThemeButton,
  ToggleButton,
};
