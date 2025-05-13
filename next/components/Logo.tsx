import Image from "next/image"
import Link from "next/link"
import styles from "./Logo.module.css"
import { PropsWithChildren } from "react"

const Logo = ({ onlyPictogram = false }: PropsWithChildren & { onlyPictogram?: boolean }) => {
    return (
        <Link href={onlyPictogram ? "/dashboard" : "/"} className={styles.LogoMain}>
            {onlyPictogram
                ?
                <picture>
                    <source srcSet="/planskop-logo/sm-on-dark-planskop-pictogram.png" media="(prefers-color-scheme: dark)" />
                    <Image src="/planskop-logo/sm-on-light-planskop-pictogram.png" width="48" height="48" alt="Planksop logo" />
                </picture>

                :
                <picture>

                    <source srcSet="/planskop-logo/sm-on-dark-planskop-logo.png" media="(prefers-color-scheme: dark)" />

                    <Image src="/planskop-logo/sm-on-light-planskop-logo.png" width="263" height="64" alt="Planksop logo" />
                </picture>
            }


        </Link>
    )
}




export default Logo