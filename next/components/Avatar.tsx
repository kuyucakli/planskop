import styles from "./Avatar.module.css";
import Image from "next/image";

type AvatarProps = {
  url?: string | null;
  name?: string | null;
  useCaption?: boolean;
};

export default function Avatar({ url, name, useCaption = false }: AvatarProps) {
  if (!url || !name) {
    return (
      <figure>
        <p>0ps sorry!</p>
      </figure>
    );
  }

  return (
    <figure className={styles.Avatar}>
      {url && (
        <Image
          src={url}
          alt={name || ""}
          title={name || ""}
          width="32"
          height="32"
        />
      )}
      {useCaption && <figcaption> {name || "unknown"} </figcaption>}
    </figure>
  );
}
