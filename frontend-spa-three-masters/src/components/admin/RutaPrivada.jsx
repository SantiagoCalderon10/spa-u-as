import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RutaPrivada.module.css';

const PANEL_POR_ROL = {
  administrador: '/admin',
  profesional: '/profesional/agenda',
  cliente: '/cuenta/perfil',
};

export default function RutaPrivada({ roles = ['administrador'], loginPath = '/admin/login' }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return (
      <div className={styles.pantalla} role="status" aria-live="polite">
        <span className={styles.girador} aria-hidden="true" />
        Verificando sesión…
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to={loginPath} replace state={{ desde: ubicacion }} />;
  }

  if (!roles.includes(usuario.rol)) {
    return <Navigate to={PANEL_POR_ROL[usuario.rol] ?? '/'} replace />;
  }

  return <Outlet />;
}
