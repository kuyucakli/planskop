import Image from "next/image"
import Link from "next/link"
import styles from "./Logo.module.css"

export const Logo = () => {
    return (
        <Link href="/" className={styles.LogoMain}>
            <picture>

                <source srcSet="/planskop-logo/sm-on-dark-planskop-logo.png" media="(prefers-color-scheme: dark)" />

                <Image src="/planskop-logo/sm-on-light-planskop-logo.png" width="263" height="64" alt="Planksop logo" />
            </picture>

        </Link>
    )
}

export const LogoPictogramApp = () => {
    return (
        <Link href="/dashboard" >
            <picture>
                <source srcSet="/planskop-logo/sm-on-dark-planskop-pictogram.png" media="(prefers-color-scheme: dark)" />
                <Image src="/planskop-logo/sm-on-light-planskop-pictogram.png" width="48" height="48" alt="Planksop logo" />
            </picture>

        </Link>
    )
}