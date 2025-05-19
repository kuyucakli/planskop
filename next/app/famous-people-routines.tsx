import Card, { CardHeader, CardBody, CardFooter, CardImage, CardFamousPersonSummary } from "@/components/Card";
import HourlyRoutinesChart from "@/components/HourlyRoutinesChart";
import { getFamousPeopleWithRoutines } from "@/db/queries";
import { FamousPersonRoutine, FamousPersonWithRoutines } from "@/db/schema";


const colors = [
    "rgb(0 255 153 / 36%)",
    "rgb(48 200 180 / 36%)",
    "rgb(255 215 73 / 64%)",
    "rgb(100 120 203 / 36%)",
    "rgb(100 192 203 / 36%)",
    "rgb(150 192 203 / 36%)",
    "rgb(100 140 203 / 36%)",
    "rgb(100 192 160 / 36%)",
    "rgb(90 140 203 / 36%)",
    "rgb(100 192 120 / 36%)",
];

const FamousPeopleRoutines = async () => {
    const famousPeopleWithRoutines = await getFamousPeopleWithRoutines();
    const grouped = Object.values(
        famousPeopleWithRoutines.reduce(
            (acc, row) => {
                if (!acc[row.personId]) {
                    acc[row.personId] = {
                        id: row.personId,
                        personName: row.personName,
                        image: row.image,
                        routines: [],
                    };
                }
                if (row.activityId) {
                    acc[row.personId].routines.push({
                        activityId: row.activityId,
                        activityName: row.activityName,
                        startsAt: row.startsAt,
                        endsAt: row.endsAt,
                        famousPersonId: null,
                    });
                }
                return acc;
            },
            {} as Record<number, FamousPersonWithRoutines>
        )
    );

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
        <ul>
            {grouped.map((f) => (
                <li key={f.id}>
                    <CardFamousPersonSummary famousPerson={f} />
                </li>
            ))}
        </ul>
    );
};

export { FamousPeopleRoutines };
