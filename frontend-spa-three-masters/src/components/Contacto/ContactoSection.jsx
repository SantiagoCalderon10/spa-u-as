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

function IconoWhatsApp() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 2.1a6.9 6.9 0 0 0-5.9 10.4L2.1 15.9l3.5-.9A6.9 6.9 0 1 0 9 2.1z" />
      <path d="M6.6 5.5c.2-.3.4-.3.6-.3h.4c.2 0 .3 0 .5.4l.6 1.5c.1.2 0 .4-.1.5l-.5.5c-.1.1-.2.3 0 .6a4.8 4.8 0 0 0 2.2 1.9c.3.1.4 0 .6-.1l.4-.5c.2-.2.4-.2.6-.1l1.3.6c.3.1.4.3.4.5a1.5 1.5 0 0 1-1.5 1.3c-1 0-2.5-.5-3.8-1.8s-1.9-2.8-1.9-3.8a1.5 1.5 0 0 1 .3-1.2z" />
    </svg>
  );
}

function IconoInstagram() {
  return (
    <svg
      className={styles.channelIcon}
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

function IconoFacebook() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <path d="M10.7 16v-6h2l.3-2.3h-2.3V6.2c0-.7.2-1.1 1.2-1.1h1.2V3.1a16 16 0 0 0-1.8-.1c-1.8 0-3 1.1-3 3.1v1.6H6.2V10h2.1v6z" />
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
            <a className={styles.channel} href={CONTACTO.telefono.enlace}>
              <div className={styles.channelSymbol}>
                <IconoTelefono />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.telefono.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.telefono.valor}</p>
              </div>
            </a>

            <a
              className={styles.channel}
              href={CONTACTO.telefono.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.channelSymbol}>
                <IconoWhatsApp />
              </div>
              <div>
                <p className={styles.channelTitle}>WhatsApp</p>
                <p className={styles.channelValue}>Agenda y resuelve tus dudas por chat</p>
              </div>
            </a>

            <a
              className={styles.channel}
              href={CONTACTO.redes.instagram.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.channelSymbol}>
                <IconoInstagram />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.redes.instagram.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.redes.instagram.usuario}</p>
              </div>
            </a>

            <a
              className={styles.channel}
              href={CONTACTO.redes.facebook.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.channelSymbol}>
                <IconoFacebook />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.redes.facebook.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.redes.facebook.usuario}</p>
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
