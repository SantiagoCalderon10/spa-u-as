import { useState } from 'react';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import Interruptor from './Interruptor';
import {
  cuerpoServicio,
  datosFormularioServicio,
  mensajeDeError,
  validarServicio,
} from '../../utils/catalogo';
import styles from './Formulario.module.css';

export default function ServicioFormulario({ servicio, categorias, onGuardar, onCerrar }) {
  const editando = Boolean(servicio?._id);
  const [datos, setDatos] = useState(() => datosFormularioServicio(servicio));
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
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'servicio-nombre-error' : undefined}
              data-autofoco
            />
          </Campo>

          <Campo
            etiqueta="Descripción"
            htmlFor="servicio-descripcion"
            opcional
            ayuda="Una o dos frases sobre la técnica y el resultado."
          >
            <textarea
              id="servicio-descripcion"
              className={styles.control}
              rows="3"
              value={datos.descripcion}
              onChange={cambiar('descripcion')}
              aria-describedby="servicio-descripcion-ayuda"
            />
          </Campo>

          <div className={styles.filaTres}>
            <Campo
              etiqueta="Precio"
              htmlFor="servicio-precio"
              error={errores.precio}
              ayuda="En pesos colombianos."
            >
              <input
                id="servicio-precio"
                className={styles.control}
                type="number"
                min="0"
                step="1000"
                inputMode="numeric"
                value={datos.precio}
                onChange={cambiar('precio')}
                aria-invalid={Boolean(errores.precio)}
                aria-describedby={
                  errores.precio ? 'servicio-precio-error' : 'servicio-precio-ayuda'
                }
              />
            </Campo>

            <Campo
              etiqueta="Duración"
              htmlFor="servicio-duracion"
              error={errores.duracion}
              ayuda="En minutos."
            >
              <input
                id="servicio-duracion"
                className={styles.control}
                type="number"
                min="1"
                step="5"
                inputMode="numeric"
                value={datos.duracion}
                onChange={cambiar('duracion')}
                aria-invalid={Boolean(errores.duracion)}
                aria-describedby={
                  errores.duracion ? 'servicio-duracion-error' : 'servicio-duracion-ayuda'
                }
              />
            </Campo>

            <Campo
              etiqueta="Categoría"
              htmlFor="servicio-categoria"
              ayuda="Puede quedar sin categoría."
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
          </div>

          <Campo
            etiqueta="Foto del servicio"
            htmlFor="servicio-foto"
            opcional
            ayuda="Enlace público a una imagen. Si no hay foto, se muestra un monograma."
          >
            <input
              id="servicio-foto"
              className={styles.control}
              type="url"
              value={datos.urlFoto}
              onChange={cambiar('urlFoto')}
              aria-describedby="servicio-foto-ayuda"
              placeholder="https://..."
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
