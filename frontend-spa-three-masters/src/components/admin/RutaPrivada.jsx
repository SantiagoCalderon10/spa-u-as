import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RutaPrivada.module.css';

// Por ahora el panel es solo de administración. La vista del profesional
// (FN-14) tendrá su propia guardia cuando se implemente.
const ROLES_CON_PANEL = ['administrador'];

export default function RutaPrivada() {
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

  if (!usuario || !ROLES_CON_PANEL.includes(usuario.rol)) {
    return <Navigate to="/admin/login" replace state={{ desde: ubicacion }} />;
  }

  return <Outlet />;
}
