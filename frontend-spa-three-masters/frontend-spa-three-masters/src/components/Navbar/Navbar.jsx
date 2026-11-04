import styles from './Navbar.module.css';

function IconoFlechaArriba() {
  return (
    <svg
      className={styles.ctaIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.667 11.333 11.333 4.667" />
      <path d="M4.667 4.667h6.666v6.666" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>

        <nav className={styles.navigation} aria-label="Navegación principal">
          <ul className={styles.navLinks}>
            <li><a href="#filosofia" className={styles.link}>Salón</a></li>
            <li><a href="#catalogo" className={styles.link}>Servicios</a></li>
            <li><a href="#galeria" className={styles.link}>Nuestro trabajo</a></li>
            <li><a href="#equipo" className={styles.link}>Equipo</a></li>
          </ul>

          <a href="#catalogo" className={styles.ctaBtn}>
            <IconoFlechaArriba />
            Reserva ahora
          </a>
        </nav>
      </div>
    </header>
  );
}
