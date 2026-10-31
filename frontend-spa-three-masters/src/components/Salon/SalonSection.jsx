import { SALON } from '../../content/landing';
import styles from './SalonSection.module.css';

export default function SalonSection() {
  return (
    <section id="salon" className={styles.section} aria-labelledby="salon-title">
      <div className={styles.container}>
        <div className={styles.photo} role="img" aria-label={SALON.fotoAlt} />

        <div className={styles.text}>
          <p className={styles.eyebrow}>{SALON.antetitulo}</p>
          <h2 id="salon-title" className={styles.title}>{SALON.titulo}</h2>
          <p className={styles.description}>{SALON.descripcion}</p>
        </div>
      </div>
    </section>
  );
}
