import { useState } from 'react';
import Boton from './Boton';
import Campo from './Campo';
import Dialogo from './Dialogo';
import Interruptor from './Interruptor';
import {
  cuerpoCategoria,
  datosFormularioCategoria,
  mensajeDeError,
  validarCategoria,
} from '../../utils/catalogo';
import styles from './Formulario.module.css';

export default function CategoriaFormulario({ categoria, onGuardar, onCerrar }) {
  const editando = Boolean(categoria?._id);
  const [datos, setDatos] = useState(() => datosFormularioCategoria(categoria));
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

    const nuevosErrores = validarCategoria(datos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    setErrorGeneral('');

    try {
      await onGuardar(cuerpoCategoria(datos));
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos guardar la categoría. Intenta de nuevo.')
      );
      setGuardando(false);
    }
  };

  return (
    <Dialogo
      titulo={editando ? 'Editar categoría' : 'Nueva categoría'}
      descripcion="Agrupa servicios para que el catálogo sea más fácil de recorrer."
      onCerrar={onCerrar}
      bloqueado={guardando}
      ancho="sm"
    >
      <form className={styles.formulario} onSubmit={enviar} noValidate>
        <fieldset className={styles.grupo} disabled={guardando}>
          <Campo etiqueta="Nombre de la categoría" htmlFor="categoria-nombre" error={errores.nombre}>
            <input
              id="categoria-nombre"
              className={styles.control}
              type="text"
              value={datos.nombre}
              onChange={cambiar('nombre')}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'categoria-nombre-error' : undefined}
              data-autofoco
            />
          </Campo>

          <Campo
            etiqueta="Descripción"
            htmlFor="categoria-descripcion"
            opcional
            ayuda="Explica qué tipo de tratamientos reúne."
          >
            <textarea
              id="categoria-descripcion"
              className={styles.control}
              rows="3"
              value={datos.descripcion}
              onChange={cambiar('descripcion')}
              aria-describedby="categoria-descripcion-ayuda"
            />
          </Campo>

          <Interruptor
            id="categoria-estado"
            checked={datos.estado}
            onChange={cambiar('estado')}
            titulo="Visible en el catálogo"
            descripcion={
              datos.estado
                ? 'La categoría se ofrece como filtro en el catálogo público.'
                : 'Deja de ofrecerse como filtro, pero los servicios se conservan.'
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
            {editando ? 'Guardar cambios' : 'Crear categoría'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  );
}
