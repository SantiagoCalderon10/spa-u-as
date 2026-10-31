import { useEffect } from 'react';
import styles from './Aviso.module.css';

export default function Aviso({ tipo = 'exito', mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return undefined;
    const temporizador = setTimeout(onCerrar, 6000);
    return () => clearTimeout(temporizador);
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;

  const esError = tipo === 'error';

  return (
    <div
      className={`${styles.aviso} ${esError ? styles.error : styles.exito}`}
      role={esError ? 'alert' : 'status'}
    >
      <span className={styles.mensaje}>{mensaje}</span>
      <button
        type="button"
        className={styles.cerrar}
        onClick={onCerrar}
        aria-label="Cerrar aviso"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
