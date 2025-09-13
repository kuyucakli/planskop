"use client";
import { FocusEvent, PropsWithChildren, useEffect, useRef } from "react";
import { FieldError } from "./FormFieldError";
import { FormState } from "@/lib/utils";
import { IconCancel } from "../Icons";

type InputProps = {
  labelClassName?: string;
  autoComplete?: string;
  label?: string;
  formState: FormState;
};

const InputText = ({
  name,
  id,
  label,
  placeholder,
  defaultValue,
  autoComplete,
  labelClassName,
  className,
  formState,
  list,
  required,
}: React.InputHTMLAttributes<HTMLInputElement> & InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const clearButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleChange = () => {
    if (inputRef.current) {
      if (inputRef.current.value.length > 0) {
        clearButtonRef.current!.style.display = "block";
      }
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      clearButtonRef.current!.style.display = "none";
    }
  };

  const handleFocus = () => {
    if (clearButtonRef.current && inputRef.current) {
      if (inputRef.current.value.length > 0) {
        clearButtonRef.current.style.display = "block";
      } else {
        clearButtonRef.current!.style.display = "none";
      }
    }
  };
  const handleBlur = (e: FocusEvent) => {
    const relatedTarget = e.relatedTarget;
    console.log(relatedTarget);
    if (clearButtonRef.current && clearButtonRef.current !== relatedTarget) {
      clearButtonRef.current.style.display = "none";
    }
  };

  return (
    <label className={`${labelClassName} relative`}>
      <span>{label || name}</span>
      <input
        type="text"
        name={name}
        id={id || name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        list={list || ""}
        required={!!required}
        className={`py-2 px-2  mt-0 h-10  bg-transparent border appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 border-gray-400 rounded-2xl  ${className}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        onChange={handleChange}
      />
      {}
      <FieldError formState={formState} name={name || ""} />
      <button
        ref={clearButtonRef}
        className="hidden absolute right-6 bottom-2"
        onClick={handleClear}
        type="button"
      >
        <IconCancel className="fill-white w-4" />
      </button>
    </label>
  );
};

const InputTextArea = ({ children }: PropsWithChildren) => {
  return <textarea>{children}</textarea>;
};

const inputDateTimeLocal = ({
  name,
  id,
  placeholder,
  className,
}: HTMLInputElement) => {
  return (
    <input
      type="datetime-local"
      name={name}
      id={id}
      className={className}
      placeholder={placeholder}
    />
  );
};
const inputNumber = ({
  name,
  id,
  placeholder,
  className,
}: HTMLInputElement) => {
  return (
    <input
      type="number"
      name={name}
      id={id}
      className={className}
      placeholder={placeholder}
    />
  );
};

export { InputText, InputTextArea, inputDateTimeLocal, inputNumber };
