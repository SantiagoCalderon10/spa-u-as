import { Link } from 'react-router-dom';
import { CONTACTO } from '../../content/landing';
import styles from './Footer.module.css';

const ENLACES = [
  { etiqueta: 'Inicio', href: '#inicio' },
  { etiqueta: 'Salón', href: '#salon' },
  { etiqueta: 'Servicios', href: '#catalogo' },
  { etiqueta: 'Equipo', href: '#equipo' },
];

export default function Footer() {
  const { telefono, redes } = CONTACTO;

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

          <div className={styles.contact}>
            <a className={styles.phone} href={telefono.enlace}>
              {telefono.valor}
            </a>
            <div className={styles.social}>
              {Object.values(redes).map((red) => (
                <a
                  key={red.etiqueta}
                  className={styles.socialLink}
                  href={red.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {red.etiqueta}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <p>© {new Date().getFullYear()} Three Masters Spa. Todos los derechos reservados.</p>
          <Link to="/admin" className={styles.legalLink}>Acceso del equipo</Link>
        </div>
      </div>
    </footer>
  );
}
