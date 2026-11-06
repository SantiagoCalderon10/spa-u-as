import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aviso from '../../components/admin/Aviso';
import Boton from '../../components/admin/Boton';
import CalendarioFiltroCitas from '../../components/admin/CalendarioFiltroCitas';
import CancelarCitaFormulario from '../../components/admin/CancelarCitaFormulario';
import Confirmacion from '../../components/admin/Confirmacion';
import ReprogramarCitaFormulario from '../../components/admin/ReprogramarCitaFormulario';
import { useCitas } from '../../hooks/useCitas';
import { inicialesDe } from '../../utils/agenda';
import { formatearPrecio, mensajeDeError } from '../../utils/catalogo';
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
  nombreProfesionalDeCita,
  nombreServicioDeCita,
  precioServicioDeCita,
  resumenHorarioCita,
  telefonoClienteDeCita,
  textoBuscableDeCita,
} from '../../utils/citas';
import {
  etiquetaEstado,
  formatearFechaCita,
  formatearFechaLarga,
  formatearHora,
} from '../../utils/reserva';
import page from './AdminPage.module.css';
import styles from './CitasAdmin.module.css';

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

function IconoCalendario() {
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
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function IconoReprogramar() {
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
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function IconoCompletar() {
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
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function IconoNoAsistio() {
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
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4 20c0-3.2 2.7-5.4 6-5.4 1.2 0 2.3.3 3.2.8" />
      <path d="m16 16 5 5M21 16l-5 5" />
    </svg>
  );
}

function IconoCancelar() {
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
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

function EsqueletoTabla() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, indice) => (
        <tr className={styles.filaEsqueleto} key={indice} aria-hidden="true">
          <td>
            <span className={styles.esqueletoTextos}>
              <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
              <span className={`${page.esqueleto} ${styles.esqueletoCorto}`} />
            </span>
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoCorto}`} />
          </td>
          <td>
            <span className={`${page.esqueleto} ${styles.esqueletoNombre}`} />
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

export default function CitasAdminPage() {
  const {
    citas,
    cargando,
    error,
    recargar,
    cancelar,
    reprogramar,
    completar,
    marcarNoAsistio,
  } = useCitas();
  const navegar = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todas');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [reprogramando, setReprogramando] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [porNoAsistir, setPorNoAsistir] = useState(null);
  const [accion, setAccion] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);

  const hoy = claveDeHoy();
  const total = citas.length;
  const confirmadas = citas.filter((cita) => cita.estado === 'confirmada').length;
  const deHoy = citas.filter((cita) => esCitaDeHoy(cita, hoy)).length;
  const completadas = citas.filter((cita) => cita.estado === 'completada').length;

  const conteoPorDia = useMemo(() => {
    const mapa = new Map();
    citas.forEach((cita) => {
      const clave = claveFechaDeCita(cita);
      if (!clave) return;
      mapa.set(clave, (mapa.get(clave) ?? 0) + 1);
    });
    return mapa;
  }, [citas]);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const hoyClave = claveDeHoy();
    const limiteSemana = claveDentroDe(7);

    const lista = citas.filter((cita) => {
      if (termino && !textoBuscableDeCita(cita).includes(termino)) return false;
      if (filtroEstado !== 'todos' && cita.estado !== filtroEstado) return false;

      if (fechaSeleccionada && claveFechaDeCita(cita) !== fechaSeleccionada) return false;

      if (filtroFecha === 'proximas' && !esCitaFutura(cita, hoyClave)) return false;
      if (filtroFecha === 'hoy' && !esCitaDeHoy(cita, hoyClave)) return false;
      if (filtroFecha === 'semana' && !esCitaDeLosProximosDias(cita, hoyClave, limiteSemana)) {
        return false;
      }

      return true;
    });

    // La agenda siempre se lee en orden cronológico: primero la fecha y,
    // dentro del mismo día, la hora de inicio.
    return lista.sort((a, b) => {
      const claveA = `${claveFechaDeCita(a)}T${a.horaInicio || '00:00'}`;
      const claveB = `${claveFechaDeCita(b)}T${b.horaInicio || '00:00'}`;
      return claveA.localeCompare(claveB);
    });
  }, [citas, busqueda, filtroEstado, filtroFecha, fechaSeleccionada]);

  const hayFiltros =
    busqueda.trim() !== '' ||
    filtroEstado !== 'todos' ||
    filtroFecha !== 'todas' ||
    fechaSeleccionada !== '';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todos');
    setFiltroFecha('todas');
    setFechaSeleccionada('');
  };

  /** El calendario funciona como filtro conmutador del día elegido. */
  const alternarFecha = (clave) => {
    setFechaSeleccionada((actual) => (actual === clave ? '' : clave));
    setFiltroFecha('todas');
  };

  /** Los dos controles de fecha no se contradicen entre sí. */
  const cambiarFiltroFecha = (valor) => {
    setFiltroFecha(valor);
    if (valor !== 'todas') setFechaSeleccionada('');
  };

  const ejecutar = useCallback(async (cita, tipo, operacion, mensaje) => {
    setAccion({ id: cita._id, tipo });

    try {
      await operacion();
      setAviso({ tipo: 'exito', mensaje });
    } catch (err) {
      setAviso({
        tipo: 'error',
        mensaje: mensajeDeError(err, 'No pudimos actualizar la cita.'),
      });
    } finally {
      setAccion(null);
    }
  }, []);

  const completarCita = (cita) => {
    ejecutar(
      cita,
      'completar',
      () => completar(cita._id),
      `La cita de ${nombreClienteDeCita(cita)} quedó marcada como completada.`
    );
  };

  const confirmarNoAsistio = async () => {
    if (!porNoAsistir) return;

    const cita = porNoAsistir;
    await ejecutar(
      cita,
      'noAsistio',
      () => marcarNoAsistio(cita._id),
      `La cita de ${nombreClienteDeCita(cita)} quedó marcada como no asistida.`
    );
    setPorNoAsistir(null);
  };

  const guardarReprogramacion = async (datos) => {
    if (!reprogramando) return;

    const cita = reprogramando;
    await reprogramar(cita._id, datos);

    const cuando = `${formatearFechaCita(datos.nuevaFecha)} a las ${formatearHora(
      datos.nuevaHoraInicio
    )}`;

    setAviso({
      tipo: 'exito',
      mensaje: `La cita de ${nombreClienteDeCita(cita)} quedó reprogramada para el ${cuando}.`,
    });
    setReprogramando(null);
  };

  const guardarCancelacion = async (motivo) => {
    if (!cancelando) return;

    const cita = cancelando;
    await cancelar(cita._id, motivo);

    setAviso({
      tipo: 'exito',
      mensaje: `La cita de ${nombreClienteDeCita(cita)} quedó cancelada.`,
    });
    setCancelando(null);
  };

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>AGENDA DEL ATELIER</h1>
          <p className={page.intro}>
            Revisa las citas, reprograma horarios y cierra cada servicio.
          </p>
        </div>

        <Boton variante="secundario" onClick={() => navegar('/reservar')}>
          <IconoCalendario />
          Agendar cita
        </Boton>
      </header>

      <dl className={page.resumen} aria-label="Resumen de citas">
        <div className={page.resumenItem}>
          <dt>Total</dt>
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
          <dt>Completadas</dt>
          <dd>{completadas}</dd>
        </div>
      </dl>

      <Aviso tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={cerrarAviso} />

      {error && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos sincronizar la agenda.</strong>
            <p>{error}</p>
          </div>
          <Boton tamano="sm" onClick={recargar}>
            Reintentar
          </Boton>
        </div>
      )}

      <section
        className={`${styles.panel} ${styles.panelAgenda}`}
        aria-label="Agenda de citas del atelier"
      >
        <aside className={styles.columnaCalendario} aria-label="Calendario de la agenda">
          <CalendarioFiltroCitas
            valor={fechaSeleccionada}
            onElegir={alternarFecha}
            conteoPorDia={conteoPorDia}
          />
        </aside>

        <div className={styles.herramientas}>
          <div className={styles.busqueda}>
            <IconoBuscar />
            <input
              type="search"
              className={styles.entradaBusqueda}
              placeholder="Buscar por cliente, teléfono, servicio o profesional"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar citas"
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
              onChange={(evento) => cambiarFiltroFecha(evento.target.value)}
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

          {fechaSeleccionada && (
            <span className={styles.etiquetaFiltroFecha}>
              <IconoCalendario />
              {formatearFechaLarga(fechaSeleccionada)}
              <button
                type="button"
                className={styles.etiquetaFiltroFechaBoton}
                onClick={() => setFechaSeleccionada('')}
                aria-label={`Quitar el filtro del ${formatearFechaLarga(fechaSeleccionada)}`}
                title="Quitar filtro de fecha"
              >
                ×
              </button>
            </span>
          )}

          <p className={styles.resultado} aria-live="polite">
            {hayFiltros
              ? `${filtrados.length} de ${total} citas`
              : `${total} ${total === 1 ? 'cita' : 'citas'}`}
          </p>
        </div>

        {error ? null : cargando ? (
          <>
            <p className={page.srOnly} role="status">
              Cargando citas…
            </p>
            <div className={styles.tablaEnvoltura}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th scope="col">Cita</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Servicio</th>
                    <th scope="col">Profesional</th>
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
        ) : total === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={page.vacio}>
              <h2 className={page.vacioTitulo}>Todavía no hay citas</h2>
              <p className={page.vacioTexto}>
                Cuando una clienta agende desde la página pública, su cita aparecerá aquí
                para que puedas gestionarla.
              </p>
              <div className={page.vacioAcciones}>
                <Boton variante="primario" onClick={() => navegar('/reservar')}>
                  Ir al agendamiento
                </Boton>
              </div>
            </div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className={styles.vacioPanel}>
            <div className={`${page.vacio} ${page.vacioCompacto}`}>
              <h2 className={page.vacioTitulo}>
                {fechaSeleccionada ? 'Sin citas ese día' : 'Ninguna cita coincide'}
              </h2>
              <p className={page.vacioTexto}>
                {fechaSeleccionada
                  ? `No hay citas agendadas el ${formatearFechaLarga(
                      fechaSeleccionada
                    )}. Elige otro día en el calendario o vuelve a la agenda completa.`
                  : 'Prueba con otro término o quita los filtros para ver la agenda completa.'}
              </p>
              <div className={page.vacioAcciones}>
                <Boton onClick={limpiarFiltros}>
                  {fechaSeleccionada ? 'Ver toda la agenda' : 'Limpiar filtros'}
                </Boton>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tablaEnvoltura}>
            <table className={styles.tabla}>
              <caption className={page.srOnly}>Citas agendadas en el atelier</caption>
              <thead>
                <tr>
                  <th scope="col">Cita</th>
                  <th scope="col">Clienta</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Profesional</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className={styles.colAcciones}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((cita) => {
                  const estado = etiquetaEstado(cita.estado);
                  const claseEstado = CLASES_ESTADO[estado.tono] ?? styles.estadoNeutro;
                  const nombre = nombreClienteDeCita(cita);
                  const telefono = telefonoClienteDeCita(cita);
                  const confirmada = cita.estado === 'confirmada';
                  const ocupada = accion?.id === cita._id;

                  return (
                    <tr className={styles.fila} key={cita._id}>
                      <th scope="row" className={styles.celdaCita}>
                        <span className={styles.fecha}>{formatearFechaCita(cita.fecha)}</span>
                        <span className={styles.hora}>{resumenHorarioCita(cita)}</span>
                      </th>

                      <td data-etiqueta="Clienta">
                        <div className={styles.persona}>
                          <span className={styles.avatar} aria-hidden="true">
                            {inicialesDe(nombre)}
                          </span>
                          <span className={styles.personaTexto}>
                            <span className={styles.nombre}>{nombre}</span>
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
                      </td>

                      <td data-etiqueta="Servicio">
                        <span className={styles.celdaContenido}>
                          <span className={styles.servicio}>{nombreServicioDeCita(cita)}</span>
                          <span className={styles.precio}>
                            {formatearPrecio(precioServicioDeCita(cita))}
                          </span>
                        </span>
                      </td>

                      <td data-etiqueta="Profesional">
                        <span className={styles.profesional}>
                          {nombreProfesionalDeCita(cita)}
                        </span>
                      </td>

                      <td data-etiqueta="Estado">
                        <span className={styles.celdaContenido}>
                          <span className={`${styles.estadoBadge} ${claseEstado}`}>
                            <span className={styles.punto} aria-hidden="true" />
                            {estado.etiqueta}
                          </span>
                          {cita.estado === 'cancelada' && cita.motivoCancelacion && (
                            <span className={styles.motivo} title={cita.motivoCancelacion}>
                              {cita.motivoCancelacion}
                            </span>
                          )}
                        </span>
                      </td>

                      <td className={styles.celdaAcciones}>
                        {confirmada ? (
                          <div className={styles.acciones}>
                            <Boton
                              tamano="sm"
                              variante="fantasma"
                              className={styles.botonIcono}
                              onClick={() => setReprogramando(cita)}
                              disabled={ocupada}
                              aria-label={`Reprogramar la cita de ${nombre}`}
                              title="Reprogramar"
                            >
                              <IconoReprogramar />
                            </Boton>
                            <Boton
                              tamano="sm"
                              variante="fantasma"
                              className={styles.botonIcono}
                              onClick={() => completarCita(cita)}
                              cargando={ocupada && accion.tipo === 'completar'}
                              disabled={ocupada && accion.tipo !== 'completar'}
                              aria-label={`Marcar como completada la cita de ${nombre}`}
                              title="Marcar como completada"
                            >
                              {!(ocupada && accion.tipo === 'completar') && <IconoCompletar />}
                            </Boton>
                            <Boton
                              tamano="sm"
                              variante="fantasma"
                              className={styles.botonIcono}
                              onClick={() => setPorNoAsistir(cita)}
                              disabled={ocupada}
                              aria-label={`Marcar como no asistió la cita de ${nombre}`}
                              title="Marcar como no asistió"
                            >
                              <IconoNoAsistio />
                            </Boton>
                            <Boton
                              tamano="sm"
                              variante="peligroSuave"
                              className={`${styles.botonIcono} ${styles.botonIconoPeligro}`}
                              onClick={() => setCancelando(cita)}
                              disabled={ocupada}
                              aria-label={`Cancelar la cita de ${nombre}`}
                              title="Cancelar cita"
                            >
                              <IconoCancelar />
                            </Boton>
                          </div>
                        ) : (
                          <span className={styles.sinAcciones}>Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {reprogramando && (
        <ReprogramarCitaFormulario
          cita={reprogramando}
          onGuardar={guardarReprogramacion}
          onCerrar={() => setReprogramando(null)}
        />
      )}

      {cancelando && (
        <CancelarCitaFormulario
          cita={cancelando}
          onGuardar={guardarCancelacion}
          onCerrar={() => setCancelando(null)}
        />
      )}

      {porNoAsistir && (
        <Confirmacion
          titulo="Marcar como no asistió"
          textoConfirmar="Marcar no asistió"
          cargando={accion?.id === porNoAsistir._id && accion?.tipo === 'noAsistio'}
          onConfirmar={confirmarNoAsistio}
          onCerrar={() => setPorNoAsistir(null)}
        >
          <p>
            La cita de <strong>{nombreClienteDeCita(porNoAsistir)}</strong> del{' '}
            {formatearFechaCita(porNoAsistir.fecha)} quedará marcada como{' '}
            <strong>no asistió</strong>.
          </p>
        </Confirmacion>
      )}
    </div>
  );
}
