"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    label: string;
    loadingLabel: React.ReactNode;
};

const SubmitButton = ({ label, loadingLabel }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-bermuda hover:bg-bermuda-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-gray-400 hover:border-transparent rounded">
            {pending ? loadingLabel : label}
        </button>
    );
};

export { SubmitButton };