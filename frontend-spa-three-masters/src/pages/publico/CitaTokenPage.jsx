import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cancelarCitaPorToken, obtenerCitaPorToken } from '../../api/citaService';
import { nombreDeProfesional } from '../../utils/agenda';
import { formatearPrecio, mensajeDeError } from '../../utils/catalogo';
import { etiquetaEstado, formatearFechaCita, formatearHora } from '../../utils/reserva';
import styles from './Reserva.module.css';

const CLASES_ESTADO = {
  confirmada: styles.badgeConfirmada,
  cancelada: styles.badgeCancelada,
  completada: styles.badgeCompletada,
  noAsistio: styles.badgeNoAsistio,
  neutro: styles.badgeNeutro,
};

const QUIEN_CANCELA = {
  cliente: 'desde este enlace',
  administrador: 'por el salón',
  profesional: 'por la profesional',
};

export default function CitaTokenPage() {
  const { token } = useParams();

  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarCancelacion, setMostrarCancelacion] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const [errorCancelacion, setErrorCancelacion] = useState('');

  const cargar = useCallback(
    async (signal) => {
      setCargando(true);
      setError('');

      try {
        const datos = await obtenerCitaPorToken(token);
        if (signal?.aborted) return;
        setCita(datos);
      } catch (err) {
        if (signal?.aborted) return;
        setError(mensajeDeError(err, 'No pudimos encontrar esta cita.'));
      } finally {
        if (!signal?.aborted) setCargando(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  async function cancelar(evento) {
    evento.preventDefault();
    setCancelando(true);
    setErrorCancelacion('');

    try {
      const respuesta = await cancelarCitaPorToken(token, motivo.trim());
      setCita(respuesta.cita);
      setMostrarCancelacion(false);
      setMotivo('');
    } catch (err) {
      setErrorCancelacion(mensajeDeError(err, 'No pudimos cancelar la cita. Intenta de nuevo.'));
    } finally {
      setCancelando(false);
    }
  }

  const estado = etiquetaEstado(cita?.estado);
  const puedeCancelar = cita?.estado === 'confirmada';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Enlace personal</p>
          <h1 className={styles.title}>Tu cita en Three Masters.</h1>
          <p className={styles.subtitle}>
            Este enlace es único para tu cita. Guárdalo: con él puedes revisarla o cancelarla sin crear una cuenta.
          </p>
        </header>

        {cargando ? (
          <section className={styles.panel}>
            <p className={styles.loading} role="status">Consultando tu cita…</p>
          </section>
        ) : error ? (
          <section className={styles.panel}>
            <div className={`${styles.notice} ${styles.noticeError}`} role="alert">{error}</div>
            <div className={styles.actions}>
              <Link className={styles.secondary} to="/reservar">Agendar una cita</Link>
            </div>
          </section>
        ) : cita ? (
          <section className={styles.panel}>
            <div className={styles.citaHead}>
              <div>
                <p className={styles.eyebrow}>Cita agendada</p>
                <h2 className={styles.citaTitle}>{cita.servicio?.name ?? 'Servicio'}</h2>
              </div>
              <span className={`${styles.badge} ${CLASES_ESTADO[estado.tono] ?? styles.badgeNeutro}`}>
                {estado.etiqueta}
              </span>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Fecha</span>
                <span className={styles.summaryValue}>{formatearFechaCita(cita.fecha)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Hora</span>
                <span className={styles.summaryValue}>
                  {formatearHora(cita.horaInicio)} – {formatearHora(cita.horaFin)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Profesional</span>
                <span className={styles.summaryValue}>{nombreDeProfesional(cita.idProfesional)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>A nombre de</span>
                <span className={styles.summaryValue}>{cita.idCliente?.nombre ?? '—'}</span>
              </div>
              {cita.idCliente?.telefono && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Teléfono</span>
                  <span className={styles.summaryValue}>{cita.idCliente.telefono}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Valor</span>
                <span className={styles.summaryValue}>{formatearPrecio(cita.servicio?.price)}</span>
              </div>
            </div>

            {cita.estado === 'cancelada' && (
              <div className={styles.notice}>
                <p>Esta cita fue cancelada {QUIEN_CANCELA[cita.canceladaPor] ?? 'por el salón'}.</p>
                {cita.motivoCancelacion && <p>Motivo: {cita.motivoCancelacion}</p>}
              </div>
            )}

            {puedeCancelar && !mostrarCancelacion && (
              <div className={styles.actionsBetween}>
                <p className={styles.small}>¿No puedes asistir? Libera el horario para otra clienta.</p>
                <button
                  type="button"
                  className={`${styles.secondary} ${styles.danger}`}
                  onClick={() => setMostrarCancelacion(true)}
                >
                  Cancelar mi cita
                </button>
              </div>
            )}

            {puedeCancelar && mostrarCancelacion && (
              <form className={styles.field} onSubmit={cancelar}>
                <label className={styles.label} htmlFor="motivo-cancelacion">Motivo de la cancelación (opcional)</label>
                <textarea
                  id="motivo-cancelacion"
                  className={styles.textarea}
                  value={motivo}
                  maxLength={240}
                  onChange={(evento) => setMotivo(evento.target.value)}
                  placeholder="Cuéntanos si necesitas reprogramar o si surgió algo."
                />

                {errorCancelacion && (
                  <span className={styles.error} role="alert">{errorCancelacion}</span>
                )}

                <p className={styles.small}>
                  Al cancelar, el horario queda libre para otra clienta. Esta acción no se puede deshacer.
                </p>

                <div className={styles.actionsBetween}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => {
                      setMostrarCancelacion(false);
                      setErrorCancelacion('');
                    }}
                  >
                    Conservar mi cita
                  </button>
                  <button type="submit" className={`${styles.primary} ${styles.danger}`} disabled={cancelando}>
                    {cancelando ? 'Cancelando…' : 'Sí, cancelar mi cita'}
                  </button>
                </div>
              </form>
            )}

            <hr className={styles.divider} />

            <div className={styles.citaActions}>
              <p className={styles.small}>
                Si necesitas otra fecha, agenda una nueva cita y conserva este enlace como historial.
              </p>
              <Link className={styles.textLink} to="/reservar">Agendar otra cita</Link>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
