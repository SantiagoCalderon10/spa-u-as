import styles from './BeneficiosSection.module.css';

export default function BeneficiosSection() {
  const items = [
    {
      icono: '🩺',
      titulo: 'Higiene & Esterilización',
      descripcion: 'Protocolos de bioseguridad rigurosos, herramientas esterilizadas y material descartable.',
    },
    {
      icono: '👩‍🎨',
      titulo: 'Masters Profesionales',
      descripcion: 'Especialistas capacitadas en las últimas tendencias y técnicas internacionales de manicura.',
    },
    {
      icono: '💎',
      titulo: 'Productos de Primera Línea',
      descripcion: 'Esmaltes, geles y tratamientos libres de tóxicos que protegen y nutren la uña natural.',
    },
    {
      icono: '☕',
      titulo: 'Espacio Exclusivo & Relax',
      descripcion: 'Ambiente diseñado para tu desconexión, música suave, café de cortesía y atención personalizada.',
    },
  ];

  return (
    <section id="beneficios" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Excelencia en cada detalle</span>
          <h2 className={styles.title}>¿Por qué elegir Three Masters?</h2>
        </div>

        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.iconCircle}>{item.icono}</div>
              <h3 className={styles.itemTitle}>{item.titulo}</h3>
              <p className={styles.itemDescription}>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

