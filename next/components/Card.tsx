"use client";
import { CldImage } from "next-cloudinary";
import ColorLegend from "./ColorLegend";
import { FamousPersonWithRoutines } from "@/db/schema";
import { PropsWithChildren } from "react";
import styles from "./Card.module.css";
import { UseThemeContext } from "@/context/ThemeContext";
import { ChartFamousDailyRoutines } from "./charts/";

const Card = ({ children, className }: PropsWithChildren & { className?: string }) => {
    return (
        <div className={`${className} block my-4 p-6 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}>
            {children}
        </div>
    );
};

const CardHeader = (Card.Header = ({ children }: PropsWithChildren) => (
    <div className="">{children}</div>
));

const CardBody = ({
    children,
    className,
}: PropsWithChildren & { className: string }) => (
    <div className={`${className}`}>{children}</div>
);

const CardFooter = ({ children }: PropsWithChildren) => (
    <footer>{children}</footer>
);

const CardImage = ({
    path,
    altText,
}: PropsWithChildren & { path: string; altText: string }) => (
    <CldImage
        src={path}
        alt={altText}
        width="80"
        height="80"
        crop="fill"
        removeBackground
        background="pink"
        gravity="face"
    />
);

const CardFamousPersonSummary = ({
    famousPerson,
    isSkeletonView = false,
}: {
    famousPerson: Pick<FamousPersonWithRoutines, 'image' | 'personName' | 'routines'>;
    isSkeletonView?: Boolean
}) => {
    const { colors } = UseThemeContext();
    const { image, personName, routines } = famousPerson;
    if (isSkeletonView) {
        return (
            <Card className={styles.CardSkeleton}>
                <CardHeader>
                    <h2 className="text-xl my-2"></h2>
                </CardHeader>
                <CardBody className="flex items-start gap-6">


                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl my-2">{personName}</h2>
            </CardHeader>
            <CardBody className="flex items-start gap-6">
                <CardImage path={image} altText={personName} />
                <ColorLegend
                    list={routines.map((r, i) => ({
                        color: colors[i],
                        label: r.activityName,
                    }))}
                />
            </CardBody>
            <CardFooter>
                <ChartFamousDailyRoutines routines={routines} compact />
            </CardFooter>
        </Card>
    );
};

export default Card;
export { CardHeader, CardBody, CardFooter, CardImage, CardFamousPersonSummary };
