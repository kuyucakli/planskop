import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";
import { PropsWithChildren } from "react";

const Logo = ({
  onlyPictogram = false,
}: PropsWithChildren & { onlyPictogram?: boolean }) => {
  return (
    <Link href="/" className={styles.LogoMain}>
      {onlyPictogram ? <Image
            src="/planskop-logo/xs-on-dark-planskop-pictogram.png"
            width="24"
            height="24"
            alt="Planksop logo"
          /> : (
        <picture>
          <source
            srcSet="/planskop-logo/sm-on-dark-planskop-logo.png"
            media="(prefers-color-scheme: dark)"
          />

          <Image
            src="/planskop-logo/sm-on-light-planskop-logo.png"
            width="263"
            height="64"
            alt="Planksop logo"
          />
        </picture>
      )}
    </Link>
  );
};

export default Logo;
