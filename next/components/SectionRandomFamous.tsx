import { getRandomFamousPersonWithRoutines } from "@/db/queries"
import CldImage from "./CldImage";


export const SectionRandomFamous = async () => {
    const res = await getRandomFamousPersonWithRoutines();

    if (!res) return;

    const { image, personName, personContent } = res[0];

    return (
        <section className="mt-6">
            <h1 className="text-2xl">Famous Routines</h1>
            {personName}
            <CldImage
                src={image}
                alt={"altText"}
                width="100"
                height="100"
                crop="fill"
                removeBackground
                background="aqua"
                gravity="face"
            />
            <p>
                {personContent}
            </p>
        </section>
    )

}