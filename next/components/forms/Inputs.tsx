import { PropsWithChildren } from "react"
import { FieldError } from "./FormFieldError"
import { FormState } from "@/lib/utils"

type InputProps = { name: string, id?: string, placeholder?: string, className?: string, defaultValue: string | undefined, formState: FormState }

const InputText = ({ name, id, defaultValue, placeholder, className, formState }: InputProps) => {
    return (
        <label>
            <span>{name}</span>
            <input type="text" name={name} id={id || name} className={className} placeholder={placeholder || name} defaultValue={defaultValue} />
            <FieldError formState={formState} name={name} />
        </label>
    )
}



const InputTextArea = ({ children }: PropsWithChildren) => {
    return (
        <textarea>{children}</textarea>
    )
}

const inputDateTimeLocal = ({ name, id, placeholder, className }: InputProps) => {
    return (
        <input type="datetime-local" name={name} id={id} className={className} placeholder={placeholder} />
    )
}
const inputNumber = ({ name, id, placeholder, className }: InputProps) => {
    return (
        <input type="number" name={name} id={id} className={className} placeholder={placeholder} />
    )
}


export { InputText, InputTextArea, inputDateTimeLocal, inputNumber }