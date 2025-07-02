'use client'

import { UseThemeContext } from "@/context/ThemeContext";
import { FamousPersonRoutine } from "@/db/schema";
import styles from "./Charts.module.css";

export const fillHoursInbetween = (startsAt: string, endsAt: string) => {
    let sH = parseInt(startsAt.split(":")[0], 10);
    let eH = parseInt(endsAt.split(":")[0], 10);

    const rVal = [];

    if (eH < sH) eH += 24;

    for (let i = sH; i <= eH; i++) {
        rVal.push(i >= 24 ? i % 24 : i);
    }
    return rVal;
};


const ChartFamousDailyRoutines = ({ routines, compact = false }: { routines: FamousPersonRoutine[], compact?: boolean }) => {

    const { colors } = UseThemeContext();

    const colorsLegendForRoutines = routines.reduce((acc, curr, index) => {
        if (!acc[curr.activityId]) {
            acc[curr.activityId] = colors[index];
        }

        return acc;

    }, {} as Record<number, string>)

    function getFilledHoursFromRoutines(routines: FamousPersonRoutine[]) {
        const jsx = [];
        const dayHours = Array.from({ length: 24 }, (_, i) => i);

        let lastColorIndex = 0;
        let lastRoutine;

        for (const hour of dayHours) {
            const activeRoutine = routines.find((r) =>
                fillHoursInbetween(r.startsAt, r.endsAt).includes(hour)
            );

            if (lastRoutine != activeRoutine?.activityName) {
                lastColorIndex++;
                lastRoutine = activeRoutine?.activityName;
            }

            jsx.push(
                <li
                    className="size-7  flex justify-center items-center"
                    data-active={activeRoutine ? activeRoutine.activityName : undefined}
                    key={hour}
                >
                    <span
                        className={activeRoutine && `${styles.ColoredSegment}`}
                        style={{ backgroundColor: activeRoutine ? colorsLegendForRoutines[activeRoutine.activityId] : "" }}
                    />
                    {`${hour}`.padStart(2, '0')}
                </li>
            );
        }
        return jsx;
    }
    return (
        <div className={`p-4  text-fuchsia-300   text-xs ${styles.ChartContainer} ${compact ? styles.Compact : ""}`}>
            <ul className="flex  flex-wrap shadow-sm shadow-black/50">
                {getFilledHoursFromRoutines(routines)}
            </ul>
        </div>
    )
}

export { ChartFamousDailyRoutines };