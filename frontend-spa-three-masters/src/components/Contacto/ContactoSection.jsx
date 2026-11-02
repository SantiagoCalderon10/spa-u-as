import { Link } from 'react-router-dom';
import { CONTACTO } from '../../content/landing';
import styles from './ContactoSection.module.css';

function IconoTelefono() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 12.8v2.2a1.5 1.5 0 0 1-1.64 1.5 14.84 14.84 0 0 1-6.47-2.3 14.62 14.62 0 0 1-4.5-4.5A14.84 14.84 0 0 1 1.6 3.2 1.5 1.5 0 0 1 3.1 1.5h2.2a1.5 1.5 0 0 1 1.5 1.29 9.61 9.61 0 0 0 .52 2.11 1.5 1.5 0 0 1-.34 1.58L5.8 7.66a11.74 11.74 0 0 0 4.5 4.5l1.18-1.18a1.5 1.5 0 0 1 1.58-.34 9.61 9.61 0 0 0 2.11.52 1.5 1.5 0 0 1 1.29 1.52z" />
    </svg>
  );
}

function IconoCorreo() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.25" y="3.75" width="13.5" height="10.5" rx="2" />
      <polyline points="15.75,5.25 9,9.75 2.25,5.25" />
    </svg>
  );
}

const PASOS = [
  {
    titulo: 'Elige tu servicio',
    detalle: 'Duración y precio a la vista, sin llamadas ni mensajes.',
  },
  {
    titulo: 'Profesional, fecha y hora',
    detalle: 'Solo verás los horarios que de verdad están libres.',
  },
  {
    titulo: 'Confirma tus datos',
    detalle: 'Sin crear una cuenta. Te damos un enlace para ver o cancelar la cita.',
  },
];

export default function ContactoSection() {
  return (
    <section id="contacto" className={styles.section} aria-labelledby="contacto-title">
      <div className={styles.container}>
        <div className={styles.info}>
          <header className={styles.infoHeader}>
            <p className={styles.eyebrow}>{CONTACTO.antetitulo}</p>
            <h2 id="contacto-title" className={styles.title}>
              {CONTACTO.titulo}
            </h2>
            <p className={styles.description}>
              {CONTACTO.descripcion}
            </p>
          </header>

          <div className={styles.channels}>
            <a className={styles.channel} href="tel:+573184509821">
              <div className={styles.channelSymbol}>
                <IconoTelefono />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.telefono.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.telefono.valor}</p>
              </div>
            </a>

            <a className={styles.channel} href="mailto:contacto@threemasters.com">
              <div className={styles.channelSymbol}>
                <IconoCorreo />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.correo.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.correo.valor}</p>
              </div>
            </a>
          </div>
        </div>

        <div className={styles.bookingCard}>
          <div className={styles.cardHead}>
            <p className={styles.eyebrow}>Reserva en línea</p>
            <h3 className={styles.cardTitle}>Tu cita, en tres pasos</h3>
          </div>

          <ol className={styles.steps}>
            {PASOS.map((paso, indice) => (
              <li key={paso.titulo} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <span className={styles.stepBody}>
                  <span className={styles.stepTitle}>{paso.titulo}</span>
                  <span className={styles.stepDetail}>{paso.detalle}</span>
                </span>
              </li>
            ))}
          </ol>

          <Link className={styles.button} to="/reservar">
            Reservar ahora
          </Link>

          <p className={styles.cardNote}>
            Al confirmar recibirás un enlace único para revisar o cancelar tu cita.
          </p>
        </div>
      </div>
    </section>
  );
}
