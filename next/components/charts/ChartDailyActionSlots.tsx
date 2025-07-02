'use client'

import { UseThemeContext } from "@/context/ThemeContext";
import { DailyActionSlot } from "@/db/schema";
import styles from "./Charts.module.css";
import { extractTimeRange } from "@/lib/utils";



const ChartDailyActionSlots = ({ actionSlots, compact = false, interval = 15, showContent = false }: { actionSlots?: DailyActionSlot[], compact?: boolean, interval?: number, showContent?: boolean }) => {
    const { colors } = UseThemeContext();
    let reservedMinutes: Set<number> | undefined;
    if (actionSlots) {
        reservedMinutes = actionSlots.reduce((acc, actionSLot) => {
            extractTimeRange(actionSLot.at, actionSLot.for, 15, false, true).forEach((t) => acc.add(t));
            return acc;
        }, new Set<number>());

    }

    const minutesInDay = 24 * 60;
    const dayMinutesByInterval = Array.from(
        { length: minutesInDay / interval },
        (_, index) => index * interval
    );

    const boxWidthInFlexRow = 100 / (minutesInDay / interval * 0.5);


    console.log(reservedMinutes)

    return (
        <div className={`p-4  text-gray-500   text-xs ${styles.ChartContainer} ${compact ? styles.Compact : ""}`}>
            <ul className="flex  flex-wrap shadow-sm shadow-black/50">
                {dayMinutesByInterval.map((m) => (
                    <MinuteBox
                        key={m}
                        className="border-1 flex"
                        content={showContent ? (Math.floor(m / 60) + "").padStart(2, "0") + ":00" : ""}
                        style={{ width: `${boxWidthInFlexRow}%` }}
                        active={reservedMinutes ? reservedMinutes.has(m) : false}
                    />


                ))}
            </ul>
        </div>
    )
}



const MinuteBox = ({ content, className, active = false, style }: React.LiHTMLAttributes<HTMLLIElement> & { active?: boolean }) => {

    return (

        active
            ?
            <li className={`bg-amber-200 border-1 border-amber-200 flex    ${className}`} style={style}> {content}</li >
            :
            <li className={`border-1 border-gray-500 flex    ${className}`} style={style}>  {content}</li>


    )
}



export { ChartDailyActionSlots };