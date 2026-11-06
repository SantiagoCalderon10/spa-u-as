import { useEffect, useState } from 'react';
import Boton from './Boton';
import Campo from './Campo';
import CampoImagen from './CampoImagen';
import Dialogo from './Dialogo';
import Interruptor from './Interruptor';
import {
  cuerpoServicio,
  datosFormularioServicio,
  mensajeDeError,
  validarServicio,
} from '../../utils/catalogo';
import styles from './Formulario.module.css';

const DURACIONES_FRECUENTES = [30, 45, 60, 90, 120];
const MAX_DESCRIPCION = 240;

const IDS_CAMPOS = {
  nombre: 'servicio-nombre',
  precio: 'servicio-precio',
  duracion: 'servicio-duracion',
};

export default function ServicioFormulario({
  servicio,
  categorias,
  onGuardar,
  onCerrar,
}) {
  const editando = Boolean(servicio?._id);
  const [datos, setDatos] = useState(() => datosFormularioServicio(servicio));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Lleva el foco al primer campo inválido después de validar.
  useEffect(() => {
    const primero = Object.keys(errores)[0];
    if (!primero) return;
    const id = IDS_CAMPOS[primero];
    if (!id) return;
    document.getElementById(id)?.focus();
  }, [errores]);

  const cambiar = (campo) => (evento) => {
    const valor =
      evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;

    if (errorGeneral) setErrorGeneral('');

    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  };

  const elegirDuracion = (minutos) => {
    setDatos((previos) => ({ ...previos, duracion: String(minutos) }));
    setErrores((previos) => {
      if (!previos.duracion) return previos;
      const copia = { ...previos };
      delete copia.duracion;
      return copia;
    });
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarServicio(datos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    setErrorGeneral('');

    try {
      await onGuardar(cuerpoServicio(datos));
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos guardar el servicio. Intenta de nuevo.')
      );
      setGuardando(false);
    }
  };

  return (
    <Dialogo
      titulo={editando ? 'Editar servicio' : 'Nuevo servicio'}
      descripcion={
        editando
          ? 'Actualiza los datos que las clientas ven en el catálogo del atelier.'
          : 'Registra un tratamiento con su precio, duración y categoría.'
      }
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="md"
    >
      <form className={styles.formulario} onSubmit={enviar} noValidate>
        <fieldset className={styles.grupo} disabled={guardando}>
          <Campo
            etiqueta="Nombre del servicio"
            htmlFor="servicio-nombre"
            error={errores.nombre}
          >
            <input
              id="servicio-nombre"
              className={styles.control}
              type="text"
              value={datos.nombre}
              onChange={cambiar('nombre')}
              placeholder="Ej. Manicure semipermanente"
              autoComplete="off"
              maxLength={90}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'servicio-nombre-error' : undefined}
              data-autofoco
            />
          </Campo>

          <Campo
            etiqueta="Descripción"
            htmlFor="servicio-descripcion"
            opcional
            extra={`${datos.descripcion.length}/${MAX_DESCRIPCION}`}
            ayuda="Una o dos frases sobre la técnica y el resultado."
          >
            <textarea
              id="servicio-descripcion"
              className={styles.control}
              rows="3"
              value={datos.descripcion}
              onChange={cambiar('descripcion')}
              placeholder="Ej. Esmaltado en gel con cabina de secado LED."
              maxLength={MAX_DESCRIPCION}
              aria-describedby="servicio-descripcion-ayuda"
            />
          </Campo>

          <div className={styles.filaDos}>
            <Campo
              etiqueta="Precio"
              htmlFor="servicio-precio"
              error={errores.precio}
              ayuda="En pesos colombianos (COP)."
            >
              <div className={styles.campoPrefijo}>
                <span className={styles.prefijo} aria-hidden="true">
                  $
                </span>
                <input
                  id="servicio-precio"
                  className={`${styles.control} ${styles.controlConPrefijo}`}
                  type="number"
                  min="0"
                  step="1000"
                  inputMode="numeric"
                  value={datos.precio}
                  onChange={cambiar('precio')}
                  placeholder="45.000"
                  aria-invalid={Boolean(errores.precio)}
                  aria-describedby={
                    errores.precio ? 'servicio-precio-error' : 'servicio-precio-ayuda'
                  }
                />
              </div>
            </Campo>

            <Campo etiqueta="Duración" htmlFor="servicio-duracion" error={errores.duracion}>
              <div className={styles.entradaDuracion}>
                <input
                  id="servicio-duracion"
                  className={`${styles.control} ${styles.controlConSufijo}`}
                  type="number"
                  min="1"
                  step="5"
                  inputMode="numeric"
                  value={datos.duracion}
                  onChange={cambiar('duracion')}
                  placeholder="60"
                  aria-invalid={Boolean(errores.duracion)}
                  aria-describedby={
                    errores.duracion ? 'servicio-duracion-error' : undefined
                  }
                />
                <span className={styles.sufijo} aria-hidden="true">
                  min
                </span>
              </div>

              <div className={styles.presets} role="group" aria-label="Duraciones frecuentes">
                {DURACIONES_FRECUENTES.map((minutos) => {
                  const activo = Number(datos.duracion) === minutos;

                  return (
                    <button
                      key={minutos}
                      type="button"
                      className={`${styles.preset} ${activo ? styles.presetActivo : ''}`}
                      onClick={() => elegirDuracion(minutos)}
                      aria-pressed={activo}
                    >
                      {minutos} min
                    </button>
                  );
                })}
              </div>
            </Campo>
          </div>

          <Campo
            etiqueta="Categoría"
            htmlFor="servicio-categoria"
            ayuda="Agrupa el servicio en el catálogo público."
          >
            <select
              id="servicio-categoria"
              className={styles.control}
              value={datos.idCategoria}
              onChange={cambiar('idCategoria')}
              aria-describedby="servicio-categoria-ayuda"
            >
              <option value="">Sin categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                  {categoria.estado === false ? ' (inactiva)' : ''}
                </option>
              ))}
            </select>
          </Campo>

          <Campo
            etiqueta="Foto del servicio"
            htmlFor="servicio-foto"
            opcional
            ayuda="Se muestra en el catálogo público. Si no hay foto, usamos un monograma."
          >
            <CampoImagen
              id="servicio-foto"
              valor={datos.urlFoto}
              carpeta="servicios"
              descritoPor="servicio-foto-ayuda"
              onCambiar={(url) =>
                setDatos((previos) => ({ ...previos, urlFoto: url }))
              }
            />
          </Campo>

          <Interruptor
            id="servicio-activo"
            checked={datos.activo}
            onChange={cambiar('activo')}
            titulo="Visible en el catálogo"
            descripcion={
              datos.activo
                ? 'El servicio aparece en el catálogo público del atelier.'
                : 'El servicio queda guardado, pero no se muestra al público.'
            }
          />
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
            {editando ? 'Guardar cambios' : 'Crear servicio'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
