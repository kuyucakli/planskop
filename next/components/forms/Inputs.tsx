import { PropsWithChildren } from "react"

type InputProps = { name: string, id: string, value: string, placeholder: string, className: string }

const InputText = ({ name, id, value, placeholder, className }: InputProps) => {
    return (
        <input type="text" name={name} id={id} className={className} placeholder={placeholder} value={value} />
    )
}



const InputTextArea = ({ children }: PropsWithChildren) => {
    return (
        <textarea>{children}</textarea>
    )
}

const inputDateTimeLocal = ({ name, id, value, placeholder, className }: InputProps) => {
    return (
        <input type="datetime-local" name={name} id={id} className={className} placeholder={placeholder} value={value} />
    )
}
const inputNumber = ({ name, id, value, placeholder, className }: InputProps) => {
    return (
        <input type="number" name={name} id={id} className={className} placeholder={placeholder} value={value} />
    )
}


export { InputText, InputTextArea, inputDateTimeLocal, inputNumber }