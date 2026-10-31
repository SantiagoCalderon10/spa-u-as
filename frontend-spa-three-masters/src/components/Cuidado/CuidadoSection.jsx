import { CUIDADO } from '../../content/landing';
import styles from './CuidadoSection.module.css';

function IconoDestellos() {
  return (
    <svg className={styles.icon} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 2.2v3.6M12.8 4h-3.6" />
      <path d="M9.4 8.1c.2-.6.7-1 1.6-1s1.4.4 1.6 1l.9 4.3 4.3.9c.6.2 1 .7 1 1.6s-.4 1.4-1 1.6l-4.3.9-.9 4.3c-.2.6-.7 1-1.6 1s-1.4-.4-1.6-1l-.9-4.3-4.3-.9c-.6-.2-1-.7-1-1.6s.4-1.4 1-1.6l4.3-.9.9-4.3z" />
    </svg>
  );
}

function IconoManos() {
  return (
    <svg className={styles.icon} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 11.6 5.7 8.4a2 2 0 0 1 2.8 0l2.2 2.2" />
      <path d="M19.5 11.6 16.3 8.4a2 2 0 0 0-2.8 0l-2.2 2.2" />
      <path d="M8.4 12.8 11 15.4a1.4 1.4 0 0 0 2 0l.6-.6" />
    </svg>
  );
}

function IconoGotas() {
  return (
    <svg className={styles.icon} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.3 3.4c2 2.3 3.6 4.4 3.6 6.6a3.6 3.6 0 1 1-7.2 0c0-2.2 1.6-4.3 3.6-6.6z" />
      <path d="M15.4 10.2c1.4 1.6 2.5 3 2.5 4.5a2.5 2.5 0 1 1-5 0c0-1.5 1.1-2.9 2.5-4.5z" />
    </svg>
  );
}

const ICONOS = [IconoDestellos, IconoManos, IconoGotas];

export default function CuidadoSection() {
  return (
    <section id="cuidado" className={styles.section} aria-labelledby="cuidado-title">
      <div className={styles.container}>
        <div className={styles.photo} role="img" aria-label={CUIDADO.fotoAlt} />

        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{CUIDADO.antetitulo}</p>
            <h2 id="cuidado-title" className={styles.title}>{CUIDADO.titulo}</h2>
          </header>

          <ul className={styles.benefits}>
            {CUIDADO.beneficios.map((beneficio, index) => {
              const Icono = ICONOS[index % ICONOS.length];
              return (
                <li key={beneficio.titulo} className={styles.benefit}>
                  <Icono />
                  <div>
                    <h3 className={styles.benefitTitle}>{beneficio.titulo}</h3>
                    <p className={styles.benefitBody}>{beneficio.descripcion}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
