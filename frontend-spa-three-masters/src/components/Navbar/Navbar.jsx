import { Link } from 'react-router-dom';
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

function IconoUsuario(){
  return (
    <svg
      className={styles.ctaIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function Navbar({ enLanding = true }) {
  // En la landing los enlaces son anclas internas; en las páginas públicas
  // hijas deben volver a la landing antes de saltar a la sección.
  const enlaceSeccion = (id) => (enLanding ? `#${id}` : `/#${id}`);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand} aria-label="Three Masters, volver al inicio">
          <span className={`${styles.brandMark} ${styles.brandMonogram}`} aria-hidden="true">TM</span>
          <span className={styles.brandText}>Three <span>Masters</span></span>
        </Link>

        <nav className={styles.navigation} aria-label="Navegación principal">
          <ul className={styles.navLinks}>
            <li><a href={enlaceSeccion('filosofia')} className={styles.link}>Salón</a></li>
            <li><a href={enlaceSeccion('catalogo')} className={styles.link}>Servicios</a></li>
            <li><a href={enlaceSeccion('galeria')} className={styles.link}>Nuestro trabajo</a></li>
            <li><a href={enlaceSeccion('equipo')} className={styles.link}>Equipo</a></li>
          </ul>

          <Link to="/reservar" className={styles.ctaBtn}>
            <IconoFlechaArriba />
            Reserva ahora
          </Link>
        </nav>
        <Link to="/admin/login" className={`${styles.ctaBtn} ${styles.loginBtn}`} aria-label="Iniciar sesión">
          <IconoUsuario />
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
