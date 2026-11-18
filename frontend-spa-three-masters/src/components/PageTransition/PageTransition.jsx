import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

/**
 * Envuelve el contenido de una ruta y le da una entrada suave cada vez que
 * cambia la URL. La `key` por `pathname` fuerza el remontaje del bloque, de modo
 * que la animación CSS se reproduce aunque React reutilice el contenedor.
 */
export default function PageTransition({ children, className = '' }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className={`${styles.transition} ${className}`.trim()}>
      {children}
    </div>
  );
}
