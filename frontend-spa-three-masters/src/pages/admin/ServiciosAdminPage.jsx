import { useCallback, useMemo, useState } from 'react';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import Confirmacion from '../../components/admin/Confirmacion';
import ServicioFormulario from '../../components/admin/ServicioFormulario';
import { useCategorias } from '../../hooks/useCategorias';
import { useServicios } from '../../hooks/useServicios';
import {
  formatearDuracion,
  formatearPrecio,
  idCategoriaDe,
  mensajeDeError,
} from '../../utils/catalogo';
import page from './AdminPage.module.css';
import styles from './ServiciosAdmin.module.css';

function MiniaturaServicio({ servicio }) {
  const [fallo, setFallo] = useState(false);
  const inicial = (servicio.nombre ?? '?').trim().charAt(0).toUpperCase() || '?';

  if (!servicio.urlFoto || fallo) {
    return (
      <span className={styles.miniatura} aria-hidden="true">
        {inicial}
      </span>
    );
  }

  return (
    <span className={styles.miniatura}>
      <img
        src={servicio.urlFoto}
        alt=""
        loading="lazy"
        onError={() => setFallo(true)}
      />
    </span>
  );
}

function EsqueletoLista() {
  return (
    <div className={styles.esqueletoLista}>
      <p className={page.srOnly} role="status">
        Cargando servicios…
      </p>
      {Array.from({ length: 4 }).map((_, indice) => (
        <div className={styles.esqueletoFila} key={indice} aria-hidden="true">
          <span className={`${page.esqueleto} ${styles.esqueletoMiniatura}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoCategoria}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoMeta}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoEstado}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoAcciones}`} />
        </div>
      ))}
    </div>
  );
}

