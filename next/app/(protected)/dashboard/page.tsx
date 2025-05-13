import HandWrittenNums from "@/components/HandWrittenNums";
// import { auth } from "@/auth";
import { getActionPlans } from "@/db/queries";
import styles from "./page.module.css";
import * as _wasm from "@/pkg/planskop_rust";
import { auth } from "@clerk/nextjs/server";


export default async function Dashboard() {

    const { userId } = await auth();

    if (!userId) { return "Please sign in to view this page." }

    const actionPlans = await getActionPlans(userId as string);

    if (!actionPlans) return <p>Ops</p>

    const { get_closest_action_dates, get_dt_str_from_rruleset, get_human_readable_rrule, with_timezone_offset } = _wasm;

    const actionPlansJSON = JSON.stringify(actionPlans);

    const closestActions = JSON.parse(get_closest_action_dates(actionPlansJSON));

    const now = new Date();

    return (
        <>
            <section>
                <h1 className="display-lg">Hello, {userId}</h1>
                <ul className={styles.Dashboard}>
                    <li >

                        <h2 className="title-lg">
                            {
                                closestActions.length > 0
                                    ?
                                    <>
                                        Summary

                                        <HandWrittenNums num={closestActions.length} />
                                    </>
                                    : "No upcoming Actions. Create one..."
                            }

                        </h2>
                    </li>
                    <li >
                        <h2 className="title-lg">
                            Daily Routine Templates
                        </h2>
                        <ul>
                            <li>Picasso</li>
                            {/* <PieChart /> */}
                        </ul>
                    </li>

                </ul>
            </section>

            <section>
                <h2 className="title-lg">Upcoming actions</h2>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th> Title</th>
                            <th> Content</th>
                            <th> Upcoming Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* filter(a => a.closest) */}
                        {/* {closestActions.map((a: InsertActionPlan, index: number) => (
                            <Fragment key={a.id}>
                                <tr >
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td >
                                        <Link
                                            href={{
                                                pathname: '/planner',
                                                query: {
                                                    actionPlanId: a.id
                                                }
                                            }}
                                        >
                                            {a.title}
                                        </Link>
                                    </td>
                                    <td >

                                        {get_human_readable_rrule(a.rrule)}

                                    </td>
                                    <td >{a.closest}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <DeleteButton id={a.id} action={deleteActionPlan} />
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    get_dt_str_from_rruleset(a.rrule).split("*").map(
                                                        dT => {
                                                            dT = with_timezone_offset(dT, a.timezone);

                                                            return <tr key={dT}>{dT.split("-").map((part, index) => <td key={index}>{part}</td>)}</tr>
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </Fragment>
                        ))} */}

                    </tbody>
                </table>

            </section>

        </>

    )
}


