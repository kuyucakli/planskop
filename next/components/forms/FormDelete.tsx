import { deleteActionPlan } from "@/lib/actions";
import { IconDelete } from "../Icons";

export const FormDelete = ({ id }: { id: number }) => {


    return (
        <form action={deleteActionPlan} id="frmDelete">
            <input type="hidden" name="id" defaultValue={id} />
            <button
                type="submit"
                className="text-red-500 underline bg-none border-none p-0 cursor-pointer"
            >
                <IconDelete/> Delete
            </button>
        </form>
    )
}