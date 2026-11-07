import { useCallback, useMemo, useState } from 'react';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import CancelarCitaFormulario from '../../components/admin/CancelarCitaFormulario';
import { useCitasProfesional } from '../../hooks/useCitasProfesional';
import { useHorarios } from '../../hooks/useHorarios';
import { useMiPerfilProfesional } from '../../hooks/useMiPerfilProfesional';
import {
  DIAS_SEMANA,
  aMinutos,
  duracionFranja,
  formatearDuracionFranja,
  formatearFranja,
  inicialesDe,
} from '../../utils/agenda';
import { formatearPrecio } from '../../utils/catalogo';
import {
  claveDeHoy,
  claveDentroDe,
  claveFechaDeCita,
  esCitaDeHoy,
  esCitaDeLosProximosDias,
  esCitaFutura,
  FILTROS_ESTADO_CITA,
  FILTROS_FECHA_CITA,
  nombreClienteDeCita,
  nombreServicioDeCita,
  precioServicioDeCita,
  resumenHorarioCita,
  telefonoClienteDeCita,
  textoBuscableDeCita,
} from '../../utils/citas';
import { etiquetaEstado, formatearFechaLarga, formatearHora } from '../../utils/reserva';
import page from '../admin/AdminPage.module.css';
import styles from './AgendaProfesional.module.css';

const CLASES_ESTADO = {
  confirmada: styles.estadoConfirmada,
  cancelada: styles.estadoCancelada,
  completada: styles.estadoCompletada,
  noAsistio: styles.estadoNoAsistio,
  neutro: styles.estadoNeutro,
};

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

function IconoReloj() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function EsqueletoHorario() {
  return (
    <div className={styles.esqueletoSemana} aria-hidden="true">
      {Array.from({ length: 7 }).map((_, indice) => (
        <span className={`${page.esqueleto} ${styles.esqueletoDia}`} key={indice} />
      ))}
    </div>
  );
}

function EsqueletoCitas() {
  return (
    <div className={styles.esqueletoCitas} aria-hidden="true">
      {Array.from({ length: 3 }).map((_, indice) => (
        <span className={`${page.esqueleto} ${styles.esqueletoCita}`} key={indice} />
      ))}
    </div>
  );
}

