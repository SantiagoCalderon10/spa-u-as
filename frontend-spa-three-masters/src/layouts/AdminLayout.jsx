import { Link, NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

function IconoDestello() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2L12 3z" />
    </svg>
  );
}

function IconoEsmalte() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 8h6v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8z" />
      <path d="M10 8V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V8" />
      <path d="M9 12h6" />
    </svg>
  );
}

function IconoEtiqueta() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.4" />
    </svg>
  );
}

function IconoPersona() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.3 3.1-5.6 7-5.6s7 2.3 7 5.6" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

const enlaces = [
  {
    ruta: '/admin/servicios',
    etiqueta: 'Servicios',
    detalle: 'Precios, duración y visibilidad',
    Icono: IconoEsmalte,
  },
  {
    ruta: '/admin/categorias',
    etiqueta: 'Categorías',
    detalle: 'Agrupación del catálogo',
    Icono: IconoEtiqueta,
  },
  {
    ruta: '/admin/profesionales',
    etiqueta: 'Profesionales',
    detalle: 'Equipo y especialidades',
    Icono: IconoPersona,
  },
  {
    ruta: '/admin/horarios',
    etiqueta: 'Horarios',
    detalle: 'Franjas semanales de atención',
    Icono: IconoReloj,
  },
];

export default function AdminLayout() {
  return (
    <div className={styles.marco}>
      <aside className={styles.barra}>
        <div className={styles.marcaBloque}>
          <Link to="/" className={styles.marca}>
            <span className={styles.marcaIcono} aria-hidden="true">
              <IconoDestello />
            </span>
            <span className={styles.marcaTexto}>
              Three Masters <em>Atelier</em>
            </span>
          </Link>
          <p className={styles.marcaNota}>Administración del atelier</p>
        </div>

        <nav className={styles.navegacion} aria-label="Administración del atelier">
          {enlaces.map(({ ruta, etiqueta, detalle, Icono }) => (
            <NavLink
              key={ruta}
              to={ruta}
              className={({ isActive }) =>
                `${styles.enlace} ${isActive ? styles.enlaceActivo : ''}`
              }
            >
              <span className={styles.enlaceIcono} aria-hidden="true">
                <Icono />
              </span>
              <span className={styles.enlaceTexto}>
                <span className={styles.enlaceEtiqueta}>{etiqueta}</span>
                <span className={styles.enlaceDetalle}>{detalle}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.pie}>
          <Link to="/" className={styles.volver}>
            Volver al sitio
          </Link>
          <p className={styles.pieNota}>
            Los cambios se publican en el catálogo del atelier.
          </p>
        </div>
      </aside>

      <div className={styles.contenido}>
        <main className={styles.principal}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
