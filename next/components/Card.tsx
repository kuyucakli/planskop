"use client"
import { CldImage } from "next-cloudinary";
import { PropsWithChildren } from "react";

const Card = ({ children }: PropsWithChildren) => {
    return (
        <div className="block my-4 p-6 bg-white rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {children}
        </div>
    )
}

const CardHeader = Card.Header = ({ children }: PropsWithChildren) => (
    <div className="">{children}</div>
);



const CardBody = ({ children, className }: PropsWithChildren & { className: string }) => (
    <div className={`${className}`}>{children}</div>
);

const CardFooter = ({ children }: PropsWithChildren) => (
    <footer>{children}</footer>
);

const CardImage = ({ path, altText }: PropsWithChildren & { path: string, altText: string }) => (
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
)

export default Card;
export { CardHeader, CardBody, CardFooter, CardImage };