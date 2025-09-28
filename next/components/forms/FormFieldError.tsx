import { FormState, resolveTreeError } from "@/lib/utils";
import { resolvePath } from "@/lib/utils";
import z from "zod";

type FieldErrorProps = {
  formState: FormState;
  name: string;
};

const FieldError = ({ formState, name }: FieldErrorProps) => {
  //name: [slots[7c5ec1d9-f018-4d71-8a57-24662421762e].title]

  const message = resolveTreeError(formState.fieldErrors, name);
  return (
    <span className="form-field-error text-xs text-red-400 block my-2 h-4 overflow-y-auto">
      {message}
      {/* {formState.fieldErrors[name]?._errors[0]} */}
    </span>
  );
};

export { FieldError };
