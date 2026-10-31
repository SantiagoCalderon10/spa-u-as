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

function MiniaturaCategoria({ nombre }) {
  const inicial = (nombre ?? '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <span className={styles.miniatura} aria-hidden="true">
      {inicial}
    </span>
  );
}

function EsqueletoLista() {
  return (
    <div className={styles.esqueletoLista}>
      <p className={page.srOnly} role="status">
        Cargando categorías…
      </p>
      {Array.from({ length: 4 }).map((_, indice) => (
        <div className={styles.esqueletoFila} key={indice} aria-hidden="true">
          <span className={`${page.esqueleto} ${styles.esqueletoMiniatura}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoConteo}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoEstado}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoAcciones}`} />
        </div>
      ))}
    </div>
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
          <h1 className={page.titulo}>Categorías</h1>
          <p className={page.intro}>
            Agrupa los servicios del atelier para que el catálogo sea más fácil de
            recorrer y de mantener.
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
            ? `${filtradas.length} de ${categorias.length} categorías`
            : `${categorias.length} ${
                categorias.length === 1 ? 'categoría' : 'categorías'
              }`}
        </p>
      </div>

      {error ? null : cargando ? (
        <EsqueletoLista />
      ) : categorias.length === 0 ? (
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
      ) : filtradas.length === 0 ? (
        <div className={`${page.vacio} ${page.vacioCompacto}`}>
          <h2 className={page.vacioTitulo}>Ninguna categoría coincide</h2>
          <p className={page.vacioTexto}>
            Prueba con otro término o quita los filtros para ver todas las categorías.
          </p>
          <div className={page.vacioAcciones}>
            <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cabeceraLista} aria-hidden="true">
            <span />
            <span>Categoría</span>
            <span>Servicios</span>
            <span>Estado</span>
            <span className={styles.cabeceraAcciones}>Acciones</span>
          </div>

          <ul className={styles.lista}>
            {filtradas.map((categoria) => {
              const estaActiva = categoria.estado !== false;
              const ocupada = idEstado === categoria._id;
              const asociados = conteoPorCategoria.get(categoria._id) ?? 0;

              return (
                <li className={styles.fila} key={categoria._id}>
                  <MiniaturaCategoria nombre={categoria.nombre} />

                  <div className={styles.identidad}>
                    <h2 className={styles.nombre}>{categoria.nombre}</h2>
                    <p className={styles.descripcion}>
                      {categoria.descripcion || 'Sin descripción.'}
                    </p>
                  </div>

                  <div className={styles.conteo}>
                    {cargandoServicios || errorServicios
                      ? '—'
                      : `${asociados} ${asociados === 1 ? 'servicio' : 'servicios'}`}
                  </div>

                  <button
                    type="button"
                    className={`${styles.estado} ${
                      estaActiva ? styles.estadoActivo : styles.estadoPausado
                    }`}
                    onClick={() => alternarEstado(categoria)}
                    disabled={ocupada}
                    aria-pressed={estaActiva}
                    aria-label={`${estaActiva ? 'Pausar' : 'Activar'} ${categoria.nombre}`}
                    title={estaActiva ? 'Pausar en el catálogo' : 'Activar en el catálogo'}
                  >
                    <span className={styles.punto} aria-hidden="true" />
                    {ocupada ? 'Guardando' : estaActiva ? 'Activo' : 'En pausa'}
                  </button>

                  <div className={styles.acciones}>
                    <Boton
                      tamano="sm"
                      variante="fantasma"
                      onClick={() => abrirEditar(categoria)}
                    >
                      Editar
                    </Boton>
                    <Boton
                      tamano="sm"
                      variante="peligroSuave"
                      onClick={() => setPorEliminar(categoria)}
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
