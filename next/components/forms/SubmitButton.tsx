"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    label: string;
    loadingLabel: React.ReactNode;
};

const SubmitButton = ({ label, loadingLabel }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" >
            {pending ? loadingLabel : label}
        </button>
    );
};

export { SubmitButton };