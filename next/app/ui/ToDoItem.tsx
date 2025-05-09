'use client'

import styles from './ToDo.module.css';
import { SelectToDo } from "@/db/schema";
import { PropsWithChildren, ReactElement, useCallback, useState } from "react";


import { useSearchParams, useRouter } from 'next/navigation';
import { deleteToDo } from '@/db/queries';
import { IconCancel, IconDelete, IconEdit } from './Icons';


export function ToDoItem(
    props:
        PropsWithChildren<Partial<SelectToDo>>
        &
        { toDoEditForm: ReactElement }
) {

    const searchParams = useSearchParams();

    const activeToDoId = searchParams.get("activeToDoId");

    const { id, title, content, completed } = props;

    const [isEditing, setEditing] = useState(activeToDoId == id + '' ? true : false);


    const router = useRouter();
    //const pathname = usePathname();


    const createQueryString = useCallback(
        (currentToDoId: number) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("activeToDoId", currentToDoId + "");

            router.push(`?${params.toString()}`);
        },
        [searchParams]
    )

    const editTemplate = (
        <tr className={styles.ToDoItem} >
            <td>
                <figure>
                    <figcaption>{title && title[0]}</figcaption>
                </figure>
            </td>
            <td className={styles.ToDoItemContent}>


                {props.toDoEditForm}

            </td>
            <td>
                <button onClick={() => { router.push(`?avtiveToDoId=0`); (false); }}><IconCancel /></button>
            </td>
        </tr>
    )

    const viewTemplate = (
        <tr className={styles.ToDoItem} >
            <td>
                <figure>

                    <figcaption>{title && title[0]}</figcaption>
                </figure>
            </td>
            <td className={styles.ToDoItemContent}>
                <h2>{title}</h2><p>{content}</p>
                <label> completed: <input type="checkbox" defaultChecked={completed} readOnly disabled /> </label>
            </td>
            <td>

                <button onClick={() => {
                    setEditing(true);
                    if (id) createQueryString(id);
                }}>
                    <IconEdit />
                </button>

                <button onClick={() => deleteToDo(Number(id))}>
                    <IconDelete />
                </button>
            </td>
        </tr>
    )

    return (
        <>
            {isEditing && activeToDoId === id + '' ? editTemplate : viewTemplate}
        </>
    )
}




