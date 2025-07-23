import { getRandomFamousPersonWithRoutines } from "@/db/queries"
import CldImage from "./CldImage";
import Link from "next/link";


export const SectionRandomFamous = async () => {
    const res = await getRandomFamousPersonWithRoutines();

    if (!res) return;

    const { image, personName, personContent, personId } = res[0];

    return (
        <section className="@container">
            <div className="my-6 bg-cyan-300  flex flex-col @2xl:flex-row">
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
                <div className="p-8 pr-12 text-blue-800">
                    <Link href={`/famous-routines/${personId}`} className="text-xs underline">Detail: {personName}</Link>
                    <p className="text-3xl mb-4">
                        {personContent}
                    </p>
                    <p className="text-md max-w-xl">
                        Inspiring Routines, Not Ideals — A glimpse into the daily rhythms of thinkers, artists, and doers. Not to imitate, but to reflect and reshape your own way of living.
                    </p>
                </div>
            </div>



        </section>
    )

}