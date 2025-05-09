'use client'
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';


export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    return (
        <form action={dispatch}>

            <h2 >
                Please log in to continue.
            </h2>

            <label

                htmlFor="email"
            >
                <AtSymbolIcon width="18" height="18" />  Email
            </label>

            <input

                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
            />



            <label

                htmlFor="password"
            >
                <KeyIcon width="18" height="18" />  Password
            </label>

            <input

                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
            />



            <LoginButton />
            <div >
                {errorMessage && (
                    <>
                        <ExclamationCircleIcon width="16" height="16" />
                        <p >{errorMessage}</p>
                    </>
                )}
            </div>

        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} >
            Log in <ArrowRightIcon width="18" height="18" />
        </button >
    );
}


