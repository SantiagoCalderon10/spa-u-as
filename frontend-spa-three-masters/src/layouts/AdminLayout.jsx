import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inicialesDe } from '../utils/agenda';
import styles from './AdminLayout.module.css';

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

function IconoResumen(){
  return(
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.54999 0.800049H5.29999C5.7142 0.800049 6.04999 1.13584 6.04999 1.55005V6.80005C6.04999 7.21426 5.7142 7.55005 5.29999 7.55005H1.54999C1.13577 7.55005 0.799988 7.21426 0.799988 6.80005V1.55005C0.799988 1.13584 1.13577 0.800049 1.54999 0.800049ZM9.79999 0.800049H13.55C13.9642 0.800049 14.3 1.13584 14.3 1.55005V3.80005C14.3 4.21426 13.9642 4.55005 13.55 4.55005H9.79999C9.38577 4.55005 9.04999 4.21426 9.04999 3.80005V1.55005C9.04999 1.13584 9.38577 0.800049 9.79999 0.800049ZM9.79999 7.55005H13.55C13.9642 7.55005 14.3 7.88584 14.3 8.30005V13.55C14.3 13.9643 13.9642 14.3 13.55 14.3H9.79999C9.38577 14.3 9.04999 13.9643 9.04999 13.55V8.30005C9.04999 7.88584 9.38577 7.55005 9.79999 7.55005ZM1.54999 10.55H5.29999C5.7142 10.55 6.04999 10.8858 6.04999 11.3V13.55C6.04999 13.9643 5.7142 14.3 5.29999 14.3H1.54999C1.13577 14.3 0.799988 13.9643 0.799988 13.55V11.3C0.799988 10.8858 1.13577 10.55 1.54999 10.55Z" stroke-width="1.6" stroke-linecap="round" stroke="#7A4D5C"/>
</svg>



  )
}

function IconoCalendario() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 1.49939V2.99951M6 2.99951V4.49963M6 2.99951H3.75C2.92157 2.99951 2.25 3.67114 2.25 4.49963V7.49987M6 2.99951H12M12 1.49939V2.99951M12 2.99951V4.49963M12 2.99951H14.25C15.0784 2.99951 15.75 3.67114 15.75 4.49963V7.49987M2.25 7.49987H15.75M2.25 7.49987V15.0005C2.25 15.829 2.92157 16.5006 3.75 16.5006H14.25C15.0784 16.5006 15.75 15.829 15.75 15.0005V7.49987M6 10.5001H6.0075M9 10.5001H9.0075M12 10.5001H12.0075M6 13.5003H6.0075M9 13.5003H9.0075M12 13.5003H12.0075" stroke-width="1.6" stroke-linecap="round" stroke="#7A4D5C"/>
</svg>

  )}

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
    ruta: '/admin/resumen',
    etiqueta: 'Resumen',
    Icono: IconoResumen,
  },
  {
    ruta: '/admin/servicios',
    etiqueta: 'Servicios',
    Icono: IconoEsmalte,
  },
  {
    ruta: '/admin/profesionales',
    etiqueta: 'Profesionales',
    Icono: IconoPersona,
  },
  {
    ruta: '/admin/categorias',
    etiqueta: 'Categorías',
    Icono: IconoEtiqueta,
  },
  {
    ruta: '/admin/horarios',
    etiqueta: 'Horarios',
    Icono: IconoReloj,
  },
  {
    ruta: '/admin/citas',
    etiqueta: 'Citas',
    Icono: IconoCalendario,
  }
];

const ETIQUETAS_ROL = {
  administrador: 'Administración',
  profesional: 'Profesional',
  cliente: 'Cliente',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navegar = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const actual = enlaces.find(({ ruta }) => pathname.startsWith(ruta));

  const nombre = usuario?.nombrecompleto || usuario?.nombreusuario || 'Three Masters';
  const rol = ETIQUETAS_ROL[usuario?.rol] ?? 'Administración';

  const salir = () => {
    cerrarSesion();
    navegar('/admin/login', { replace: true });
  };

  return (
    <div className={styles.marco}>
      <aside className={styles.barra}>
        <div className={styles.marcaBloque}>
          
          <p className={styles.marcaNota}>Espacio de gestión</p>
        </div>

        <nav className={styles.navegacion} aria-label="Administración del atelier">
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
            <p className={styles.sitioTitulo}>Tu salón, en línea</p>
            <p className={styles.sitioTexto}>
              Comparte tus servicios y recibe nuevas consultas.
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
            <span className={styles.rutaRaiz}>Administración</span>
            <span className={styles.rutaSeparador} aria-hidden="true">
              <IconoChevron />
            </span>
            <span className={styles.rutaActual} aria-current="page">
              {actual?.etiqueta ?? 'Panel'}
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
              <span className={styles.cuentaRol}>{rol}</span>
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
