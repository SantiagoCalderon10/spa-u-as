import styles from './Campo.module.css';

export default function Campo({
  etiqueta,
  htmlFor,
  error,
  ayuda,
  opcional = false,
  extra,
  children,
}) {
  const idMensaje = error ? `${htmlFor}-error` : `${htmlFor}-ayuda`;

  return (
    <div className={styles.campo}>
      <div className={styles.filaEtiqueta}>
        <label className={styles.etiqueta} htmlFor={htmlFor}>
          {etiqueta}
        </label>
        <span className={styles.marcas}>
          {opcional && <span className={styles.opcional}>Opcional</span>}
          {extra && <span className={styles.extra}>{extra}</span>}
        </span>
      </div>
      {children}
      {error ? (
        <p className={styles.error} id={idMensaje} role="alert">
          {error}
        </p>
      ) : ayuda ? (
        <p className={styles.ayuda} id={idMensaje}>
          {ayuda}
        </p>
      ) : null}
    </div>
  );
}
