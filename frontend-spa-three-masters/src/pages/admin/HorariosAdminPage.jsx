import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import Confirmacion from '../../components/admin/Confirmacion';
import HorarioFormulario from '../../components/admin/HorarioFormulario';
import { useHorarios } from '../../hooks/useHorarios';
import { useProfesionales } from '../../hooks/useProfesionales';
import {
  DIAS_SEMANA,
  aMinutos,
  duracionFranja,
  formatearDuracionFranja,
  formatearFranja,
  idDeProfesional,
  nombreDia,
  nombreDeProfesional,
} from '../../utils/agenda';
import { mensajeDeError } from '../../utils/catalogo';
import page from './AdminPage.module.css';
import styles from './HorariosAdmin.module.css';

function EsqueletoLista() {
  return (
    <div className={styles.esqueletoLista}>
      <p className={page.srOnly} role="status">
        Cargando horarios…
      </p>
      {Array.from({ length: 3 }).map((_, indice) => (
        <div className={styles.esqueletoGrupo} key={indice} aria-hidden="true">
          <span className={`${page.esqueleto} ${styles.esqueletoTitulo}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoFranja}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoFranja}`} />
        </div>
      ))}
    </div>
  );
}

export default function HorariosAdminPage() {
  const {
    horarios,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    eliminar,
  } = useHorarios();
  const {
    profesionales,
    cargando: cargandoProfesionales,
    error: errorProfesionales,
    recargar: recargarProfesionales,
  } = useProfesionales();

  const [filtroProfesional, setFiltroProfesional] = useState('todas');
  const [filtroDia, setFiltroDia] = useState('todos');
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);
  const cerrarFormulario = useCallback(() => setFormulario(null), []);
  const cerrarConfirmacion = useCallback(() => setPorEliminar(null), []);

  const profesionalesPorId = useMemo(
    () => new Map(profesionales.map((profesional) => [profesional._id, profesional])),
    [profesionales]
  );

  const franjasFiltradas = useMemo(() => {
    return horarios
      .filter((horario) => {
        if (filtroProfesional !== 'todas' && idDeProfesional(horario) !== filtroProfesional) {
          return false;
        }
        if (filtroDia !== 'todos' && Number(horario.diaSemana) !== Number(filtroDia)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ordenA = DIAS_SEMANA.findIndex((dia) => dia.valor === Number(a.diaSemana));
        const ordenB = DIAS_SEMANA.findIndex((dia) => dia.valor === Number(b.diaSemana));
        if (ordenA !== ordenB) return ordenA - ordenB;
        return aMinutos(a.horaInicio) - aMinutos(b.horaInicio);
      });
  }, [horarios, filtroProfesional, filtroDia]);

  const grupos = useMemo(() => {
    const mapa = new Map();

    franjasFiltradas.forEach((horario) => {
      const id = idDeProfesional(horario);
      if (!mapa.has(id)) {
        const profesional = profesionalesPorId.get(id);
        mapa.set(id, {
          id,
          nombre: profesional
            ? nombreDeProfesional(profesional)
            : 'Profesional no encontrado',
          existe: Boolean(profesional),
          franjas: [],
        });
      }
      mapa.get(id).franjas.push(horario);
    });

    return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [franjasFiltradas, profesionalesPorId]);

  const minutosSemanales = franjasFiltradas.reduce(
    (total, horario) => total + Math.max(duracionFranja(horario.horaInicio, horario.horaFin), 0),
    0
  );

  const profesionalesConHorario = new Set(
    horarios.map((horario) => idDeProfesional(horario))
  ).size;

  const diasCubiertos = new Set(
    franjasFiltradas.map((horario) => Number(horario.diaSemana))
  ).size;

  const hayFiltros = filtroProfesional !== 'todas' || filtroDia !== 'todos';

  const limpiarFiltros = () => {
    setFiltroProfesional('todas');
    setFiltroDia('todos');
  };

  const abrirNueva = () => setFormulario({ horario: null });
  const abrirEditar = (horario) => setFormulario({ horario });

  const guardar = async (datos) => {
    if (formulario?.horario?._id) {
      await actualizar(formulario.horario._id, datos);
      setAviso({
        tipo: 'exito',
        mensaje: `Horario de ${nombreDia(datos.diaSemana)} actualizado.`,
      });
    } else {
      await crear(datos);
      setAviso({
        tipo: 'exito',
        mensaje: `Se agregó una franja del ${nombreDia(datos.diaSemana)} a la agenda.`,
      });
    }

    setFormulario(null);
  };

  const confirmarEliminar = async () => {
    if (!porEliminar) return;

    setEliminando(true);

    try {
      await eliminar(porEliminar._id);
      setAviso({
        tipo: 'exito',
        mensaje: `Se eliminó la franja del ${nombreDia(porEliminar.diaSemana)}.`,
      });
      setPorEliminar(null);
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos eliminar el horario.'),
      });
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const hayError = error || errorProfesionales;
  const sinProfesionales = !cargandoProfesionales && profesionales.length === 0;

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>Maneja los tiempos de tu equipo</h1>
          <p className={page.intro}>
            Define las franjas semanales en las que cada profesional atiende. La agenda
            de citas se apoyará en estos horarios.
          </p>
        </div>

        <Boton variante="primario" onClick={abrirNueva} disabled={sinProfesionales}>
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
          Nueva franja
        </Boton>
      </header>

      <dl className={page.resumen} aria-label="Resumen de horarios">
        <div className={page.resumenItem}>
          <dt>Franjas</dt>
          <dd>{horarios.length}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Con agenda</dt>
          <dd>{profesionalesConHorario}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Horas por semana</dt>
          <dd>
            {minutosSemanales > 0
              ? `${Math.round((minutosSemanales / 60) * 10) / 10} h`
              : '—'}
          </dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Días cubiertos</dt>
          <dd>{diasCubiertos > 0 ? `${diasCubiertos} de 7` : '—'}</dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {hayError && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar la agenda.</strong>
            <p>{error || errorProfesionales}</p>
          </div>
          <Boton
            tamano="sm"
            onClick={() => {
              recargar();
              recargarProfesionales();
            }}
          >
            Reintentar
          </Boton>
        </div>
      )}

      <div className={styles.herramientas}>
        <div className={styles.selector}>
          <select
            className={styles.select}
            value={filtroProfesional}
            onChange={(evento) => setFiltroProfesional(evento.target.value)}
            aria-label="Filtrar por profesional"
          >
            <option value="todas">Todo el equipo</option>
            {profesionales.map((profesional) => (
              <option key={profesional._id} value={profesional._id}>
                {nombreDeProfesional(profesional)}
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
            value={filtroDia}
            onChange={(evento) => setFiltroDia(evento.target.value)}
            aria-label="Filtrar por día"
          >
            <option value="todos">Todos los días</option>
            {DIAS_SEMANA.map((dia) => (
              <option key={dia.valor} value={dia.valor}>
                {dia.etiqueta}
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
            ? `${franjasFiltradas.length} de ${horarios.length} franjas`
            : `${horarios.length} ${horarios.length === 1 ? 'franja' : 'franjas'}`}
        </p>
      </div>

      {error ? null : cargando ? (
        <EsqueletoLista />
      ) : sinProfesionales ? (
        <div className={page.vacio}>
          <h2 className={page.vacioTitulo}>Primero registra al equipo</h2>
          <p className={page.vacioTexto}>
            Los horarios pertenecen a una profesional. Crea el perfil y vuelve aquí para
            definir sus franjas.
          </p>
          <div className={page.vacioAcciones}>
            <Link className={styles.enlaceVacio} to="/admin/profesionales">
              Ir a Profesionales
            </Link>
          </div>
        </div>
      ) : horarios.length === 0 ? (
        <div className={page.vacio}>
          <h2 className={page.vacioTitulo}>La agenda está vacía</h2>
          <p className={page.vacioTexto}>
            Agrega la primera franja semanal para que el atelier tenga horario de
            atención.
          </p>
          <div className={page.vacioAcciones}>
            <Boton variante="primario" onClick={abrirNueva}>
              Crear horario
            </Boton>
          </div>
        </div>
      ) : grupos.length === 0 ? (
        <div className={`${page.vacio} ${page.vacioCompacto}`}>
          <h2 className={page.vacioTitulo}>Ninguna franja coincide</h2>
          <p className={page.vacioTexto}>
            Cambia la profesional o el día para ver otras franjas de la agenda.
          </p>
          <div className={page.vacioAcciones}>
            <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
          </div>
        </div>
      ) : (
        <div className={styles.grupos}>
          {grupos.map((grupo) => (
            <section className={styles.grupo} key={grupo.id}>
              <header className={styles.grupoCabecera}>
                <h2 className={styles.grupoNombre}>{grupo.nombre}</h2>
                <span className={styles.grupoConteo}>
                  {grupo.franjas.length}{' '}
                  {grupo.franjas.length === 1 ? 'franja semanal' : 'franjas semanales'}
                </span>
                {!grupo.existe && (
                  <span className={styles.grupoHuerfano}>
                    Perfil eliminado: borra estas franjas
                  </span>
                )}
              </header>

              <ul className={styles.lista}>
                {grupo.franjas.map((horario) => (
                  <li className={styles.franja} key={horario._id}>
                    <span className={styles.dia}>{nombreDia(horario.diaSemana)}</span>
                    <span className={styles.horas}>
                      {formatearFranja(horario.horaInicio, horario.horaFin)}
                    </span>
                    <span className={styles.duracion}>
                      {formatearDuracionFranja(horario.horaInicio, horario.horaFin)}
                    </span>
                    <div className={styles.acciones}>
                      <Boton
                        tamano="sm"
                        variante="fantasma"
                        onClick={() => abrirEditar(horario)}
                      >
                        Editar
                      </Boton>
                      <Boton
                        tamano="sm"
                        variante="peligroSuave"
                        onClick={() => setPorEliminar(horario)}
                      >
                        Eliminar
                      </Boton>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {formulario && (
        <HorarioFormulario
          horario={formulario.horario}
          profesionales={profesionales}
          horarios={horarios}
          onGuardar={guardar}
          onCerrar={cerrarFormulario}
        />
      )}

      {porEliminar && (
        <Confirmacion
          titulo="Eliminar horario"
          textoConfirmar="Eliminar franja"
          cargando={eliminando}
          onConfirmar={confirmarEliminar}
          onCerrar={cerrarConfirmacion}
        >
          <p>
            Vas a eliminar la franja del <strong>{nombreDia(porEliminar.diaSemana)}</strong>{' '}
            entre <strong>{formatearFranja(porEliminar.horaInicio, porEliminar.horaFin)}</strong>.
            La profesional dejará de tener disponibilidad en ese rango.
          </p>
        </Confirmacion>
      )}
    </div>
  );
}
