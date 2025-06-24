import { PropsWithChildren } from "react"
import { FieldError } from "./FormFieldError"
import { FormState } from "@/lib/utils"

type InputProps = { autoComplete?: string, label?: string, formState: FormState }

const InputText = ({ name, id, label, placeholder, defaultValue, autoComplete, className, formState, list, required }: React.InputHTMLAttributes<HTMLInputElement> & InputProps) => {

    return (
        <label className={className}>
            <span>{label || name}</span>
            <input type="text" name={name} id={id || name} placeholder={placeholder || name} defaultValue={defaultValue} autoComplete={autoComplete} list={list || ""} required={!!required} />
            <FieldError formState={formState} name={name || ""} />
        </label>
    )
}



const InputTextArea = ({ children }: PropsWithChildren) => {
    return (
        <textarea>{children}</textarea>
    )
}

const inputDateTimeLocal = ({ name, id, placeholder, className }: HTMLInputElement) => {
    return (
        <input type="datetime-local" name={name} id={id} className={className} placeholder={placeholder} />
    )
}
const inputNumber = ({ name, id, placeholder, className }: HTMLInputElement) => {
    return (
        <input type="number" name={name} id={id} className={className} placeholder={placeholder} />
    )
}


export { InputText, InputTextArea, inputDateTimeLocal, inputNumber }