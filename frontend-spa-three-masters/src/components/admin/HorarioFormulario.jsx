import { useState } from 'react';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import {
  DIAS_SEMANA,
  datosFormularioHorario,
  formatearDuracionFranja,
  nombreDeProfesional,
  validarHorario,
} from '../../utils/agenda';
import { mensajeDeError } from '../../utils/catalogo';
import styles from './Formulario.module.css';

export default function HorarioFormulario({
  horario,
  profesionales,
  horarios,
  onGuardar,
  onCerrar,
}) {
  const editando = Boolean(horario?._id);
  const [datos, setDatos] = useState(() => {
    const iniciales = datosFormularioHorario(horario);
    if (!horario && !iniciales.idProfesional && profesionales.length === 1) {
      iniciales.idProfesional = profesionales[0]._id;
    }
    return iniciales;
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (evento) => {
    setDatos((previos) => ({ ...previos, [campo]: evento.target.value }));
    setErrores((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarHorario(datos, horarios, horario?._id);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    setErrorGeneral('');

    try {
      await onGuardar(datos);
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos guardar el horario. Intenta de nuevo.')
      );
      setGuardando(false);
    }
  };

  const duracion =
    datos.horaInicio && datos.horaFin
      ? formatearDuracionFranja(datos.horaInicio, datos.horaFin)
      : null;
  const duracionValida = Boolean(duracion) && duracion !== '—';

  return (
    <Dialogo
      titulo={editando ? 'Editar horario' : 'Nuevo horario'}
      descripcion="Define una franja semanal en la que la profesional atiende."
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="sm"
    >
      <form className={styles.formulario} onSubmit={enviar} noValidate>
        <fieldset className={styles.grupo} disabled={guardando}>
          <Campo
            etiqueta="Profesional"
            htmlFor="horario-profesional"
            error={errores.idProfesional}
          >
            <select
              id="horario-profesional"
              className={styles.control}
              value={datos.idProfesional}
              onChange={cambiar('idProfesional')}
              aria-invalid={Boolean(errores.idProfesional)}
              aria-describedby={
                errores.idProfesional ? 'horario-profesional-error' : undefined
              }
              data-autofoco
            >
              <option value="">Elige la profesional</option>
              {profesionales.map((profesional) => (
                <option key={profesional._id} value={profesional._id}>
                  {nombreDeProfesional(profesional)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Día" htmlFor="horario-dia" error={errores.diaSemana}>
            <select
              id="horario-dia"
              className={styles.control}
              value={datos.diaSemana}
              onChange={cambiar('diaSemana')}
              aria-invalid={Boolean(errores.diaSemana)}
              aria-describedby={errores.diaSemana ? 'horario-dia-error' : undefined}
            >
              {DIAS_SEMANA.map((dia) => (
                <option key={dia.valor} value={dia.valor}>
                  {dia.etiqueta}
                </option>
              ))}
            </select>
          </Campo>

          <div className={styles.filaDos}>
            <Campo
              etiqueta="Hora de inicio"
              htmlFor="horario-inicio"
              error={errores.horaInicio}
            >
              <input
                id="horario-inicio"
                className={styles.control}
                type="time"
                value={datos.horaInicio}
                onChange={cambiar('horaInicio')}
                aria-invalid={Boolean(errores.horaInicio)}
                aria-describedby={errores.horaInicio ? 'horario-inicio-error' : undefined}
              />
            </Campo>

            <Campo etiqueta="Hora de fin" htmlFor="horario-fin" error={errores.horaFin}>
              <input
                id="horario-fin"
                className={styles.control}
                type="time"
                value={datos.horaFin}
                onChange={cambiar('horaFin')}
                aria-invalid={Boolean(errores.horaFin)}
                aria-describedby={errores.horaFin ? 'horario-fin-error' : undefined}
              />
            </Campo>
          </div>

          {duracionValida && !errores.horaInicio && !errores.horaFin && (
            <p className={styles.notaFranja}>
              La franja dura <strong>{duracion}</strong>.
            </p>
          )}
        </fieldset>

        {errorGeneral && (
          <p className={styles.errorGeneral} role="alert">
            {errorGeneral}
          </p>
        )}

        <div className={styles.acciones}>
          <Boton onClick={onCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton tipo="submit" variante="primario" cargando={guardando}>
            {editando ? 'Guardar cambios' : 'Crear horario'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
