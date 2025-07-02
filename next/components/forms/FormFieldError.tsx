import { FormState } from '@/lib/utils';
import { resolvePath } from '@/lib/utils';

type FieldErrorProps = {
    formState: FormState;
    name: string;
};

const FieldError = ({ formState, name }: FieldErrorProps) => {

    return (
        <span className="form-field-error text-xs text-red-400 block my-2">
            {resolvePath(formState.fieldErrors, name)?._errors[0]}
            {/* {formState.fieldErrors[name]?._errors[0]} */}
        </span>
    );
};

export { FieldError };