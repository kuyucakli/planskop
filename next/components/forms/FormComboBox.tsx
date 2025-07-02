import { FormState } from "@/lib/utils";
import { InputText } from "./Inputs"

type Props = { label?: string, options: readonly string[], formState: FormState }

const FormComboBox = ({ name, id, label, defaultValue, options, formState, required, placeholder, className, onChange }: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
    return (
        <>
            <InputText name={name} label={label} list={name + "_list"} defaultValue={defaultValue} formState={formState} required={required} placeholder={placeholder} className={className} />

            <datalist id={name + "_list"}>
                {options.map(o => <option key={o} value={o} />)}
            </datalist>
        </>
    )
}

export default FormComboBox;