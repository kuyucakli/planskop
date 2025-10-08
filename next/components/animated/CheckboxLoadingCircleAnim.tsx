"use client";
import styles from "./CheckboxAnim.module.css";
export default function CheckboxLoadingCircleAnim({
  state,
}: {
  state: "loading" | "";
}) {
  return (
    <div
      className={`w-6 h-6 bg-red absolute top-1/2 left-1/2 -translate-1/2 pointer-events-none`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`${styles.Effect} ${
          state == "loading" ? styles.EffectLoading : "hidden"
        }`}
      >
        <circle className={`${styles.EffectCircleBg}`}></circle>
        <circle className={styles.EffectCircleFg}></circle>
      </svg>
    </div>
  );
}
