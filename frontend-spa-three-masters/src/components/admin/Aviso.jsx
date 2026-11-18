import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Aviso.module.css';

// Debe coincidir con la animación `salir` de Aviso.module.css.
const MS_SALIDA = 180;
const MS_AUTOCIERRE = 6000;

export default function Aviso({ tipo = 'exito', mensaje, onCerrar }) {
  const [saliendo, setSaliendo] = useState(false);
  const saliendoRef = useRef(false);
  const temporizador = useRef(null);
  const onCerrarRef = useRef(onCerrar);
  onCerrarRef.current = onCerrar;

  const cerrar = useCallback(() => {
    if (saliendoRef.current) return;

    const reducido =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducido) {
      onCerrarRef.current?.();
      return;
    }

    saliendoRef.current = true;
    setSaliendo(true);
    temporizador.current = setTimeout(() => onCerrarRef.current?.(), MS_SALIDA);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  useEffect(() => {
    if (!mensaje) return undefined;

    saliendoRef.current = false;
    setSaliendo(false);

    const auto = setTimeout(cerrar, MS_AUTOCIERRE);
    return () => clearTimeout(auto);
  }, [mensaje, cerrar]);

  if (!mensaje) return null;

  const esError = tipo === 'error';

  return (
    <div
      className={`${styles.aviso} ${esError ? styles.error : styles.exito} ${
        saliendo ? styles.saliendo : ''
      }`}
      role={esError ? 'alert' : 'status'}
    >
      <span className={styles.mensaje}>{mensaje}</span>
      <button
        type="button"
        className={styles.cerrar}
        onClick={cerrar}
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
