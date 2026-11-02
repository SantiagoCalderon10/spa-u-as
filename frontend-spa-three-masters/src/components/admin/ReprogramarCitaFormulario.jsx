import { useEffect, useId, useState } from 'react';
import { obtenerDisponibilidad } from '../../api/citaService';
import { mensajeDeError } from '../../utils/catalogo';
import {
  claveDeHoy,
  claveFechaDeCita,
  idProfesionalDeCita,
  idServicioDeCita,
  nombreClienteDeCita,
  nombreProfesionalDeCita,
  nombreServicioDeCita,
  resumenHorarioCita,
} from '../../utils/citas';
import { filtrarSlotsFuturos, formatearFechaCita, formatearHora } from '../../utils/reserva';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import styles from './Formulario.module.css';

export default function ReprogramarCitaFormulario({ cita, onGuardar, onCerrar }) {
  const idFecha = useId();
  const idHora = useId();

  const [fecha, setFecha] = useState(() => claveFechaDeCita(cita));
  const [horaInicio, setHoraInicio] = useState('');
  const [slots, setSlots] = useState([]);
  const [mensajeSlots, setMensajeSlots] = useState('');
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const idProfesional = idProfesionalDeCita(cita);
  const idServicio = idServicioDeCita(cita);

  useEffect(() => {
    if (!fecha || !idProfesional || !idServicio) {
      setSlots([]);
      return undefined;
    }

    const control = new AbortController();
    setCargandoSlots(true);
    setErrorSlots('');
    setMensajeSlots('');
    setHoraInicio('');

    obtenerDisponibilidad({ idProfesional, idServicio, fecha, signal: control.signal })
      .then((datos) => {
        if (control.signal.aborted) return;
        const disponibles = filtrarSlotsFuturos(datos?.slots, fecha);
        setSlots(Array.isArray(disponibles) ? disponibles : []);
        setMensajeSlots(datos?.mensaje || '');
      })
      .catch((err) => {
        if (control.signal.aborted) return;
        setSlots([]);
        setErrorSlots(mensajeDeError(err, 'No pudimos consultar la disponibilidad.'));
      })
      .finally(() => {
        if (!control.signal.aborted) setCargandoSlots(false);
      });

    return () => control.abort();
  }, [fecha, idProfesional, idServicio]);

  const guardar = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = {};
    if (!fecha) nuevosErrores.fecha = 'Elige la nueva fecha.';
    if (!horaInicio) nuevosErrores.hora = 'Elige un horario disponible.';

    setErrores(nuevosErrores);
    setErrorGeneral('');
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    try {
      await onGuardar({ nuevaFecha: fecha, nuevaHoraInicio: horaInicio });
    } catch (err) {
      setErrorGeneral(mensajeDeError(err, 'No pudimos reprogramar la cita.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialogo
      titulo="Reprogramar cita"
      descripcion="Elige una nueva fecha y uno de los horarios libres de la profesional."
      onCerrar={onCerrar}
      bloqueado={guardando}
    >
      <form className={styles.formulario} onSubmit={guardar}>
        <div className={styles.cuenta}>
          <p className={styles.cuentaNombre}>{nombreClienteDeCita(cita)}</p>
          <p className={styles.cuentaDetalle}>
            {nombreServicioDeCita(cita)} · {formatearFechaCita(cita.fecha)} ·{' '}
            {resumenHorarioCita(cita)}
          </p>
          <p className={styles.cuentaNota}>
            Profesional: {nombreProfesionalDeCita(cita)}
          </p>
        </div>

        <div className={styles.grupo}>
          <div className={styles.filaDos}>
            <Campo etiqueta="Nueva fecha" htmlFor={idFecha} error={errores.fecha}>
              <input
                id={idFecha}
                type="date"
                className={styles.control}
                value={fecha}
                min={claveDeHoy()}
                onChange={(evento) => setFecha(evento.target.value)}
                data-autofoco
                required
              />
            </Campo>

            <Campo
              etiqueta="Nuevo horario"
              htmlFor={idHora}
              error={errores.hora}
              ayuda="Solo se muestran horas libres de la agenda."
            >
              <select
                id={idHora}
                className={styles.control}
                value={horaInicio}
                onChange={(evento) => setHoraInicio(evento.target.value)}
                disabled={cargandoSlots || slots.length === 0}
                required
              >
                <option value="">
                  {cargandoSlots
                    ? 'Consultando disponibilidad…'
                    : slots.length === 0
                      ? 'Sin horarios disponibles'
                      : 'Elige una hora'}
                </option>
                {slots.map((slot) => (
                  <option key={slot.horaInicio} value={slot.horaInicio}>
                    {formatearHora(slot.horaInicio)}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          {errorSlots ? (
            <p className={styles.errorGeneral} role="alert">
              {errorSlots}
            </p>
          ) : (
            !cargandoSlots &&
            slots.length === 0 && (
              <p className={styles.cuentaNota} role="status">
                {mensajeSlots ||
                  'No hay horarios libres para esa fecha. Prueba con otro día.'}
              </p>
            )
          )}
        </div>

        {errorGeneral && (
          <p className={styles.errorGeneral} role="alert">
            {errorGeneral}
          </p>
        )}

        <div className={styles.acciones}>
          <Boton onClick={onCerrar} disabled={guardando}>
            Volver
          </Boton>
          <Boton tipo="submit" variante="primario" cargando={guardando}>
            Guardar cambios
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