export default function AgendaProfesionalPage() {
  const {
    perfil,
    cargando: cargandoPerfil,
    error: errorPerfil,
    recargar: recargarPerfil,
  } = useMiPerfilProfesional();

  const idProfesional = perfil?._id;
  const {
    horarios,
    cargando: cargandoHorarios,
    error: errorHorarios,
    recargar: recargarHorarios,
  } = useHorarios({ idProfesional, activo: Boolean(idProfesional) });

  const {
    citas,
    cargando: cargandoCitas,
    error: errorCitas,
    recargar: recargarCitas,
    cancelar,
  } = useCitasProfesional();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todas');
  const [cancelando, setCancelando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);

  const hoy = claveDeHoy();
  const total = citas.length;
  const confirmadas = citas.filter((cita) => cita.estado === 'confirmada').length;
  const deHoy = citas.filter((cita) => esCitaDeHoy(cita, hoy)).length;

  const minutosSemanales = horarios.reduce(
    (acumulado, horario) =>
      acumulado + Math.max(duracionFranja(horario.horaInicio, horario.horaFin), 0),
    0
  );

  const diasConHorario = useMemo(() => {
    const mapa = new Map(DIAS_SEMANA.map((dia) => [dia.valor, []]));

    horarios.forEach((horario) => {
      const dia = Number(horario.diaSemana);
      if (mapa.has(dia)) mapa.get(dia).push(horario);
    });

    return DIAS_SEMANA.map((dia) => ({
      ...dia,
      franjas: [...mapa.get(dia.valor)].sort(
        (a, b) => aMinutos(a.horaInicio) - aMinutos(b.horaInicio)
      ),
    }));
  }, [horarios]);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const hoyClave = claveDeHoy();
    const limiteSemana = claveDentroDe(7);

    return citas
      .filter((cita) => {
        if (termino && !textoBuscableDeCita(cita).includes(termino)) return false;
        if (filtroEstado !== 'todos' && cita.estado !== filtroEstado) return false;

        if (filtroFecha === 'proximas' && !esCitaFutura(cita, hoyClave)) return false;
        if (filtroFecha === 'hoy' && !esCitaDeHoy(cita, hoyClave)) return false;
        if (filtroFecha === 'semana' && !esCitaDeLosProximosDias(cita, hoyClave, limiteSemana)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const claveA = `${claveFechaDeCita(a)}T${a.horaInicio || '00:00'}`;
        const claveB = `${claveFechaDeCita(b)}T${b.horaInicio || '00:00'}`;
        return claveA.localeCompare(claveB);
      });
  }, [citas, busqueda, filtroEstado, filtroFecha]);

  const grupos = useMemo(() => {
    const mapa = new Map();

    filtrados.forEach((cita) => {
      const clave = claveFechaDeCita(cita);
      if (!mapa.has(clave)) mapa.set(clave, []);
      mapa.get(clave).push(cita);
    });

    return [...mapa.entries()]
      .map(([clave, lista]) => ({
        clave,
        fecha: formatearFechaLarga(clave),
        esHoy: clave === hoy,
        citas: [...lista].sort((a, b) =>
          String(a.horaInicio || '').localeCompare(String(b.horaInicio || ''))
        ),
      }))
      .sort((a, b) => a.clave.localeCompare(b.clave));
  }, [filtrados, hoy]);

  const hayFiltros =
    busqueda.trim() !== '' || filtroEstado !== 'todos' || filtroFecha !== 'todas';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todos');
    setFiltroFecha('todas');
  };

  const recargarTodo = useCallback(() => {
    recargarPerfil();
    recargarHorarios();
    recargarCitas();
  }, [recargarPerfil, recargarHorarios, recargarCitas]);

  const guardarCancelacion = async (motivo) => {
    if (!cancelando) return;

    const cita = cancelando;
    await cancelar(cita._id, motivo);

    setAviso({
      tipo: 'exito',
      mensaje: `La cita de ${nombreClienteDeCita(cita)} quedó cancelada.`,
    });
  };

  const nombrePerfil = perfil?.idUsuario?.nombrecompleto;
  const hayError = errorPerfil || errorHorarios || errorCitas;

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>MI AGENDA</h1>
          <p className={page.intro}>
            {nombrePerfil
              ? `Hola, ${nombrePerfil}. Consulta tu horario semanal y las citas que tienes asignadas.`
              : 'Consulta tu horario semanal y las citas que tienes asignadas.'}
          </p>
        </div>

        <Boton variante="secundario" onClick={recargarTodo} cargando={cargandoPerfil}>
          <IconoReloj />
          Actualizar
        </Boton>
      </header>

      <dl className={page.resumen} aria-label="Resumen de mi agenda">
        <div className={page.resumenItem}>
          <dt>Mis citas</dt>
          <dd>{total}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Confirmadas</dt>
          <dd>{confirmadas}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Hoy</dt>
          <dd>{deHoy}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Horas por semana</dt>
          <dd>
            {minutosSemanales > 0
              ? `${Math.round((minutosSemanales / 60) * 10) / 10} h`
              : '—'}
          </dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {hayError && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar tu agenda.</strong>
            <p>{errorPerfil || errorHorarios || errorCitas}</p>
          </div>
          <Boton tamano="sm" onClick={recargarTodo}>
            Reintentar
          </Boton>
        </div>
      )}

      <section className={styles.panel} aria-label="Mi horario semanal">
        <header className={styles.panelCabecera}>
          <div>
            <h2 className={styles.panelTitulo}>Horario semanal</h2>
            <p className={styles.panelTexto}>
              Estas son las franjas que administración definió para ti.
            </p>
          </div>
          <span className={styles.panelMeta}>
            {horarios.length} {horarios.length === 1 ? 'franja' : 'franjas'}
          </span>
        </header>

        {cargandoPerfil || cargandoHorarios ? (
          <EsqueletoHorario />
        ) : horarios.length === 0 ? (
          <div className={styles.vacioPanel}>
            <p className={styles.vacioTexto}>
              Todavía no tienes horario asignado. Pídele a administración que registre tus
              franjas semanales.
            </p>
          </div>
        ) : (
          <ul className={styles.semana}>
            {diasConHorario.map((dia) => (
              <li
                className={`${styles.dia} ${dia.franjas.length === 0 ? styles.diaLibre : ''}`}
                key={dia.valor}
              >
                <span className={styles.diaNombre}>{dia.etiqueta}</span>

                <div className={styles.franjas}>
                  {dia.franjas.length === 0 ? (
                    <span className={styles.libre}>Libre</span>
                  ) : (
                    dia.franjas.map((franja) => (
                      <span className={styles.franja} key={franja._id}>
                        <span className={styles.franjaHoras}>
                          {formatearFranja(franja.horaInicio, franja.horaFin)}
                        </span>
                        <span className={styles.franjaDuracion}>
                          {formatearDuracionFranja(franja.horaInicio, franja.horaFin)}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel} aria-label="Mis citas">
        <header className={styles.panelCabecera}>
          <div>
            <h2 className={styles.panelTitulo}>Mis citas</h2>
            <p className={styles.panelTexto}>
              Solo ves las citas asignadas a tu agenda. Puedes cancelar una cita confirmada
              dejando el motivo.
            </p>
          </div>
          <span className={styles.panelMeta}>
            {total} {total === 1 ? 'cita' : 'citas'}
          </span>
        </header>

        <div className={styles.herramientas}>
          <div className={styles.busqueda}>
            <IconoBuscar />
            <input
              type="search"
              className={styles.entradaBusqueda}
              placeholder="Buscar por clienta, teléfono o servicio"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar mis citas"
            />
          </div>

          <div className={styles.selector}>
            <select
              className={styles.select}
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              aria-label="Filtrar por estado"
            >
              {FILTROS_ESTADO_CITA.map((filtro) => (
                <option key={filtro.valor} value={filtro.valor}>
                  {filtro.etiqueta}
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
              value={filtroFecha}
              onChange={(evento) => setFiltroFecha(evento.target.value)}
              aria-label="Filtrar por fecha"
            >
              {FILTROS_FECHA_CITA.map((filtro) => (
                <option key={filtro.valor} value={filtro.valor}>
                  {filtro.etiqueta}
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

          <p className={styles.resultado} aria-live="polite">
            {hayFiltros
              ? `${filtrados.length} de ${total} citas`
              : `${total} ${total === 1 ? 'cita' : 'citas'}`}
          </p>
        </div>

        {errorCitas ? null : cargandoCitas ? (
          <>
            <p className={page.srOnly} role="status">
              Cargando citas…
            </p>
            <EsqueletoCitas />
          </>
        ) : total === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={page.vacio}>
              <h2 className={page.vacioTitulo}>Todavía no tienes citas</h2>
              <p className={page.vacioTexto}>
                Cuando una clienta agende contigo, su cita aparecerá aquí agrupada por día.
              </p>
            </div>
          </div>
        ) : grupos.length === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={`${page.vacio} ${page.vacioCompacto}`}>
              <h2 className={page.vacioTitulo}>Ninguna cita coincide</h2>
              <p className={page.vacioTexto}>
                Prueba con otro término o quita los filtros para ver todas tus citas.
              </p>
              <div className={page.vacioAcciones}>
                <Boton onClick={limpiarFiltros}>Limpiar filtros</Boton>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.grupos}>
            {grupos.map((grupo) => (
              <section className={styles.grupo} key={grupo.clave}>
                <header className={styles.grupoCabecera}>
                  <h3 className={styles.grupoFecha}>{grupo.fecha}</h3>
                  {grupo.esHoy && <span className={styles.hoyBadge}>Hoy</span>}
                  <span className={styles.grupoConteo}>
                    {grupo.citas.length} {grupo.citas.length === 1 ? 'cita' : 'citas'}
                  </span>
                </header>

                <ul className={styles.listaCitas}>
                  {grupo.citas.map((cita) => {
                    const estado = etiquetaEstado(cita.estado);
                    const claseEstado = CLASES_ESTADO[estado.tono] ?? styles.estadoNeutro;
                    const nombre = nombreClienteDeCita(cita);
                    const telefono = telefonoClienteDeCita(cita);
                    const confirmada = cita.estado === 'confirmada';

                    return (
                      <li className={styles.cita} key={cita._id}>
                        <div className={styles.citaHora}>
                          <span className={styles.horaInicio}>
                            {formatearHora(cita.horaInicio)}
                          </span>
                          <span className={styles.horaFin}>
                            hasta {formatearHora(cita.horaFin)}
                          </span>
                        </div>

                        <div className={styles.citaPersona}>
                          <span className={styles.avatar} aria-hidden="true">
                            {inicialesDe(nombre)}
                          </span>
                          <span className={styles.personaTexto}>
                            <span className={styles.citaNombre}>{nombre}</span>
                            {telefono ? (
                              <a
                                className={styles.telefono}
                                href={`tel:${telefono.replace(/\s+/g, '')}`}
                              >
                                {telefono}
                              </a>
                            ) : (
                              <span className={styles.telefono}>Sin teléfono</span>
                            )}
                          </span>
                        </div>

                        <div className={styles.citaServicio}>
                          <span className={styles.servicio}>{nombreServicioDeCita(cita)}</span>
                          <span className={styles.precio}>
                            {formatearPrecio(precioServicioDeCita(cita))}
                          </span>
                          <span className={styles.resumenHora}>
                            {resumenHorarioCita(cita)}
                          </span>
                        </div>

                        <div className={styles.citaEstado}>
                          <span className={`${styles.badge} ${claseEstado}`}>
                            <span className={styles.punto} aria-hidden="true" />
                            {estado.etiqueta}
                          </span>
                          {cita.estado === 'cancelada' && cita.motivoCancelacion && (
                            <span className={styles.motivo} title={cita.motivoCancelacion}>
                              {cita.motivoCancelacion}
                            </span>
                          )}
                        </div>

                        <div className={styles.citaAcciones}>
                          {confirmada ? (
                            <Boton
                              tamano="sm"
                              variante="peligroSuave"
                              onClick={() => setCancelando(cita)}
                            >
                              Cancelar
                            </Boton>
                          ) : (
                            <span className={styles.sinAcciones}>Sin acciones</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>

      {cancelando && (
        <CancelarCitaFormulario
          cita={cancelando}
          onGuardar={guardarCancelacion}
          onCerrar={() => setCancelando(null)}
        />
      )}
    </div>
  );
}
