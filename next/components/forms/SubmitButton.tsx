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
        <button disabled={disabled || pending} type="submit" className={`bg-bermuda hover:bg-bermuda-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-gray-400 hover:border-transparent rounded ${className}`}>
            {pending ? loadingLabel : label}
        </button>
    );
};

export { SubmitButton };