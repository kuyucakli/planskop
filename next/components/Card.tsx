"use client"
import { PropsWithChildren } from "react";
import { CldImage } from "next-cloudinary";

const Card = ({ children, imgUrl, altText, heading }: PropsWithChildren & { imgUrl: string, altText: string, heading: string }) => {
    return (
        <div className="block my-4 p-6 bg-white rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h2 className="text-xl my-2">{heading}</h2>
            <CldImage
                src={imgUrl}
                alt={altText}
                width="80"
                height="80"
                crop="fill"
                removeBackground
                background="pink"
                gravity="face"
            />
            {children}
        </div>
    )
}


export default Card;