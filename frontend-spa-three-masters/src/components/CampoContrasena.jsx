import { useRef, useState } from 'react';
import styles from './CampoContrasena.module.css';

/**
 * Input de contraseña con botón para mostrar u ocultar el texto.
 *
 * Acepta las mismas props que un `<input>` normal, así que se puede usar con
 * los estilos de cada formulario (panel de administración o cuenta pública)
 * sin duplicar la lógica del ojo en cada pantalla.
 */
export default function CampoContrasena({ className = '', disabled = false, ...props }) {
  const [visible, setVisible] = useState(false);
  const entradaRef = useRef(null);

  const alternar = () => {
    setVisible((valor) => !valor);
    // Al hacer clic el foco se va al botón; lo devolvemos al campo para que
    // se pueda seguir escribiendo sin tener que volver a hacer clic.
    requestAnimationFrame(() => entradaRef.current?.focus());
  };

  const etiqueta = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';

  return (
    <span className={styles.contenedor}>
      <input
        {...props}
        ref={entradaRef}
        className={`${className} ${styles.entrada}`.trim()}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
      />
      <button
        type="button"
        className={styles.boton}
        onClick={alternar}
        disabled={disabled}
        aria-label={etiqueta}
        aria-pressed={visible}
        aria-controls={props.id}
        title={etiqueta}
      >
        <IconoOjo visible={visible} />
      </button>
    </span>
  );
}

function IconoOjo({ visible }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {visible ? (
        <>
          <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-2.7 3.6" />
          <path d="M6.2 6.6C3.6 8.3 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.1-.8" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          <path d="m3 3 18 18" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}
