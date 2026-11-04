import { useCallback, useMemo, useState } from 'react';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import CategoriaFormulario from '../../components/admin/CategoriaFormulario';
import Confirmacion from '../../components/admin/Confirmacion';
import { useCategorias } from '../../hooks/useCategorias';
import { useServicios } from '../../hooks/useServicios';
import {
  idCategoriaDe,
  mensajeDeError,
} from '../../utils/catalogo';
import page from './AdminPage.module.css';
import styles from './CategoriasAdmin.module.css';

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

function IconoChevron() {
  return (
    <svg
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
  );
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

function MiniaturaCategoria({ nombre }) {
  const inicial = (nombre ?? '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <span className={styles.miniatura} aria-hidden="true">
      {inicial}
    </span>
  );
}

function EsqueletoTabla() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, indice) => (
        <tr className={styles.filaEsqueleto} key={indice} aria-hidden="true">
          <td>
            <span className={styles.esqueletoCategoria}>
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

export default function CategoriasAdminPage() {
  const {
    categorias,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    eliminar,
  } = useCategorias();
  const {
    servicios,
    cargando: cargandoServicios,
    error: errorServicios,
    recargar: recargarServicios,
  } = useServicios();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [idEstado, setIdEstado] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);
  const cerrarFormulario = useCallback(() => setFormulario(null), []);
  const cerrarConfirmacion = useCallback(() => setPorEliminar(null), []);

  const conteoPorCategoria = useMemo(() => {
    const conteo = new Map();
    servicios.forEach((servicio) => {
      const id = idCategoriaDe(servicio);
      if (!id) return;
      conteo.set(id, (conteo.get(id) ?? 0) + 1);
    });
    return conteo;
  }, [servicios]);

  const activas = categorias.filter((categoria) => categoria.estado !== false).length;
  const pausadas = categorias.length - activas;

  const serviciosSinCategoria = useMemo(() => {
    if (cargandoServicios || errorServicios || cargando) return null;
    const ids = new Set(categorias.map((categoria) => categoria._id));
    return servicios.filter((servicio) => {
      const id = idCategoriaDe(servicio);
      return !id || !ids.has(id);
    }).length;
  }, [servicios, categorias, cargandoServicios, errorServicios, cargando]);

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return categorias.filter((categoria) => {
      if (termino) {
        const texto = `${categoria.nombre ?? ''} ${categoria.descripcion ?? ''}`.toLowerCase();
        if (!texto.includes(termino)) return false;
      }

      if (filtroEstado === 'activas' && categoria.estado === false) return false;
      if (filtroEstado === 'pausadas' && categoria.estado !== false) return false;

      return true;
    });
  }, [categorias, busqueda, filtroEstado]);

  const hayFiltros = busqueda.trim() !== '' || filtroEstado !== 'todas';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todas');
  };

  const abrirNuevo = () => setFormulario({ categoria: null });
  const abrirEditar = (categoria) => setFormulario({ categoria });

  const guardar = async (datos) => {
    if (formulario?.categoria?._id) {
      const actualizada = await actualizar(formulario.categoria._id, datos);
      setAviso({
        tipo: 'exito',
        mensaje: `Cambios guardados en «${actualizada.nombre}».`,
      });
    } else {
      const creada = await crear(datos);
      setAviso({
        tipo: 'exito',
        mensaje: `«${creada.nombre}» se agregó al catálogo.`,
      });
    }

    setFormulario(null);
  };

  const alternarEstado = async (categoria) => {
    const estaActiva = categoria.estado !== false;
    const nuevoEstado = !estaActiva;

    setIdEstado(categoria._id);

    try {
      const actualizada = await actualizar(categoria._id, { estado: nuevoEstado });

      setAviso({
        tipo: 'exito',
        mensaje: `«${actualizada.nombre}» quedó ${
          nuevoEstado ? 'visible en el catálogo' : 'en pausa'
        }.`,
      });
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos cambiar el estado de la categoría.'),
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
        mensaje: mensajeDeError(err, 'No pudimos eliminar la categoría.'),
      });
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const asociadosAEliminar =
    porEliminar && !cargandoServicios && !errorServicios
      ? conteoPorCategoria.get(porEliminar._id) ?? 0
      : null;

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>Cada cuidado, en su lugar</h1>
          <p className={page.intro}>
            Organiza tu carta para que encontrar un servicio sea sencillo.
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
          Nueva categoría
        </Boton>
      </header>

      <dl className={page.resumen} aria-label="Resumen de categorías">
        <div className={page.resumenItem}>
          <dt>Registradas</dt>
          <dd>{categorias.length}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Activas</dt>
          <dd>{activas}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>En pausa</dt>
          <dd>{pausadas}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Servicios sin categoría</dt>
          <dd>{serviciosSinCategoria ?? '—'}</dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {(error || errorServicios) && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar todo el catálogo.</strong>
            <p>{error || errorServicios}</p>
          </div>
          <Boton
            tamano="sm"
            onClick={() => {
              recargar();
              recargarServicios();
            }}
          >
            Reintentar
          </Boton>
        </div>
      )}

      <section className={styles.panel} aria-label="Categorías del catálogo">
        <div className={styles.herramientas}>
          <div className={styles.busqueda}>
            <IconoBuscar />
            <input
              type="search"
              className={styles.entradaBusqueda}
              placeholder="Buscar por nombre o descripción"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar categorías"
            />
          </div>

          <div className={styles.selector}>
            <select
              className={styles.select}
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="todas">Todos los estados</option>
              <option value="activas">Solo activas</option>
              <option value="pausadas">Solo en pausa</option>
            </select>
            <span className={styles.iconoSelector} aria-hidden="true">
              <IconoChevron />
            </span>
          </div>

          <p className={styles.resultado} aria-live="polite">
            {hayFiltros
              ? `${filtradas.length} de ${categorias.length} categorías`
              : `${categorias.length} ${
                  categorias.length === 1 ? 'categoría' : 'categorías'
                }`}
          </p>
        </div>

        {error ? null : cargando ? (
          <>
            <p className={page.srOnly} role="status">
              Cargando categorías…
            </p>
            <div className={styles.tablaEnvoltura}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th scope="col">Categoría</th>
                    <th scope="col">Servicios</th>
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
        ) : categorias.length === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={page.vacio}>
              <h2 className={page.vacioTitulo}>Todavía no hay categorías</h2>
              <p className={page.vacioTexto}>
                Crea categorías para ordenar los servicios del catálogo y facilitar la
                búsqueda de las clientas.
              </p>
              <div className={page.vacioAcciones}>
                <Boton variante="primario" onClick={abrirNuevo}>
                  Crear categoría
                </Boton>
              </div>
            </div>
          </div>
        ) : filtradas.length === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={`${page.vacio} ${page.vacioCompacto}`}>
              <h2 className={page.vacioTitulo}>Ninguna categoría coincide</h2>
              <p className={page.vacioTexto}>
                Prueba con otro término o quita los filtros para ver todas las categorías.
              </p>
              <div className={page.vacioAcciones}>
                <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tablaEnvoltura}>
            <table className={styles.tabla}>
              <caption className={page.srOnly}>Categorías del catálogo</caption>
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col">Servicios</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className={styles.colAcciones}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((categoria) => {
                  const estaActiva = categoria.estado !== false;
                  const ocupada = idEstado === categoria._id;
                  const asociados = conteoPorCategoria.get(categoria._id) ?? 0;
                  const conteo =
                    cargandoServicios || errorServicios
                      ? '—'
                      : `${asociados} ${asociados === 1 ? 'servicio' : 'servicios'}`;

                  return (
                    <tr className={styles.fila} key={categoria._id}>
                      <th scope="row" className={styles.celdaCategoria}>
                        <span className={styles.categoriaFila}>
                          <MiniaturaCategoria nombre={categoria.nombre} />
                          <span className={styles.categoriaTexto}>
                            <span className={styles.nombre}>{categoria.nombre}</span>
                            <span className={styles.descripcion}>
                              {categoria.descripcion || 'Sin descripción.'}
                            </span>
                          </span>
                        </span>
                      </th>

                      <td data-etiqueta="Servicios">
                        <span
                          className={`${styles.chip} ${
                            asociados === 0 ? styles.chipVacio : ''
                          }`}
                        >
                          {asociados === 0 && conteo !== '—' ? 'Sin servicios' : conteo}
                        </span>
                      </td>

                      <td data-etiqueta="Estado">
                        <button
                          type="button"
                          className={`${styles.estado} ${
                            estaActiva ? styles.estadoActivo : styles.estadoPausado
                          }`}
                          onClick={() => alternarEstado(categoria)}
                          disabled={ocupada}
                          aria-pressed={estaActiva}
                          aria-label={`${estaActiva ? 'Pausar' : 'Activar'} ${
                            categoria.nombre
                          } en el catálogo`}
                          title={
                            estaActiva ? 'Pausar en el catálogo' : 'Activar en el catálogo'
                          }
                        >
                          <span className={styles.punto} aria-hidden="true" />
                          {ocupada ? 'Guardando…' : estaActiva ? 'ACTIVA' : 'EN PAUSA'}
                        </button>
                      </td>

                      <td className={styles.celdaAcciones}>
                        <div className={styles.acciones}>
                          <Boton
                            tamano="sm"
                            variante="fantasma"
                            className={styles.botonIcono}
                            onClick={() => abrirEditar(categoria)}
                            aria-label={`Editar ${categoria.nombre}`}
                            title="Editar categoría"
                          >
                            <IconoLapiz />
                          </Boton>
                          <Boton
                            tamano="sm"
                            variante="peligroSuave"
                            className={styles.botonIcono}
                            onClick={() => setPorEliminar(categoria)}
                            aria-label={`Eliminar ${categoria.nombre}`}
                            title="Eliminar categoría"
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
        <CategoriaFormulario
          categoria={formulario.categoria}
          onGuardar={guardar}
          onCerrar={cerrarFormulario}
        />
      )}

      {porEliminar && (
        <Confirmacion
          titulo="Eliminar categoría"
          textoConfirmar="Eliminar categoría"
          cargando={eliminando}
          onConfirmar={confirmarEliminar}
          onCerrar={cerrarConfirmacion}
        >
          {asociadosAEliminar === null ? (
            <p>
              Vas a eliminar <strong>«{porEliminar.nombre}»</strong>. Si tiene servicios
              asociados, quedarán sin categoría en el catálogo. Esta acción no se puede
              deshacer.
            </p>
          ) : asociadosAEliminar > 0 ? (
            <p>
              <strong>«{porEliminar.nombre}»</strong> agrupa{' '}
              <strong>
                {asociadosAEliminar}{' '}
                {asociadosAEliminar === 1 ? 'servicio' : 'servicios'}
              </strong>
              . Si la eliminas, quedarán sin categoría en el catálogo. Los servicios no
              se eliminan.
            </p>
          ) : (
            <p>
              <strong>«{porEliminar.nombre}»</strong> no tiene servicios asociados. Esta
              acción no se puede deshacer.
            </p>
          )}
        </Confirmacion>
      )}
    </div>
  );
}
