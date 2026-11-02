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

function IconoBuscar() {
  return (
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
  );
}

function IconoWeb(){
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.468 9.13405C17.468 13.7368 13.7367 17.468 9.134 17.468M17.468 9.13405C17.468 4.53131 13.7367 0.800049 9.134 0.800049M17.468 9.13405H12.4676M9.134 17.468C4.53126 17.468 0.799999 13.7368 0.799999 9.13405M9.134 17.468C6.99402 15.2211 5.8004 12.237 5.8004 9.13405M9.134 17.468C11.274 15.2211 12.4676 12.237 12.4676 9.13405M9.134 0.800049C6.99402 3.04702 5.8004 6.03108 5.8004 9.13405M9.134 0.800049C11.274 3.04702 12.4676 6.03108 12.4676 9.13405M9.134 0.800049C4.53126 0.800049 0.799999 4.53131 0.799999 9.13405M12.4676 9.13405H5.8004M5.8004 9.13405H0.799999" stroke-width="1.6" stroke-linecap="round" stroke="#783E50"/>
</svg>

  )
}

function IconoDestello() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8032 0.801676V2.46828M15.8032 2.46828V4.13488M15.8032 2.46828H17.47M15.8032 2.46828H14.1364M8.31676 1.48035C8.35246 1.28919 8.45391 1.11654 8.60353 0.992302C8.75314 0.868059 8.9415 0.800049 9.13599 0.800049C9.33047 0.800049 9.51883 0.868059 9.66845 0.992302C9.81806 1.11654 9.91951 1.28919 9.95522 1.48035L10.8311 6.11184C10.8933 6.44111 11.0534 6.74399 11.2904 6.98094C11.5273 7.2179 11.8302 7.37791 12.1596 7.44012L16.7916 8.31592C16.9828 8.35162 17.1555 8.45305 17.2797 8.60265C17.404 8.75225 17.472 8.94059 17.472 9.13505C17.472 9.32951 17.404 9.51785 17.2797 9.66745C17.1555 9.81705 16.9828 9.91848 16.7916 9.95418L12.1596 10.83C11.8302 10.8922 11.5273 11.0522 11.2904 11.2892C11.0534 11.5261 10.8933 11.829 10.8311 12.1583L9.95522 16.7897C9.91951 16.9809 9.81806 17.1536 9.66845 17.2778C9.51883 17.402 9.33047 17.47 9.13599 17.47C8.9415 17.47 8.75314 17.402 8.60353 17.2778C8.45391 17.1536 8.35246 16.9809 8.31676 16.7897L7.44085 12.1583C7.37864 11.829 7.2186 11.5261 6.98162 11.2892C6.74464 11.0522 6.44173 10.8922 6.11241 10.83L1.48037 9.95418C1.28919 9.91848 1.11652 9.81705 0.992264 9.66745C0.868007 9.51785 0.799988 9.32951 0.799988 9.13505C0.799988 8.94059 0.868007 8.75225 0.992264 8.60265C1.11652 8.45305 1.28919 8.35162 1.48037 8.31592L6.11241 7.44012C6.44173 7.37791 6.74464 7.2179 6.98162 6.98094C7.2186 6.74399 7.37864 6.44111 7.44085 6.11184L8.31676 1.48035ZM4.13562 15.8011C4.13562 16.7215 3.38937 17.4677 2.46882 17.4677C1.54827 17.4677 0.802022 16.7215 0.802022 15.8011C0.802022 14.8806 1.54827 14.1345 2.46882 14.1345C3.38937 14.1345 4.13562 14.8806 4.13562 15.8011Z" stroke-width="1.6" stroke-linecap="round" stroke="#783E50"/>
</svg>
  );
}

