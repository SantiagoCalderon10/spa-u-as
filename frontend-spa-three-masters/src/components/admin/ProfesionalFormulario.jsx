import { useState } from 'react';
import Boton from './Boton';
import Campo from './Campo';
import CampoImagen from './CampoImagen';
import Dialogo from './Dialogo';
import { datosFormularioProfesional, validarProfesional } from '../../utils/agenda';
import { mensajeDeError } from '../../utils/catalogo';
import styles from './Formulario.module.css';

export default function ProfesionalFormulario({
  profesional,
  categorias,
  cargandoCategorias = false,
  cuentasDisponibles,
  cargandoCuentas,
  onGuardar,
  onCerrar,
}) {
  const editando = Boolean(profesional?._id);
  const [datos, setDatos] = useState(() => datosFormularioProfesional(profesional));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (evento) => {
    const valor =
      evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;

    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  };

  const cambiarModo = (modo) => {
    setDatos((previos) => ({ ...previos, modo, idUsuario: '' }));
    setErrores({});
  };

  const alternarEspecialidad = (idCategoria) => {
    setDatos((previos) => {
      const yaEsta = previos.especialidades.includes(idCategoria);
      return {
        ...previos,
        especialidades: yaEsta
          ? previos.especialidades.filter((id) => id !== idCategoria)
          : [...previos.especialidades, idCategoria],
      };
    });
    setErrores((previos) => {
      if (!previos.especialidades) return previos;
      const copia = { ...previos };
      delete copia.especialidades;
      return copia;
    });
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarProfesional(datos);

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
        mensajeDeError(error, 'No pudimos guardar el perfil. Intenta de nuevo.')
      );
      setGuardando(false);
    }
  };

  return (
    <Dialogo
      titulo={editando ? 'Editar profesional' : 'Nueva profesional'}
      descripcion={
        editando
          ? 'Ajusta sus especialidades y datos del perfil. La cuenta de acceso se gestiona aparte.'
          : 'Crea la cuenta de acceso y el perfil con el que aparecerá en la agenda.'
      }
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="md"
    >
      <form className={styles.formulario} onSubmit={enviar} noValidate>
        <fieldset className={styles.grupo} disabled={guardando}>
          {editando ? (
            <div className={styles.cuenta}>
              <p className={styles.cuentaNombre}>{datos.nombrecompleto || 'Sin nombre'}</p>
              <p className={styles.cuentaDetalle}>
                {datos.correo || 'Sin correo'} · {datos.telefono || 'Sin teléfono'}
              </p>
              <p className={styles.cuentaNota}>
                Estos datos pertenecen a la cuenta de usuario y no se editan aquí.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.segmentado} role="group" aria-label="Origen de la cuenta">
                <button
                  type="button"
                  className={`${styles.segmento} ${
                    datos.modo === 'nuevo' ? styles.segmentoActivo : ''
                  }`}
                  onClick={() => cambiarModo('nuevo')}
                  aria-pressed={datos.modo === 'nuevo'}
                >
                  Crear cuenta nueva
                </button>
                <button
                  type="button"
                  className={`${styles.segmento} ${
                    datos.modo === 'existente' ? styles.segmentoActivo : ''
                  }`}
                  onClick={() => cambiarModo('existente')}
                  aria-pressed={datos.modo === 'existente'}
                >
                  Vincular cuenta existente
                </button>
              </div>

              {datos.modo === 'nuevo' ? (
                <>
                  <Campo
                    etiqueta="Nombre completo"
                    htmlFor="profesional-nombre"
                    error={errores.nombrecompleto}
                  >
                    <input
                      id="profesional-nombre"
                      className={styles.control}
                      type="text"
                      value={datos.nombrecompleto}
                      onChange={cambiar('nombrecompleto')}
                      aria-invalid={Boolean(errores.nombrecompleto)}
                      aria-describedby={
                        errores.nombrecompleto ? 'profesional-nombre-error' : undefined
                      }
                      data-autofoco
                    />
                  </Campo>

                  <div className={styles.filaDos}>
                    <Campo
                      etiqueta="Correo"
                      htmlFor="profesional-correo"
                      error={errores.correo}
                      ayuda="Con este correo iniciará sesión."
                    >
                      <input
                        id="profesional-correo"
                        className={styles.control}
                        type="email"
                        value={datos.correo}
                        onChange={cambiar('correo')}
                        aria-invalid={Boolean(errores.correo)}
                        aria-describedby={
                          errores.correo ? 'profesional-correo-error' : 'profesional-correo-ayuda'
                        }
                      />
                    </Campo>

                    <Campo
                      etiqueta="Teléfono"
                      htmlFor="profesional-telefono"
                      error={errores.telefono}
                    >
                      <input
                        id="profesional-telefono"
                        className={styles.control}
                        type="tel"
                        inputMode="tel"
                        value={datos.telefono}
                        onChange={cambiar('telefono')}
                        aria-invalid={Boolean(errores.telefono)}
                        aria-describedby={
                          errores.telefono ? 'profesional-telefono-error' : undefined
                        }
                      />
                    </Campo>
                  </div>

                  <Campo
                    etiqueta="Contraseña temporal"
                    htmlFor="profesional-contrasena"
                    error={errores.contrasena}
                    ayuda="Mínimo 6 caracteres. La profesional deberá cambiarla al entrar."
                  >
                    <input
                      id="profesional-contrasena"
                      className={styles.control}
                      type="password"
                      autoComplete="new-password"
                      value={datos.contrasena}
                      onChange={cambiar('contrasena')}
                      aria-invalid={Boolean(errores.contrasena)}
                      aria-describedby={
                        errores.contrasena
                          ? 'profesional-contrasena-error'
                          : 'profesional-contrasena-ayuda'
                      }
                    />
                  </Campo>
                </>
              ) : (
                <Campo
                  etiqueta="Cuenta del personal"
                  htmlFor="profesional-cuenta"
                  error={errores.idUsuario}
                  ayuda="Solo aparecen cuentas de profesional o administrador sin perfil."
                >
                  <select
                    id="profesional-cuenta"
                    className={styles.control}
                    value={datos.idUsuario}
                    onChange={cambiar('idUsuario')}
                    disabled={cargandoCuentas}
                    aria-invalid={Boolean(errores.idUsuario)}
                    aria-describedby={
                      errores.idUsuario
                        ? 'profesional-cuenta-error'
                        : 'profesional-cuenta-ayuda'
                    }
                    data-autofoco
                  >
                    <option value="">
                      {cargandoCuentas ? 'Cargando cuentas…' : 'Elige una cuenta'}
                    </option>
                    {cuentasDisponibles.map((cuenta) => (
                      <option key={cuenta._id} value={cuenta._id}>
                        {cuenta.nombrecompleto} — {cuenta.correo}
                      </option>
                    ))}
                  </select>
                </Campo>
              )}
            </>
          )}

          <fieldset className={styles.grupoEspecialidades}>
            <legend className={styles.leyenda}>Especialidades</legend>
            <p className={styles.leyendaAyuda}>
              Atenderá todos los servicios activos de las categorías que marques.
            </p>

            {cargandoCategorias ? (
              <p className={styles.avisoSinDatos}>Cargando categorías…</p>
            ) : categorias.length === 0 ? (
              <p className={styles.avisoSinDatos}>
                Todavía no hay categorías. Créalas antes de asignar especialidades.
              </p>
            ) : (
              <div className={styles.especialidades}>
                {categorias.map((categoria) => (
                  <label key={categoria._id} className={styles.especialidad}>
                    <input
                      type="checkbox"
                      className={styles.especialidadControl}
                      checked={datos.especialidades.includes(categoria._id)}
                      onChange={() => alternarEspecialidad(categoria._id)}
                    />
                    <span className={styles.especialidadTexto}>
                      {categoria.nombre}
                      {categoria.estado === false && (
                        <span className={styles.especialidadNota}> (inactiva)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {errores.especialidades && (
              <p className={styles.errorGrupo} role="alert">
                {errores.especialidades}
              </p>
            )}
          </fieldset>

          <Campo
            etiqueta="Años de experiencia"
            htmlFor="profesional-experiencia"
            opcional
            error={errores.anioExperiencia}
          >
            <input
              id="profesional-experiencia"
              className={styles.control}
              type="number"
              min="0"
              max="70"
              step="1"
              inputMode="numeric"
              value={datos.anioExperiencia}
              onChange={cambiar('anioExperiencia')}
              aria-invalid={Boolean(errores.anioExperiencia)}
              aria-describedby={
                errores.anioExperiencia ? 'profesional-experiencia-error' : undefined
              }
            />
          </Campo>

          <Campo
            etiqueta="Foto del perfil"
            htmlFor="profesional-foto"
            opcional
            ayuda="Se muestra en la sección del equipo."
          >
            <CampoImagen
              id="profesional-foto"
              valor={datos.urlFoto}
              carpeta="profesionales"
              descritoPor="profesional-foto-ayuda"
              onCambiar={(url) =>
                setDatos((previos) => ({ ...previos, urlFoto: url }))
              }
            />
          </Campo>
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
            {editando ? 'Guardar cambios' : 'Crear profesional'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
