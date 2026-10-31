import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const ENLACES = [
  { etiqueta: 'Inicio', href: '#inicio' },
  { etiqueta: 'Salón', href: '#salon' },
  { etiqueta: 'Servicios', href: '#catalogo' },
  { etiqueta: 'Equipo', href: '#equipo' },
];

const TELEFONO = '+57 318 450 9821';

export default function Footer() {
  return (
    <footer id="contacto" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.brandName}>Three Masters</p>
            <p className={styles.brandDescriptor}>Atelier de uñas</p>
          </div>

          <nav className={styles.links} aria-label="Enlaces del pie de página">
            {ENLACES.map((enlace) => (
              <a key={enlace.href} className={styles.link} href={enlace.href}>
                {enlace.etiqueta}
              </a>
            ))}
          </nav>

          <a className={styles.phone} href="tel:+573184509821">
            {TELEFONO}
          </a>
        </div>

        <div className={styles.legal}>
          <p>© {new Date().getFullYear()} Three Masters Spa. Todos los derechos reservados.</p>
          <Link to="/admin" className={styles.legalLink}>Acceso del equipo</Link>
        </div>
      </div>
    </footer>
  );
}