function IconoReloj() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function IconoCategoria(){
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66599 9.99981C1.66559 10.1592 1.71092 10.3154 1.79659 10.4498C1.88227 10.5842 2.00469 10.6912 2.14935 10.7582L9.31652 14.0167C9.53254 14.1145 9.76694 14.1651 10.0041 14.1651C10.2412 14.1651 10.4756 14.1145 10.6916 14.0167L17.8421 10.7665C17.9896 10.7002 18.1147 10.5924 18.202 10.4563C18.2893 10.3201 18.3351 10.1615 18.3338 9.99981M1.66599 14.1667C1.66559 14.3261 1.71092 14.4823 1.79659 14.6167C1.88227 14.7511 2.00469 14.8581 2.14935 14.9251L9.31652 18.1836C9.53254 18.2814 9.76694 18.332 10.0041 18.332C10.2412 18.332 10.4756 18.2814 10.6916 18.1836L17.8421 14.9334C17.9896 14.8671 18.1147 14.7593 18.202 14.6232C18.2893 14.487 18.3351 14.3284 18.3338 14.1667M10.692 1.81632C10.4748 1.71727 10.239 1.66602 10.0003 1.66602C9.7616 1.66602 9.52571 1.71727 9.30856 1.81632L2.1664 5.0665C2.01851 5.13171 1.89278 5.23851 1.80451 5.3739C1.71624 5.50929 1.66924 5.66742 1.66924 5.82905C1.66924 5.99067 1.71624 6.1488 1.80451 6.28419C1.89278 6.41958 2.01851 6.52638 2.1664 6.59159L9.3169 9.8501C9.53405 9.94915 9.76994 10.0004 10.0086 10.0004C10.2473 10.0004 10.4832 9.94915 10.7003 9.8501L17.8508 6.59992C17.9987 6.53471 18.1244 6.42791 18.2127 6.29252C18.301 6.15714 18.348 5.999 18.348 5.83738C18.348 5.67576 18.301 5.51762 18.2127 5.38223C18.1244 5.24684 17.9987 5.14004 17.8508 5.07484L10.692 1.81632Z" stroke-width="1.6" stroke-linecap="round" stroke="#783E50"/>
</svg>

  )
}

function IconoLapiz() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function IconoPapelera() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

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
      <img src={servicio.urlFoto} alt="" loading="lazy" onError={() => setFallo(true)} />
    </span>
  );
}

