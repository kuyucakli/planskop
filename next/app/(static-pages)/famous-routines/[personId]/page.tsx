import { getFamousPeopleWithRoutines, getFamousPersonWithRoutines } from "@/db/queries"
import CldImage from "@/components/CldImage";

export async function generateStaticParams() {
    const famousPeople = await getFamousPeopleWithRoutines();

    return famousPeople.map(p => ({ personId: p.personId.toString() }));

}

export default async function Page({
    params,
}: {
    params: Promise<{ personId: string }>
}) {

    const { personId } = await params;

    const person = await getFamousPersonWithRoutines(Number(personId));
    const { image, personName, personContent } = person[0];

    return (
        <div>

            <h1 className="text-6xl">{personName}</h1>
            <CldImage
                src={image}
                alt={"altText"}
                width="300"
                height="300"
                crop="fill"
                removeBackground
                background="aqua"
                gravity="face"
            />
            <p>
                {personContent}
            </p>
        </div>
    )
}