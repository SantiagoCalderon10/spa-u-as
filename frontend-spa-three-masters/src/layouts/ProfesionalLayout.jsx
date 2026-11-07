import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inicialesDe } from '../utils/agenda';
import styles from './AdminLayout.module.css';

function IconoCalendario() {
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
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function IconoGlobo() {
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
      <path d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3z" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function IconoChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function IconoSalir() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 12H3" />
      <path d="m10 7 5 5-5 5" />
      <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

const enlaces = [
  {
    ruta: '/profesional/agenda',
    etiqueta: 'Mi agenda',
    Icono: IconoCalendario,
  },
];

export default function ProfesionalLayout() {
  const { pathname } = useLocation();
  const navegar = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const actual = enlaces.find(({ ruta }) => pathname.startsWith(ruta));

  const nombre = usuario?.nombrecompleto || usuario?.nombreusuario || 'Profesional';

  const salir = () => {
    cerrarSesion();
    navegar('/admin/login', { replace: true });
  };

  return (
    <div className={styles.marco}>
      <aside className={styles.barra}>
        <div className={styles.marcaBloque}>
          
          <p className={styles.marcaNota}>Espacio profesional</p>
        </div>

        <nav className={styles.navegacion} aria-label="Panel de la profesional">
          {enlaces.map(({ ruta, etiqueta, Icono }) => (
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
              <span className={styles.enlaceTexto}>{etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.pie}>
          <div className={styles.sitioCard}>
            <span className={styles.sitioIcono} aria-hidden="true">
              <IconoGlobo />
            </span>
            <p className={styles.sitioTitulo}>Tu horario, siempre a mano</p>
            <p className={styles.sitioTexto}>
              Consulta tus citas del día y cancela con justificación cuando haga falta.
            </p>
            <Link to="/" className={styles.sitioEnlace}>
              Ver página pública
              <IconoFlecha />
            </Link>
          </div>
          <p className={styles.pieNota}>Three Masters · Versión 1.0</p>
        </div>
      </aside>

      <div className={styles.area}>
        <header className={styles.topbar}>
          <nav className={styles.ruta} aria-label="Ubicación actual">
            <span className={styles.rutaRaiz}>Profesional</span>
            <span className={styles.rutaSeparador} aria-hidden="true">
              <IconoChevron />
            </span>
            <span className={styles.rutaActual} aria-current="page">
              {actual?.etiqueta ?? 'Mi agenda'}
            </span>
          </nav>

          <div className={styles.cuenta}>
            <Link to="/" className={styles.sitioEnlaceTopbar}>
              Ver sitio público
              <IconoFlecha />
            </Link>
            <span className={styles.separador} aria-hidden="true" />
            <span className={styles.avatar} aria-hidden="true">
              {inicialesDe(nombre)}
            </span>
            <span className={styles.cuentaTexto}>
              <span className={styles.cuentaNombre}>{nombre}</span>
              <span className={styles.cuentaRol}>Profesional</span>
            </span>
            <button
              type="button"
              className={styles.cerrarSesion}
              onClick={salir}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <IconoSalir />
            </button>
          </div>
        </header>

        <main className={styles.principal}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
