import { INVITACION } from '../../content/landing';
import styles from './InvitacionSection.module.css';

function IconoMensaje() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.8 9.4a1.6 1.6 0 0 1-1.6 1.6H5.2L2.6 13.6V4.2a1.6 1.6 0 0 1 1.6-1.6h8a1.6 1.6 0 0 1 1.6 1.6z" />
    </svg>
  );
}

export default function InvitacionSection() {
  return (
    <section id="invitacion" className={styles.section} aria-labelledby="invitacion-title">
      <div className={styles.container}>
        <div className={styles.message}>
          <p className={styles.eyebrow}>{INVITACION.etiqueta}</p>
          <p id="invitacion-title" className={styles.text}>{INVITACION.mensaje}</p>
        </div>

        <a
          className={styles.button}
          href={INVITACION.url}
          target="_blank"
          rel="noreferrer"
        >
          <IconoMensaje />
          {INVITACION.boton}
        </a>
      </div>
    </section>
  );
}
