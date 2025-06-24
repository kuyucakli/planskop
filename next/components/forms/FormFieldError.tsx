import { FormState } from '@/lib/utils';
import { resolvePath } from '@/lib/utils';

type FieldErrorProps = {
    formState: FormState;
    name: string;
};

const FieldError = ({ formState, name }: FieldErrorProps) => {
    console.log(formState, name)
    return (
        <span className="text-xs text-red-400">
            {resolvePath(formState.fieldErrors, name)?._errors[0]}
            {/* {formState.fieldErrors[name]?._errors[0]} */}
        </span>
    );
};

export { FieldError };