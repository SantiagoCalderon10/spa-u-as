import styles from './FilosofiaSection.module.css';

export default function FilosofiaSection() {
  const pilares = [
    {
      titulo: 'Bioseguridad de Grado Clínico',
      descripcion: 'Cada instrumental pasa por proceso triple: lavado enzimático, autoclave hospitalario a 134°C y empaque termosellado que se abre en tu presencia.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      titulo: 'Preservación de la Lámina',
      descripcion: 'Priorizamos la salud y estructura anatómica natural. No realizamos limados abrasivos en la placa ungueal ni usamos químicos corrosivos.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" />
        </svg>
      ),
    },
    {
      titulo: 'Arquitectura & Durabilidad',
      descripcion: 'Formulación y aplicación balanceada del ápice y los laterales para prevenir rupturas dolorosas, garantizando resistencia con apariencia ligera.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ];

  return (
    <section id="filosofia" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <h2 className={styles.title}>Pilares de Atención y Técnica</h2>
          <p className={styles.lead}>
            En Three Masters cada servicio es ejecutado con rigor técnico y respeto por tu anatomía.
            Nos alejamos de la prisa industrial para brindar acabados de nivel galería.
          </p>
        </div>

        <div className={styles.grid}>
          {pilares.map((pilar, index) => (
            <article key={index} className={styles.pillarCard}>
              <div className={styles.iconBox} aria-hidden="true">
                {pilar.icon}
              </div>
              <h3 className={styles.cardTitle}>{pilar.titulo}</h3>
              <p className={styles.cardBody}>{pilar.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

