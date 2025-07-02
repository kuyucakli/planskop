import { PropsWithChildren } from "react"
import { FieldError } from "./FormFieldError"
import { FormState } from "@/lib/utils"

type InputProps = { autoComplete?: string, label?: string, formState: FormState }

const InputText = ({ name, id, label, placeholder, defaultValue, autoComplete, className, formState, list, required }: React.InputHTMLAttributes<HTMLInputElement> & InputProps) => {

    return (
        <label className="basis-full">
            <span>{label || name}</span>
            <input type="text" name={name} id={id || name} placeholder={placeholder} defaultValue={defaultValue} autoComplete={autoComplete} list={list || ""} required={!!required} className={`py-2 px-2  mt-0 h-10  bg-transparent border appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 border-gray-400 rounded-2xl  ${className}`} />
            { }
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