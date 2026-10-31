import { useEffect, useId, useRef } from 'react';
import Boton from './Boton';
import styles from './Dialogo.module.css';

export default function Dialogo({
  titulo,
  descripcion,
  onCerrar,
  bloqueado = false,
  ancho = 'md',
  children,
}) {
  const referencia = useRef(null);
  const idTitulo = useId();
  const idDescripcion = useId();

  useEffect(() => {
    const dialogo = referencia.current;
    if (!dialogo) return undefined;

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!dialogo.open) dialogo.showModal();

    const autofoco = dialogo.querySelector('[data-autofoco]');
    if (autofoco) autofoco.focus();

    return () => {
      document.body.style.overflow = overflowPrevio;
      // close() devuelve el foco al elemento que abrió el diálogo.
      // No escuchamos el evento `close` nativo: el que dispara este cierre en el
      // desmontaje llega después del remontaje de StrictMode y volvería a cerrar
      // el diálogo recién abierto.
      if (dialogo.open) dialogo.close();
    };
  }, []);

  const cerrar = () => {
    if (!bloqueado) onCerrar?.();
  };

  return (
    <dialog
      ref={referencia}
      className={`${styles.dialogo} ${styles[ancho]}`}
      aria-labelledby={idTitulo}
      aria-describedby={descripcion ? idDescripcion : undefined}
      onCancel={(evento) => {
        if (bloqueado) {
          evento.preventDefault();
          return;
        }
        cerrar();
      }}
      onClick={(evento) => {
        if (evento.target === referencia.current) cerrar();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.cabecera}>
          <div className={styles.tituloBloque}>
            <h2 className={styles.titulo} id={idTitulo}>
              {titulo}
            </h2>
            {descripcion && (
              <p className={styles.descripcion} id={idDescripcion}>
                {descripcion}
              </p>
            )}
          </div>

          <Boton
            variante="fantasma"
            tamano="sm"
            className={styles.cerrar}
            onClick={cerrar}
            disabled={bloqueado}
            aria-label="Cerrar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Boton>
        </header>

        <div className={styles.cuerpo}>{children}</div>
      </div>
    </dialog>
  );
}
