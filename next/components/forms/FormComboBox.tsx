import { FormState } from "@/lib/utils";
import { InputText } from "./Inputs"

type Props = { options: string[], formState: FormState }

const FormComboBox = ({ name, id, defaultValue, options, formState, required, placeholder }: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
    return (
        <>
            <InputText name={name} list={name + "_list"} defaultValue={defaultValue} formState={formState} required={required} placeholder={placeholder} className="basis-128" />

            <datalist id={name + "_list"}>
                {options.map(o => <option key={o} value={o} />)}
            </datalist>
        </>
    )
}

export default FormComboBox;