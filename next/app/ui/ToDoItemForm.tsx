import { getToDoAlbums } from "@/db/queries";
import { SelectToDo, SelectToDoAlbum } from "@/db/schema";
import { PropsWithChildren } from "react";
import { updateToDo as dbUpdateToDo, createToDo } from "@/db/queries";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

export async function ToDoItemForm({ id, title, content, completed, toDoAlbumId }: PropsWithChildren<Partial<SelectToDo>>) {

    const albums = await getToDoAlbums();


    async function updateToDo(formData: FormData) {
        'use server'

        const dataObj = {} as SelectToDo;


        formData.forEach((val, key) => {

            (dataObj as any)[key] = val;

        })

        //formData ignores uncheck checkbox value 
        dataObj["completed"] = !!formData.get("completed") as boolean;
        await dbUpdateToDo(dataObj);
        revalidatePath('/todos/[category]', 'page');

    }

    async function addToDo(formData: FormData) {
        'use server'

        const dataObj = {} as SelectToDo;

        formData.forEach((val, key) => {

            (dataObj as any)[key] = val;

        })
        //formData ignores uncheck checkbox value 
        dataObj["completed"] = !!formData.get("completed") as boolean;

        try {
            await createToDo(dataObj);

        } catch (err) {

            console.log(dataObj, err)
        }
        redirect('/todos');

    }




    return (
        <form action={id ? updateToDo : addToDo} >
            {
                id && <input type="hidden" name="id" value={id} />
            }

            <label htmlFor="toDoAlbumId">
                Albums:
                <select defaultValue={toDoAlbumId} name="toDoAlbumId" id="toDoAlbumId">
                    {albums.map((a) =>
                        <option key={a.id} value={a.id}>
                            {a.title}
                        </option>
                    )}
                </select>
            </label>
            <label htmlFor="completed"> completed:
                <input name="completed" type="checkbox" defaultChecked={completed} />
            </label>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" defaultValue={title} />

            <label htmlFor="content">Content</label>
            <textarea name="content" id="content" defaultValue={content}></textarea>

            <button type="submit">Save</button>
        </form>
    )
}