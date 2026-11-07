import { useCallback, useMemo, useState } from 'react';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import EliminarProfesionalFormulario from '../../components/admin/EliminarProfesionalFormulario';
import ProfesionalFormulario from '../../components/admin/ProfesionalFormulario';
import { useCategorias } from '../../hooks/useCategorias';
import { useHorarios } from '../../hooks/useHorarios';
import { useProfesionales } from '../../hooks/useProfesionales';
import { useUsuarios } from '../../hooks/useUsuarios';
import {
  idDeProfesional,
  inicialesDe,
  nombreDeProfesional,
  usuariosVinculables,
} from '../../utils/agenda';
import { mensajeDeError } from '../../utils/catalogo';
import page from './AdminPage.module.css';
import styles from './ProfesionalesAdmin.module.css';

function Avatar({ profesional }) {
  const [fallo, setFallo] = useState(false);
  const nombre = nombreDeProfesional(profesional);

  if (!profesional.urlFoto || fallo) {
    return (
      <span className={styles.avatar} aria-hidden="true">
        {inicialesDe(nombre)}
      </span>
    );
  }

  return (
    <span className={styles.avatar}>
      <img src={profesional.urlFoto} alt="" loading="lazy" onError={() => setFallo(true)} />
    </span>
  );
}

function EsqueletoLista() {
  return (
    <div className={styles.esqueletoLista}>
      <p className={page.srOnly} role="status">
        Cargando profesionales…
      </p>
      {Array.from({ length: 3 }).map((_, indice) => (
        <div className={styles.esqueletoFila} key={indice} aria-hidden="true">
          <span className={`${page.esqueleto} ${styles.esqueletoAvatar}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoChips}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoExperiencia}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoFranjas}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoAcciones}`} />
        </div>
      ))}
    </div>
  );
}