function EsqueletoTabla() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, indice) => (
        <tr className={styles.filaEsqueleto} key={indice} aria-hidden="true">
          <td>
            <span className={styles.esqueletoServicio}>
              <span className={`${page.esqueleto} ${styles.esqueletoMiniatura}`} />
              <span className={styles.esqueletoTextos}>
                <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
                <span className={`${page.esqueleto} ${styles.esqueletoDescripcion}`} />
              </span>
            </span>
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoChip}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoCorto}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoCorto}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoEstado}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoAcciones}`} />
          </td>
        </tr>
      ))}
    </>
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
          <h1 className={page.titulo}>LA CARTA DE TU SALÓN</h1>
          <p className={page.intro}>
           Crea, organiza y actualiza los cuidados que ofreces.
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
          
          <dt>Servicios</dt>
          <dd><IconoDestello /> {servicios.length}</dd>
          
        </div>
        <div className={page.resumenItem}>
          <dt>Activos</dt>
          <dd><IconoWeb /> {activos}</dd>
        </div>
       
        <div className={page.resumenItem}>
          <dt>Sin categoría</dt>
          <dd><IconoCategoria/> {sinCategoria ?? '—'}</dd>
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

      <section className={styles.panel} aria-label="Catálogo de servicios">
        <div className={styles.herramientas}>
          <div className={styles.busqueda}>
            <IconoBuscar />
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
            <span className={styles.iconoSelector} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
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
            <span className={styles.iconoSelector} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>

          <p className={styles.resultado} aria-live="polite">
            {hayFiltros
              ? `${filtrados.length} de ${servicios.length} servicios`
              : `${servicios.length} ${servicios.length === 1 ? 'servicio' : 'servicios'}`}
          </p>
        </div>

        {error ? null : cargando ? (
          <>
            <p className={page.srOnly} role="status">
              Cargando servicios…
            </p>
            <div className={styles.tablaEnvoltura}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th scope="col">Servicio</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Duración</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className={styles.colAcciones}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <EsqueletoTabla />
                </tbody>
              </table>
            </div>
          </>
        ) : servicios.length === 0 ? (
          <div className={styles.vacioPanel}>
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
          </div>
        ) : filtrados.length === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={`${page.vacio} ${page.vacioCompacto}`}>
              <h2 className={page.vacioTitulo}>Ningún servicio coincide</h2>
              <p className={page.vacioTexto}>
                Prueba con otro término o quita los filtros para ver el catálogo completo.
              </p>
              <div className={page.vacioAcciones}>
                <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tablaEnvoltura}>
            <table className={styles.tabla}>
              <caption className={page.srOnly}>Servicios del catálogo</caption>
              <thead>
                <tr>
                  <th scope="col">Servicio</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Duración</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className={styles.colAcciones}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((servicio) => {
                  const categoria = categoriasPorId.get(idCategoriaDe(servicio));
                  const estaActivo = servicio.activo !== false;
                  const ocupado = idEstado === servicio._id;

                  return (
                    <tr className={styles.fila} key={servicio._id}>
                      <th scope="row" className={styles.celdaServicio}>
                        <span className={styles.servicioFila}>
                          <MiniaturaServicio servicio={servicio} />
                          <span className={styles.servicioTexto}>
                            <span className={styles.nombre}>{servicio.nombre}</span>
                            <span className={styles.descripcion}>
                              {servicio.descripcion || 'Sin descripción.'}
                            </span>
                          </span>
                        </span>
                      </th>

                      <td data-etiqueta="Categoría">
                        <span
                          className={`${styles.chip} ${
                            categoria ? '' : styles.chipVacio
                          }`}
                        >
                          {categoria?.nombre || 'Sin categoría'}
                        </span>
                      </td>

                      <td data-etiqueta="Duración">
                        <span className={styles.duracion}>
                          <IconoReloj />
                          {formatearDuracion(servicio.duracion)}
                        </span>
                      </td>

                      <td data-etiqueta="Precio" className={styles.precio}>
                        {formatearPrecio(servicio.precio)}
                      </td>

                      <td data-etiqueta="Estado">
                        <button
                          type="button"
                          className={`${styles.estado} ${
                            estaActivo ? styles.estadoActivo : styles.estadoPausado
                          }`}
                          onClick={() => alternarEstado(servicio)}
                          disabled={ocupado}
                          aria-pressed={estaActivo}
                          aria-label={`${estaActivo ? 'Pausar' : 'Activar'} ${
                            servicio.nombre
                          } en el catálogo`}
                          title={
                            estaActivo ? 'Pausar en el catálogo' : 'Activar en el catálogo'
                          }
                        >
                          <span className={styles.punto} aria-hidden="true" />
                          {ocupado ? 'Guardando…' : estaActivo ? 'ACTIVO' : 'EN PAUSA'}
                        </button>
                      </td>

                      <td className={styles.celdaAcciones}>
                        <div className={styles.acciones}>
                          <Boton
                            tamano="sm"
                            variante="fantasma"
                            className={styles.botonIcono}
                            onClick={() => abrirEditar(servicio)}
                            aria-label={`Editar ${servicio.nombre}`}
                            title="Editar servicio"
                          >
                            <IconoLapiz />
                          </Boton>
                          <Boton
                            tamano="sm"
                            variante="peligroSuave"
                            className={styles.botonIcono}
                            onClick={() => setPorEliminar(servicio)}
                            aria-label={`Eliminar ${servicio.nombre}`}
                            title="Eliminar servicio"
                          >
                            <IconoPapelera />
                          </Boton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