export default function ServiciosAdminPage() {
  const {
    servicios,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    eliminar,
  } = useServicios();
  const {
    categorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useCategorias();

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [idEstado, setIdEstado] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);
  const cerrarFormulario = useCallback(() => setFormulario(null), []);
  const cerrarConfirmacion = useCallback(() => setPorEliminar(null), []);

  const categoriasPorId = useMemo(
    () => new Map(categorias.map((categoria) => [categoria._id, categoria])),
    [categorias]
  );

  const activos = servicios.filter((servicio) => servicio.activo !== false).length;
  const pausados = servicios.length - activos;

  const sinCategoria = useMemo(() => {
    if (cargandoCategorias || errorCategorias) return null;
    return servicios.filter((servicio) => {
      const id = idCategoriaDe(servicio);
      return !id || !categoriasPorId.has(id);
    }).length;
  }, [servicios, categoriasPorId, cargandoCategorias, errorCategorias]);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return servicios.filter((servicio) => {
      const idCategoria = idCategoriaDe(servicio);
      const categoria = categoriasPorId.get(idCategoria);

      if (termino) {
        const texto = `${servicio.nombre ?? ''} ${servicio.descripcion ?? ''} ${
          categoria?.nombre ?? ''
        }`.toLowerCase();
        if (!texto.includes(termino)) return false;
      }

      if (filtroCategoria !== 'todas' && idCategoria !== filtroCategoria) return false;
      if (filtroEstado === 'activos' && servicio.activo === false) return false;
      if (filtroEstado === 'pausados' && servicio.activo !== false) return false;

      return true;
    });
  }, [servicios, categoriasPorId, busqueda, filtroCategoria, filtroEstado]);

  const hayFiltros =
    busqueda.trim() !== '' || filtroCategoria !== 'todas' || filtroEstado !== 'todos';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroCategoria('todas');
    setFiltroEstado('todos');
  };

  const abrirNuevo = () => setFormulario({ servicio: null });
  const abrirEditar = (servicio) => setFormulario({ servicio });

  const guardar = async (datos) => {
    if (formulario?.servicio?._id) {
      const actualizado = await actualizar(formulario.servicio._id, datos);
      setAviso({
        tipo: 'exito',
        mensaje: `Cambios guardados en «${actualizado.nombre}».`,
      });
    } else {
      const creado = await crear(datos);
      setAviso({
        tipo: 'exito',
        mensaje: `«${creado.nombre}» se agregó al catálogo.`,
      });
    }

    setFormulario(null);
  };

  const alternarEstado = async (servicio) => {
    const estaActivo = servicio.activo !== false;
    const nuevoEstado = !estaActivo;

    setIdEstado(servicio._id);

    try {
      const actualizado = await actualizar(servicio._id, { activo: nuevoEstado });

      setAviso({
        tipo: 'exito',
        mensaje: `«${actualizado.nombre}» quedó ${
          nuevoEstado ? 'visible en el catálogo' : 'en pausa'
        }.`,
      });
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos cambiar el estado del servicio.'),
      });
    } finally {
      setIdEstado(null);
    }
  };

  const confirmarEliminar = async () => {
    if (!porEliminar) return;

    setEliminando(true);

    try {
      await eliminar(porEliminar._id);
      setAviso({
        tipo: 'exito',
        mensaje: `«${porEliminar.nombre}» se eliminó del catálogo.`,
      });
      setPorEliminar(null);
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos eliminar el servicio.'),
      });
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>Servicios</h1>
          <p className={page.intro}>
            Administra los tratamientos del atelier: precio, duración, categoría y
            visibilidad en el catálogo público.
          </p>
        </div>

        <Boton variante="primario" onClick={abrirNuevo}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo servicio
        </Boton>
      </header>

      <dl className={page.resumen} aria-label="Resumen de servicios">
        <div className={page.resumenItem}>
          <dt>Registrados</dt>
          <dd>{servicios.length}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Activos</dt>
          <dd>{activos}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>En pausa</dt>
          <dd>{pausados}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Sin categoría</dt>
          <dd>{sinCategoria ?? '—'}</dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {(error || errorCategorias) && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar todo el catálogo.</strong>
            <p>{error || errorCategorias}</p>
          </div>
          <Boton
            tamano="sm"
            onClick={() => {
              recargar();
              recargarCategorias();
            }}
          >
            Reintentar
          </Boton>
        </div>
      )}

      <div className={styles.herramientas}>
        <div className={styles.busqueda}>
          <svg
            className={styles.iconoBusqueda}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            className={styles.entradaBusqueda}
            placeholder="Buscar por nombre, descripción o categoría"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            aria-label="Buscar servicios"
          />
        </div>

        <div className={styles.selector}>
          <select
            className={styles.select}
            value={filtroCategoria}
            onChange={(evento) => setFiltroCategoria(evento.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <svg
            className={styles.iconoSelector}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div className={styles.selector}>
          <select
            className={styles.select}
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="pausados">Solo en pausa</option>
          </select>
          <svg
            className={styles.iconoSelector}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <p className={styles.resultado} aria-live="polite">
          {hayFiltros
            ? `${filtrados.length} de ${servicios.length} servicios`
            : `${servicios.length} ${servicios.length === 1 ? 'servicio' : 'servicios'}`}
        </p>
      </div>

      {error ? null : cargando ? (
        <EsqueletoLista />
      ) : servicios.length === 0 ? (
        <div className={page.vacio}>
          <h2 className={page.vacioTitulo}>Todavía no hay servicios</h2>
          <p className={page.vacioTexto}>
            Crea el primer tratamiento para que aparezca en el catálogo público del
            atelier.
          </p>
          <div className={page.vacioAcciones}>
            <Boton variante="primario" onClick={abrirNuevo}>
              Crear servicio
            </Boton>
          </div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className={`${page.vacio} ${page.vacioCompacto}`}>
          <h2 className={page.vacioTitulo}>Ningún servicio coincide</h2>
          <p className={page.vacioTexto}>
            Prueba con otro término o quita los filtros para ver el catálogo completo.
          </p>
          <div className={page.vacioAcciones}>
            <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cabeceraLista} aria-hidden="true">
            <span />
            <span>Servicio</span>
            <span>Categoría</span>
            <span>Duración y precio</span>
            <span>Estado</span>
            <span className={styles.cabeceraAcciones}>Acciones</span>
          </div>

          <ul className={styles.lista}>
            {filtrados.map((servicio) => {
              const categoria = categoriasPorId.get(idCategoriaDe(servicio));
              const estaActivo = servicio.activo !== false;
              const ocupado = idEstado === servicio._id;

              return (
                <li className={styles.fila} key={servicio._id}>
                  <MiniaturaServicio servicio={servicio} />

                  <div className={styles.identidad}>
                    <h2 className={styles.nombre}>{servicio.nombre}</h2>
                    <p className={styles.descripcion}>
                      {servicio.descripcion || 'Sin descripción.'}
                    </p>
                  </div>

                  <div
                    className={`${styles.categoria} ${
                      categoria ? '' : styles.categoriaVacia
                    }`}
                  >
                    {categoria?.nombre || 'Sin categoría'}
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.duracion}>
                      {formatearDuracion(servicio.duracion)}
                    </span>
                    <span className={styles.precio}>
                      {formatearPrecio(servicio.precio)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`${styles.estado} ${
                      estaActivo ? styles.estadoActivo : styles.estadoPausado
                    }`}
                    onClick={() => alternarEstado(servicio)}
                    disabled={ocupado}
                    aria-pressed={estaActivo}
                    aria-label={`${estaActivo ? 'Pausar' : 'Activar'} ${servicio.nombre}`}
                    title={estaActivo ? 'Pausar en el catálogo' : 'Activar en el catálogo'}
                  >
                    <span className={styles.punto} aria-hidden="true" />
                    {ocupado ? 'Guardando' : estaActivo ? 'Activo' : 'En pausa'}
                  </button>

                  <div className={styles.acciones}>
                    <Boton
                      tamano="sm"
                      variante="fantasma"
                      onClick={() => abrirEditar(servicio)}
                    >
                      Editar
                    </Boton>
                    <Boton
                      tamano="sm"
                      variante="peligroSuave"
                      onClick={() => setPorEliminar(servicio)}
                    >
                      Eliminar
                    </Boton>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {formulario && (
        <ServicioFormulario
          servicio={formulario.servicio}
          categorias={categorias}
          onGuardar={guardar}
          onCerrar={cerrarFormulario}
        />
      )}

      {porEliminar && (
        <Confirmacion
          titulo="Eliminar servicio"
          textoConfirmar="Eliminar servicio"
          cargando={eliminando}
          onConfirmar={confirmarEliminar}
          onCerrar={cerrarConfirmacion}
        >
          <p>
            Vas a eliminar <strong>«{porEliminar.nombre}»</strong>. Dejará de aparecer
            en el catálogo y esta acción no se puede deshacer.
          </p>
        </Confirmacion>
      )}
    </div>
  );
}
