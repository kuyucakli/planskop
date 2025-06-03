'use client'

import { UseThemeContext } from "@/context/ThemeContext";
import { FamousPersonRoutine } from "@/db/schema";

const HourlyRoutinesChart = ({ routines }: { routines: FamousPersonRoutine[] | [] }) => {

    const { colors } = UseThemeContext();
    function getFilledHoursFromRoutines(routines: FamousPersonRoutine[]) {
        const jsx = [];
        const dayHours = Array.from({ length: 24 }, (_, i) => i);

        const fillHoursInbetween = (startsAt: string, endsAt: string) => {
            const sH = parseInt(startsAt.split(":")[0], 10);
            const eH = parseInt(endsAt.split(":")[0], 10);
            const rVal = [];
            for (let i = sH; i <= eH; i++) {
                rVal.push(i);
            }
            return rVal;
        };

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
                        className="colored-segment"
                        style={{ backgroundColor: colors[lastColorIndex - 1] }}
                    />
                    {hour}
                </li>
            );
        }
        return jsx;
    }
    return (
        <div className="text-fuchsia-300  p-4 text-xs ">
            <ul className="flex  flex-wrap ">
                {getFilledHoursFromRoutines(routines)}
            </ul>
        </div>
    )
}




export default HourlyRoutinesChart;