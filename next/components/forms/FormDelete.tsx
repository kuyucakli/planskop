import { deleteActionPlan } from "@/lib/actions";
import { IconDelete } from "../Icons";

export const FormDelete = ({ id }: { id: number }) => {


    return (
        <form action={deleteActionPlan} id="frmDelete" className=" ">
            <input type="hidden" name="id" defaultValue={id} />
            <button
                type="submit"
                className="text-red-300 text-xs items-center bg-none border-none p-0 cursor-pointer flex gap-1"
            >
                <IconDelete className="fill-red-300" width="16"/> Delete
            </button>
        </form>
    )
}