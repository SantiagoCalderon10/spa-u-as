import styles from './Boton.module.css';

export default function Boton({
  variante = 'secundario',
  tamano = 'md',
  tipo = 'button',
  cargando = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const clases = [styles.boton, styles[variante], styles[tamano], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={tipo}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...props}
    >
      {cargando && <span className={styles.girador} aria-hidden="true" />}
      {children}
    </button>
  );
}
