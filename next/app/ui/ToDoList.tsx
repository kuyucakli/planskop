import Link from "next/link";
import { ToDoItem } from "./ToDoItem";
import { getToDoAlbums } from "@/db/queries";
import { ToDoItemForm } from "./ToDoItemForm";

import styles from './ToDo.module.css';
import { IconAdd } from "./Icons";







export async function ToDoList({ activeAlbumName }: { activeAlbumName?: string }) {

    const albumsData = await getToDoAlbums();
    const activeAlbumId = activeAlbumName ? albumsData.findIndex((aD) => aD.title == activeAlbumName) : 0;
    const albumNameOptions = albumsData.map((a, index) => <li key={a.id}><Link href={"/todos/" + a.title}> {a.title}</Link></li>);



    return (
        <>
            <header>
                <Link href="/todos/add">
                    <IconAdd />
                </Link>
            </header>

            <table className={styles.ToDoList}>
                <thead>
                    <tr>
                        <th colSpan={3}>
                            Your to do &#39;s titled : &nbsp;
                            <ul>

                                {albumNameOptions}
                            </ul>


                            content
                        </th>

                    </tr>

                </thead>
                <tbody>
                    {albumsData[activeAlbumId]?.toDos.map(t => (<ToDoItem key={t.id} {...t} toDoEditForm={<ToDoItemForm  {...t} />} />))}
                </tbody>

            </table>
        </>
    )
}


