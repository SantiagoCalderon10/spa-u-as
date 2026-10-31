import arrowRight from '../../assets/hero/arrow-right.svg';
import sparkles from '../../assets/hero/sparkles.svg';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.lead}>
            Manicura, color y pequeños momentos para ti. En Three Masters, cada detalle se convierte
            en una forma de bienestar.
          </p>

          <h1 id="hero-title" className={styles.title}>
            El arte de
            <br />
            cuidarte
          </h1>

          <div className={styles.actions}>
            <a className={styles.primaryAction} href="#catalogo">
              Descubre nuestros servicios
              <img src={arrowRight} alt="" />
            </a>
            <a className={styles.secondaryAction} href="#salon">
              Conoce el salón
            </a>
          </div>

          <p className={styles.note}>
            <img src={sparkles} alt="" />
            Cuidado consciente. Belleza a tu manera.
          </p>
        </div>

        <div className={styles.heroFooter}>
          <span className={styles.footerLeft}>El detalle hace la diferencia</span>
          <span className={styles.footerRight}>01 — Three Masters</span>
        </div>
      </div>
    </section>
  );
}
