import { GALERIA } from '../../content/landing';
import styles from './GaleriaSection.module.css';

function IconoInstagram() {
  return (
    <svg
      className={styles.socialIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.25" y="2.25" width="13.5" height="13.5" rx="4" />
      <circle cx="9" cy="9" r="3.25" />
      <circle cx="13.1" cy="4.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function GaleriaSection() {
  return (
    <section id="galeria" className={styles.section} aria-labelledby="galeria-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>{GALERIA.antetitulo}</p>
            <h2 id="galeria-title" className={styles.title}>{GALERIA.titulo}</h2>
          </div>

          <a
            className={styles.social}
            href={GALERIA.instagram.url}
            target="_blank"
            rel="noreferrer"
          >
            <IconoInstagram />
            {GALERIA.instagram.etiqueta}
          </a>
        </header>

        <ul className={styles.collection}>
          {GALERIA.trabajos.map((trabajo, index) => (
            <li key={trabajo.titulo} className={styles.item} data-posicion={index + 1}>
              <div
                className={styles.photo}
                role="img"
                aria-label={trabajo.fotoAlt}
              />
              <p className={styles.caption}>{trabajo.titulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
