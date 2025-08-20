import styles from "./AppIntro.module.css";
import Logo from "./Logo";

const AppIntro = () => {
  return (
    <section className={`${styles.AppIntro}`}>
      <div className={`${styles.Layer}`}></div>
      <div className={`${styles.Layer}`}></div>
      <div className={`${styles.LogoWrapper}`}>
        <Logo />
      </div>
    </section>
  );
};

export default AppIntro;
