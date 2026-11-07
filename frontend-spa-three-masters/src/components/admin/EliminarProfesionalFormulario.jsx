import { useId, useMemo, useState } from 'react';
import { mensajeDeError } from '../../utils/catalogo';
import {
  enlaceWhatsApp,
  formatearFechaLarga,
  formatearHora,
  mensajeCitaCancelada,
} from '../../utils/reserva';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import formStyles from './Formulario.module.css';
import styles from '../../pages/admin/ProfesionalesAdmin.module.css';

const MAX_MOTIVO = 240;
const MOTIVO_POR_DEFECTO = 'Profesional retirada del equipo';

function nombreProfesional(resumen) {
  return resumen?.profesional?.idUsuario?.nombrecompleto || 'la profesional';
}

export default function EliminarProfesionalFormulario({ resumen, onConfirmar, onCerrar }) {
  const idMotivo = useId();
  const citas = resumen?.citasFuturas ?? [];
  const horarios = resumen?.horarios ?? 0;

  const [cancelarCitas, setCancelarCitas] = useState(citas.length > 0);
  const [motivo, setMotivo] = useState(MOTIVO_POR_DEFECTO);
  const [eliminarCuenta, setEliminarCuenta] = useState(false);
  const [error, setError] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const citasCanceladas = resultado?.citasCanceladas ?? [];
  const motivoAplicado = resultado?.motivo || motivo.trim();

  const notificaciones = useMemo(
    () =>
      citasCanceladas.map((cita) => ({
        ...cita,
        enlace: cita.cliente?.telefono
          ? enlaceWhatsApp(
              cita.cliente.telefono,
              mensajeCitaCancelada({
                nombre: cita.cliente.nombre,
                servicio: cita.servicio,
                profesional: nombreProfesional(resumen),
                fecha: cita.fecha,
                hora: cita.horaInicio,
                motivo: motivoAplicado,
              })
            )
          : '',
      })),
    [citasCanceladas, motivoAplicado, resumen]
  );

  const confirmar = async (evento) => {
    evento.preventDefault();
    setError('');
    setErrorGeneral('');

    if (citas.length > 0 && !cancelarCitas) {
      setError(
        'Para eliminar el perfil primero hay que cancelar las citas futuras o reasignarlas desde la agenda.'
      );
      return;
    }

    if (citas.length > 0 && cancelarCitas && motivo.trim().length < 3) {
      setError('Escribe el motivo de la cancelación (mínimo 3 caracteres).');
      return;
    }

    setGuardando(true);
    try {
      const datos = await onConfirmar({
        cancelarCitas: citas.length > 0 && cancelarCitas,
        motivo: citas.length > 0 && cancelarCitas ? motivo.trim() : '',
        eliminarHorarios: horarios > 0,
        eliminarCuenta,
      });
      setResultado(datos);
    } catch (err) {
      setErrorGeneral(mensajeDeError(err, 'No pudimos dar de baja a la profesional.'));
    } finally {
      setGuardando(false);
    }
  };

  if (resultado) {
    return (
      <Dialogo
        titulo="Baja completada"
        descripcion="El perfil profesional ya no aparece en el catálogo ni en la agenda."
        onCerrar={onCerrar}
        ancho="md"
      >
        <div className={formStyles.formulario}>
          <div className={formStyles.cuenta}>
            <p className={formStyles.cuentaNombre}>{nombreProfesional(resumen)}</p>
            <p className={formStyles.cuentaDetalle}>
              {resultado.citasCanceladas.length === 0
                ? 'No había citas futuras pendientes.'
                : `${
                    resultado.citasCanceladas.length
                  } ${resultado.citasCanceladas.length === 1 ? 'cita cancelada' : 'citas canceladas'} con su motivo.`}
              {resultado.horariosEliminados > 0
                ? ` ${resultado.horariosEliminados} ${
                    resultado.horariosEliminados === 1 ? 'franja eliminada' : 'franjas eliminadas'
                  }.`
                : ''}
              {resultado.cuentaEliminada
                ? ' La cuenta de acceso también se eliminó.'
                : ' La cuenta de acceso se conserva.'}
            </p>
          </div>

          {notificaciones.length > 0 && (
            <div className={styles.bajaNotificar}>
              <h3 className={styles.bajaNotificarTitulo}>Avisa a las clientas por WhatsApp</h3>
              <p className={styles.bajaNotificarTexto}>
                Abre cada enlace y pulsa enviar. El mensaje ya incluye fecha, servicio y motivo,
                así la clienta no depende de revisar su enlace único.
              </p>

              <ul className={styles.bajaListaNotificar}>
                {notificaciones.map((cita) => (
                  <li className={styles.bajaNotificarItem} key={cita._id}>
                    <span className={styles.bajaNotificarDatos}>
                      <strong>{cita.cliente?.nombre || 'Clienta'}</strong>
                      <span>
                        {formatearFechaLarga(cita.fecha)} · {formatearHora(cita.horaInicio)}
                      </span>
                    </span>

                    {cita.enlace ? (
                      <Boton
                        tamano="sm"
                        variante="primario"
                        onClick={() => window.open(cita.enlace, '_blank', 'noopener')}
                      >
                        WhatsApp
                      </Boton>
                    ) : (
                      <span className={styles.bajaSinTelefono}>Sin teléfono registrado</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={formStyles.acciones}>
            <Boton onClick={onCerrar}>Cerrar</Boton>
          </div>
        </div>
      </Dialogo>
    );
  }

  return (
    <Dialogo
      titulo="Dar de baja a la profesional"
      descripcion="Revisa lo que quedará afectado antes de confirmar."
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="md"
    >
      <form className={formStyles.formulario} onSubmit={confirmar}>
        <div className={formStyles.cuenta}>
          <p className={formStyles.cuentaNombre}>{nombreProfesional(resumen)}</p>
          <p className={formStyles.cuentaDetalle}>
            {citas.length === 0
              ? 'Sin citas confirmadas futuras.'
              : `${citas.length} ${
                  citas.length === 1 ? 'cita confirmada futura' : 'citas confirmadas futuras'
                }.`}{' '}
            {horarios === 0
              ? 'Sin horarios asignados.'
              : `${horarios} ${horarios === 1 ? 'franja de horario' : 'franjas de horario'}.`}
          </p>
        </div>

        {citas.length > 0 && (
          <div className={styles.bajaBloque}>
            <h3 className={styles.bajaTitulo}>Citas que hay que resolver</h3>
            <ul className={styles.bajaLista}>
              {citas.map((cita) => (
                <li className={styles.bajaCita} key={cita._id}>
                  <span className={styles.bajaCitaFecha}>
                    {formatearFechaLarga(cita.fecha)} · {formatearHora(cita.horaInicio)} –{' '}
                    {formatearHora(cita.horaFin)}
                  </span>
                  <span className={styles.bajaCitaDetalle}>
                    {cita.cliente?.nombre || 'Clienta'} · {cita.servicio || 'Servicio'}
                  </span>
                </li>
              ))}
            </ul>

            <label className={styles.opcion}>
              <input
                type="checkbox"
                checked={cancelarCitas}
                onChange={(evento) => setCancelarCitas(evento.target.checked)}
                disabled={guardando}
              />
              <span>
                Cancelar estas citas y conservarlas en el historial con el motivo que escriba.
              </span>
            </label>

            {cancelarCitas && (
              <Campo
                etiqueta="Motivo de la cancelación"
                htmlFor={idMotivo}
                error={error}
                extra={`${motivo.length}/${MAX_MOTIVO}`}
                ayuda="Este texto se mostrará a la clienta y se guardará en cada cita."
              >
                <textarea
                  id={idMotivo}
                  className={formStyles.control}
                  value={motivo}
                  maxLength={MAX_MOTIVO}
                  onChange={(evento) => setMotivo(evento.target.value)}
                  disabled={guardando}
                  required
                />
              </Campo>
            )}
          </div>
        )}

        {horarios > 0 && (
          <p className={styles.bajaNota}>
            Se eliminarán también las {horarios}{' '}
            {horarios === 1 ? 'franja de horario' : 'franjas de horario'} de esta profesional.
          </p>
        )}

        <div className={styles.bajaBloque}>
          <h3 className={styles.bajaTitulo}>Cuenta de acceso</h3>
          <div className={formStyles.segmentado} role="group" aria-label="Cuenta de acceso">
            <button
              type="button"
              className={`${formStyles.segmento} ${
                eliminarCuenta ? '' : formStyles.segmentoActivo
              }`}
              onClick={() => setEliminarCuenta(false)}
              aria-pressed={!eliminarCuenta}
              disabled={guardando}
            >
              Conservar cuenta
            </button>
            <button
              type="button"
              className={`${formStyles.segmento} ${
                eliminarCuenta ? formStyles.segmentoActivo : ''
              }`}
              onClick={() => setEliminarCuenta(true)}
              aria-pressed={eliminarCuenta}
              disabled={guardando}
            >
              Eliminar cuenta
            </button>
          </div>
          <p className={styles.bajaNota}>
            {eliminarCuenta
              ? 'La cuenta se borrará y no podrá volver a iniciar sesión. Esta acción no se puede deshacer.'
              : 'La cuenta seguirá existiendo y podrá vincularse a un nuevo perfil profesional.'}
          </p>
        </div>

        {error && citas.length > 0 && !cancelarCitas && (
          <p className={formStyles.errorGeneral} role="alert">
            {error}
          </p>
        )}

        {errorGeneral && (
          <p className={formStyles.errorGeneral} role="alert">
            {errorGeneral}
          </p>
        )}

        <div className={formStyles.acciones}>
          <Boton onClick={onCerrar} disabled={guardando}>
            Volver
          </Boton>
          <Boton
            tipo="submit"
            variante="peligro"
            cargando={guardando}
            disabled={citas.length > 0 && !cancelarCitas}
          >
            Eliminar profesional
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
