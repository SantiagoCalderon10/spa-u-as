import { useId, useState } from 'react';
import { mensajeDeError } from '../../utils/catalogo';
import {
  claveFechaDeCita,
  nombreClienteDeCita,
  nombreProfesionalDeCita,
  nombreServicioDeCita,
  resumenHorarioCita,
  telefonoClienteDeCita,
} from '../../utils/citas';
import {
  enlaceWhatsApp,
  formatearFechaCita,
  mensajeCitaCancelada,
} from '../../utils/reserva';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import styles from './Formulario.module.css';

const MAX_MOTIVO = 240;

export default function CancelarCitaFormulario({ cita, onGuardar, onCerrar }) {
  const idMotivo = useId();
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cancelada, setCancelada] = useState(false);
  const [enlace, setEnlace] = useState('');
  const [telefono, setTelefono] = useState('');

  const guardar = async (evento) => {
    evento.preventDefault();

    const texto = motivo.trim();
    if (texto.length < 3) {
      setError('Escribe el motivo de la cancelación (mínimo 3 caracteres).');
      return;
    }

    setError('');
    setErrorGeneral('');
    setGuardando(true);

    try {
      await onGuardar(texto);

      const numero = telefonoClienteDeCita(cita);
      const mensaje = mensajeCitaCancelada({
        nombre: nombreClienteDeCita(cita),
        servicio: nombreServicioDeCita(cita),
        profesional: nombreProfesionalDeCita(cita),
        fecha: claveFechaDeCita(cita),
        hora: cita.horaInicio,
        motivo: texto,
      });

      setTelefono(numero);
      setEnlace(enlaceWhatsApp(numero, mensaje));
      setCancelada(true);
    } catch (err) {
      setErrorGeneral(mensajeDeError(err, 'No pudimos cancelar la cita.'));
    } finally {
      setGuardando(false);
    }
  };

  if (cancelada) {
    return (
      <Dialogo
        titulo="Cita cancelada"
        descripcion="La clienta verá la cita como cancelada desde su enlace."
        onCerrar={onCerrar}
        ancho="sm"
      >
        <div className={styles.formulario}>
          <div className={styles.cuenta}>
            <p className={styles.cuentaNombre}>{nombreClienteDeCita(cita)}</p>
            <p className={styles.cuentaDetalle}>
              {nombreServicioDeCita(cita)} · {formatearFechaCita(cita.fecha)} ·{' '}
              {resumenHorarioCita(cita)}
            </p>
            <p className={styles.cuentaNota}>Motivo: {motivo.trim()}</p>
          </div>

          <p className={styles.cuentaNota}>
            Para que no dependa de abrir su enlace, avísale por WhatsApp con el mensaje ya
            redactado.
          </p>

          {!telefono && (
            <p className={styles.errorGeneral} role="status">
              La clienta no tiene un teléfono registrado. Compártele el motivo por otro medio.
            </p>
          )}

          <div className={styles.acciones}>
            <Boton onClick={onCerrar}>Cerrar</Boton>
            {telefono && (
              <Boton
                variante="primario"
                onClick={() => window.open(enlace, '_blank', 'noopener')}
              >
                Avisar por WhatsApp
              </Boton>
            )}
          </div>
        </div>
      </Dialogo>
    );
  }

  return (
    <Dialogo
      titulo="Cancelar cita"
      descripcion="La clienta verá la cita cancelada desde su enlace."
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="sm"
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

        <Campo
          etiqueta="Motivo de la cancelación"
          htmlFor={idMotivo}
          error={error}
          extra={`${motivo.length}/${MAX_MOTIVO}`}
        >
          <textarea
            id={idMotivo}
            className={styles.control}
            value={motivo}
            maxLength={MAX_MOTIVO}
            onChange={(evento) => setMotivo(evento.target.value)}
            placeholder="Ej.: la clienta no puede asistir"
            data-autofoco
            required
          />
        </Campo>

        {errorGeneral && (
          <p className={styles.errorGeneral} role="alert">
            {errorGeneral}
          </p>
        )}

        <div className={styles.acciones}>
          <Boton onClick={onCerrar} disabled={guardando}>
            Volver
          </Boton>
          <Boton tipo="submit" variante="peligro" cargando={guardando}>
            Cancelar cita
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
