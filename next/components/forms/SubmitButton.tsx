"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    label: string;
    loadingLabel: React.ReactNode;
    disabled?: boolean
};

const SubmitButton = ({ label, loadingLabel, disabled, className }: React.ButtonHTMLAttributes<HTMLButtonElement> & SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={disabled || pending} type="submit" className={` hover:bg-bermuda-500  hover:text-white  border bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ${className}`}>
            {pending ? loadingLabel : label}
        </button>
    );
};

export { SubmitButton };