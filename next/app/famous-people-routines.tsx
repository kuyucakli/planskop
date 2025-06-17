import { CardFamousPersonSummary } from "@/components/Card";
import { FamousPersonWithRoutines } from "@/db/schema";
import { getFamousPeopleWithRoutines } from "@/db/queries";



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
