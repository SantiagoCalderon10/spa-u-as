import styles from './Interruptor.module.css';

export default function Interruptor({
  id,
  checked,
  onChange,
  titulo,
  descripcion,
  disabled = false,
}) {
  return (
    <label className={`${styles.interruptor} ${disabled ? styles.deshabilitado : ''}`}>
      <input
        id={id}
        type="checkbox"
        className={styles.control}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.pista} aria-hidden="true">
        <span className={styles.perilla} />
      </span>
      <span className={styles.texto}>
        <span className={styles.titulo}>{titulo}</span>
        {descripcion && <span className={styles.descripcion}>{descripcion}</span>}
      </span>
    </label>
  );
}
