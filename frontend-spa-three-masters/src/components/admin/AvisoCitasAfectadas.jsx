import { Link } from 'react-router-dom';
import { formatearFranja } from '../../utils/agenda';
import styles from './AvisoCitasAfectadas.module.css';

function formatearFecha(fecha) {
  if (!fecha) return '';
  const valor = new Date(`${String(fecha).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(valor.getTime())) return String(fecha);
  return valor.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function AvisoCitasAfectadas({
  citas = [],
  cargando = false,
  error = '',
  titulo,
}) {
  if (cargando) {
    return (
      <p className={styles.consultando} role="status">
        Consultando las citas de esta franja…
      </p>
    );
  }

  if (error) {
    return (
      <p className={styles.error} role="alert">
        {error} Puedes revisar las citas directamente en el panel.
      </p>
    );
  }

  if (citas.length === 0) {
    return (
      <p className={styles.sinCitas}>
        No hay citas confirmadas que se vean afectadas.
      </p>
    );
  }

  const cantidad = citas.length;
  const etiqueta = cantidad === 1 ? 'cita confirmada' : 'citas confirmadas';

  return (
    <div className={styles.aviso} role="alert">
      <div className={styles.cabecera}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 9v4m0 4h.01" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
        <strong>
          {titulo ?? `Hay ${cantidad} ${etiqueta} que ${cantidad === 1 ? 'queda' : 'quedan'} fuera de esta franja`}
        </strong>
      </div>

      <ul className={styles.lista}>
        {citas.map((cita, indice) => (
          <li
            className={styles.cita}
            key={cita.id || `${cita.fecha}-${cita.horaInicio}-${indice}`}
          >
            <span className={styles.cliente}>{cita.cliente || 'Clienta sin nombre'}</span>
            <span className={styles.detalle}>
              {cita.servicio ? `${cita.servicio} · ` : ''}
              {formatearFecha(cita.fecha)} · {formatearFranja(cita.horaInicio, cita.horaFin)}
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.instruccion}>
        No se cancelan ni se reprograman automáticamente. Reprográmalas desde{' '}
        <Link className={styles.enlace} to="/admin/citas">
          Citas
        </Link>
        .
      </p>
    </div>
  );
}