export default function ProfesionalesAdminPage() {
  const {
    profesionales,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    resumenBaja,
    eliminar,
  } = useProfesionales({ soloAdmin: true });
  const {
    categorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useCategorias();
  const { horarios, error: errorHorarios, recargar: recargarHorarios } = useHorarios();
  const { usuarios, cargando: cargandoUsuarios, recargar: recargarUsuarios } = useUsuarios();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [cargandoResumen, setCargandoResumen] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);
  const cerrarFormulario = useCallback(() => setFormulario(null), []);
  const cerrarConfirmacion = useCallback(() => setPorEliminar(null), []);

  const categoriasPorId = useMemo(
    () => new Map(categorias.map((categoria) => [categoria._id, categoria])),
    [categorias]
  );

  const franjasPorProfesional = useMemo(() => {
    const conteo = new Map();
    horarios.forEach((horario) => {
      const id = idDeProfesional(horario);
      conteo.set(id, (conteo.get(id) ?? 0) + 1);
    });
    return conteo;
  }, [horarios]);

  const cuentasDisponibles = useMemo(
    () => usuariosVinculables(usuarios, profesionales),
    [usuarios, profesionales]
  );

  const ordenados = useMemo(
    () =>
      [...profesionales].sort((a, b) =>
        nombreDeProfesional(a).localeCompare(nombreDeProfesional(b), 'es')
      ),
    [profesionales]
  );

  const conHorarios = profesionales.filter(
    (profesional) => (franjasPorProfesional.get(profesional._id) ?? 0) > 0
  ).length;

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return ordenados.filter((profesional) => {
      const nombre = nombreDeProfesional(profesional);
      const correo = profesional.idUsuario?.correo ?? '';

      if (termino && !`${nombre} ${correo}`.toLowerCase().includes(termino)) {
        return false;
      }

      if (filtroEspecialidad !== 'todas') {
        const tiene = (profesional.especialidades ?? []).some((especialidad) =>
          (typeof especialidad === 'object' ? especialidad._id : especialidad) ===
          filtroEspecialidad
        );
        if (!tiene) return false;
      }

      return true;
    });
  }, [ordenados, busqueda, filtroEspecialidad]);

  const hayFiltros = busqueda.trim() !== '' || filtroEspecialidad !== 'todas';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEspecialidad('todas');
  };

  const abrirNuevo = () => setFormulario({ profesional: null });
  const abrirEditar = (profesional) => setFormulario({ profesional });

  const guardar = async (datos) => {
    const nombre =
      datos.nombrecompleto ||
      cuentasDisponibles.find((cuenta) => cuenta._id === datos.idUsuario)?.nombrecompleto ||
      'La profesional';

    if (formulario?.profesional?._id) {
      await actualizar(formulario.profesional._id, datos);
      setAviso({ tipo: 'exito', mensaje: `Cambios guardados en «${nombre}».` });
    } else {
      await crear(datos);
      setAviso({
        tipo: 'exito',
        mensaje:
          datos.modo === 'nuevo'
            ? `«${nombre}» quedó registrada con su cuenta de acceso.`
            : `«${nombre}» quedó vinculada al perfil profesional.`,
      });
    }

    setFormulario(null);
    // La cuenta recién creada deja de estar disponible para vincular.
    if (!formulario?.profesional?._id) recargarUsuarios();
  };

  const pedirEliminar = async (profesional) => {
    setCargandoResumen(profesional._id);

    try {
      const resumen = await resumenBaja(profesional._id);
      setPorEliminar({ profesional, resumen });
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos revisar la baja de la profesional.'),
      });
    } finally {
      setCargandoResumen(null);
    }
  };

  const confirmarEliminar = async (opciones) => {
    if (!porEliminar) return null;

    const resultado = await eliminar(porEliminar.profesional._id, opciones);

    if (opciones.eliminarHorarios) recargarHorarios();
    if (opciones.eliminarCuenta) recargarUsuarios();

    setAviso({
      tipo: 'exito',
      mensaje: `«${nombreDeProfesional(porEliminar.profesional)}» se dio de baja del equipo.`,
    });

    return resultado;
  };

  const hayError = error || errorHorarios || errorCategorias;

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>Las manos de Three Masters</h1>
          <p className={page.intro}>
            Gestioma tu equipo y sus especialidades.
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
          Nueva profesional
        </Boton>
      </header>


      <dl className={page.resumen} aria-label="Resumen del equipo">
        <div className={page.resumenItem}>
          <dt>En el equipo</dt>
          <dd>{profesionales.length}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Con horarios</dt>
          <dd>{conHorarios}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Sin horarios</dt>
          <dd>{profesionales.length - conHorarios}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Cuentas por vincular</dt>
          <dd>{cargandoUsuarios ? '—' : cuentasDisponibles.length}</dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {hayError && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar todo el equipo.</strong>
            <p>{error || errorHorarios || errorCategorias}</p>
          </div>
          <Boton
            tamano="sm"
            onClick={() => {
              recargar();
              recargarHorarios();
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
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            aria-label="Buscar profesionales"
          />
        </div>

        <div className={styles.selector}>
          <select
            className={styles.select}
            value={filtroEspecialidad}
            onChange={(evento) => setFiltroEspecialidad(evento.target.value)}
            aria-label="Filtrar por especialidad"
          >
            <option value="todas">Todas las especialidades</option>
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

        <p className={styles.resultado} aria-live="polite">
          {hayFiltros
            ? `${filtrados.length} de ${profesionales.length} profesionales`
            : `${profesionales.length} ${
                profesionales.length === 1 ? 'profesional' : 'profesionales'
              }`}
        </p>
      </div>

      {error ? null : cargando ? (
        <EsqueletoLista />
      ) : profesionales.length === 0 ? (
        <div className={page.vacio}>
          <h2 className={page.vacioTitulo}>Todavía no hay profesionales</h2>
          <p className={page.vacioTexto}>
            Registra a la primera profesional con su cuenta de acceso y las categorías
            que atiende.
          </p>
          <div className={page.vacioAcciones}>
            <Boton variante="primario" onClick={abrirNuevo}>
              Registrar profesional
            </Boton>
          </div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className={`${page.vacio} ${page.vacioCompacto}`}>
          <h2 className={page.vacioTitulo}>Nadie coincide con el filtro</h2>
          <p className={page.vacioTexto}>
            Prueba con otro nombre o quita los filtros para ver todo el equipo.
          </p>
          <div className={page.vacioAcciones}>
            <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cabeceraLista} aria-hidden="true">
            <span />
            <span>Profesional</span>
            <span>Especialidades</span>
            <span>Experiencia</span>
            <span>Horarios</span>
            <span className={styles.cabeceraAcciones}>Acciones</span>
          </div>

          <ul className={styles.lista}>
            {filtrados.map((profesional) => {
              const nombre = nombreDeProfesional(profesional);
              const especialidades = profesional.especialidades ?? [];
              const franjas = franjasPorProfesional.get(profesional._id) ?? 0;

              return (
                <li className={styles.fila} key={profesional._id}>
                  <Avatar profesional={profesional} />

                  <div className={styles.identidad}>
                    <h2 className={styles.nombre}>{nombre}</h2>
                    <p className={styles.correo}>
                      {profesional.idUsuario?.correo || 'Sin correo registrado'}
                    </p>
                  </div>

                  <div className={styles.especialidades}>
                    {especialidades.length === 0 ? (
                      <span className={styles.sinEspecialidades}>Sin especialidades</span>
                    ) : (
                      especialidades.map((especialidad) => {
                        const id =
                          typeof especialidad === 'object' ? especialidad._id : especialidad;
                        const nombreCategoria =
                          categoriasPorId.get(id)?.nombre ??
                          (typeof especialidad === 'object' ? especialidad.nombre : null) ??
                          'Categoría eliminada';

                        return (
                          <span key={id} className={styles.chip}>
                            {nombreCategoria}
                          </span>
                        );
                      })
                    )}
                  </div>

                  <div className={`${styles.meta} ${styles.experiencia}`}>
                    {profesional.anioExperiencia > 0
                      ? `${profesional.anioExperiencia} ${
                          profesional.anioExperiencia === 1 ? 'año' : 'años'
                        }`
                      : 'Sin dato'}
                  </div>

                  <div className={`${styles.meta} ${styles.franjas}`}>
                    {franjas === 0
                      ? 'Sin horarios'
                      : `${franjas} ${franjas === 1 ? 'franja' : 'franjas'}`}
                  </div>

                  <div className={styles.acciones}>
                    <Boton
                      tamano="sm"
                      variante="fantasma"
                      onClick={() => abrirEditar(profesional)}
                    >
                      Editar
                    </Boton>
                    <Boton
                      tamano="sm"
                      variante="peligroSuave"
                      onClick={() => pedirEliminar(profesional)}
                      cargando={cargandoResumen === profesional._id}
                      disabled={cargandoResumen !== null && cargandoResumen !== profesional._id}
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
        <ProfesionalFormulario
          profesional={formulario.profesional}
          categorias={categorias}
          cargandoCategorias={cargandoCategorias}
          cuentasDisponibles={cuentasDisponibles}
          cargandoCuentas={cargandoUsuarios}
          onGuardar={guardar}
          onCerrar={cerrarFormulario}
        />
      )}

      {porEliminar && (
        <EliminarProfesionalFormulario
          resumen={porEliminar.resumen}
          onConfirmar={confirmarEliminar}
          onCerrar={cerrarConfirmacion}
        />
      )}
    </div>
  );
}
