import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { crearCitaPublica, obtenerDisponibilidad } from '../../api/citaService';
import { getHorarios } from '../../api/horarioService';
import { useProfesionales } from '../../hooks/useProfesionales';
import { useServicios } from '../../hooks/useServicios';
import { inicialesDe, nombreDeProfesional } from '../../utils/agenda';
import { formatearDuracion, formatearPrecio, mensajeDeError } from '../../utils/catalogo';
import {
  claveFecha,
  enlaceWhatsApp,
  fechaDesdeClaveLocal,
  filtrarSlotsFuturos,
  formatearFechaLarga,
  formatearHora,
  mensajeEnlaceCita,
  profesionalesParaServicio,
  telefonoParaWhatsApp,
} from '../../utils/reserva';
import styles from './Reserva.module.css';

const PASOS = ['Servicio', 'Profesional y hora', 'Tus datos'];

function IconoCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES_LARGOS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MESES_A_FUTURO = 12;

function inicioDeMes(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

function mismoMes(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function hoyLocal() {
  const valor = new Date();
  valor.setHours(0, 0, 0, 0);
  return valor;
}

/** Calendario mensual navegable para elegir la fecha de la cita. */
function CalendarioFechas({ valor, onElegir, diasAtencion }) {
  const [hoy] = useState(hoyLocal);
  const [mesVisible, setMesVisible] = useState(() =>
    inicioDeMes(fechaDesdeClaveLocal(valor) ?? hoy)
  );

  useEffect(() => {
    const elegida = fechaDesdeClaveLocal(valor);
    if (!elegida) return;
    setMesVisible((actual) => (mismoMes(actual, elegida) ? actual : inicioDeMes(elegida)));
  }, [valor]);

  const limite = useMemo(
    () => new Date(hoy.getFullYear(), hoy.getMonth() + MESES_A_FUTURO, 1),
    [hoy]
  );

  const celdas = useMemo(() => {
    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();
    const desplazamiento = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const totalDias = new Date(anio, mes + 1, 0).getDate();

    const lista = Array.from({ length: desplazamiento }, () => null);
    for (let dia = 1; dia <= totalDias; dia += 1) {
      lista.push(new Date(anio, mes, dia, 12, 0, 0, 0));
    }
    while (lista.length % 7 !== 0) lista.push(null);

    return lista;
  }, [mesVisible]);

  const puedeAnterior = mesVisible.getTime() > inicioDeMes(hoy).getTime();
  const puedeSiguiente = mesVisible.getTime() < limite.getTime();

  function moverMes(delta) {
    setMesVisible((actual) => new Date(actual.getFullYear(), actual.getMonth() + delta, 1));
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHead}>
        <button
          type="button"
          className={styles.calendarNav}
          onClick={() => moverMes(-1)}
          disabled={!puedeAnterior}
          aria-label="Mes anterior"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <p className={styles.calendarMonth} aria-live="polite">
          {MESES_LARGOS[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </p>
        <button
          type="button"
          className={styles.calendarNav}
          onClick={() => moverMes(1)}
          disabled={!puedeSiguiente}
          aria-label="Mes siguiente"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className={styles.calendarGrid} role="radiogroup" aria-label="Fecha de la cita">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia} className={styles.calendarWeek} aria-hidden="true">
            {dia}
          </span>
        ))}

        {celdas.map((celda, indice) => {
          if (!celda) {
            return <span key={`vacio-${indice}`} className={styles.calendarVoid} aria-hidden="true" />;
          }

          const clave = claveFecha(celda);
          const activo = clave === valor;
          const esHoy = celda.getTime() === hoy.getTime();
          const pasado = celda.getTime() < hoy.getTime();
          const sinAtencion =
            Array.isArray(diasAtencion) && !diasAtencion.includes(celda.getDay());
          const deshabilitado = pasado || sinAtencion;

          const clase = [
            styles.calendarDay,
            esHoy ? styles.calendarDayToday : '',
            activo ? styles.calendarDayActive : '',
            sinAtencion ? styles.calendarDayOff : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={clave}
              type="button"
              role="radio"
              aria-checked={activo}
              aria-label={
                sinAtencion
                  ? `${formatearFechaLarga(clave)} (sin atención)`
                  : formatearFechaLarga(clave)
              }
              className={clase}
              disabled={deshabilitado}
              onClick={() => onElegir(clave)}
            >
              {celda.getDate()}
            </button>
          );
        })}
      </div>

      <p className={styles.calendarHint}>
        {valor
          ? `Elegiste el ${formatearFechaLarga(valor)}.`
          : Array.isArray(diasAtencion) && diasAtencion.length === 0
            ? 'Esta profesional todavía no tiene horarios cargados.'
            : Array.isArray(diasAtencion)
              ? 'Los días en gris no tienen atención para esta profesional.'
              : 'Elige un día para ver los horarios libres.'}
      </p>
    </div>
  );
}

async function copiarTexto(texto) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Continuamos con el método alternativo.
  }

  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const copiado = document.execCommand('copy');
    document.body.removeChild(area);
    return copiado;
  } catch {
    return false;
  }
}

export default function ReservaPage() {
  const [parametros] = useSearchParams();
  const servicioInicial = parametros.get('servicio') || '';

  const { servicios, cargando: cargandoServicios, error: errorServicios, recargar: recargarServicios } = useServicios();
  const { profesionales, cargando: cargandoProfesionales, error: errorProfesionales, recargar: recargarProfesionales } = useProfesionales();

  const [paso, setPaso] = useState(1);
  const [idServicio, setIdServicio] = useState(servicioInicial);
  const [idProfesional, setIdProfesional] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const [disponibilidad, setDisponibilidad] = useState(null);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState('');
  const [diasAtencion, setDiasAtencion] = useState(null);

  const [cliente, setCliente] = useState({ nombre: '', telefono: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [resultado, setResultado] = useState(null);
  const [estadoCopia, setEstadoCopia] = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState('');

  const serviciosActivos = useMemo(
    () => servicios.filter((servicio) => servicio.activo !== false),
    [servicios]
  );

  const servicioSeleccionado = useMemo(
    () => serviciosActivos.find((servicio) => servicio._id === idServicio) ?? null,
    [serviciosActivos, idServicio]
  );

  const profesionalesFiltrados = useMemo(() => {
    if (mostrarTodas) return profesionales;
    return profesionalesParaServicio(profesionales, servicioSeleccionado);
  }, [profesionales, servicioSeleccionado, mostrarTodas]);

  const profesionalSeleccionado = useMemo(
    () => profesionales.find((profesional) => profesional._id === idProfesional) ?? null,
    [profesionales, idProfesional]
  );

  const slots = useMemo(
    () => filtrarSlotsFuturos(disponibilidad?.slots, fecha),
    [disponibilidad, fecha]
  );

  useEffect(() => {
    if (!idServicio || !idProfesional || !fecha) {
      setDisponibilidad(null);
      setErrorSlots('');
      setCargandoSlots(false);
      return undefined;
    }

    const control = new AbortController();
    setCargandoSlots(true);
    setErrorSlots('');
    setDisponibilidad(null);
    setHora('');

    obtenerDisponibilidad({ idProfesional, idServicio, fecha, signal: control.signal })
      .then((datos) => {
        if (!control.signal.aborted) setDisponibilidad(datos);
      })
      .catch((error) => {
        if (control.signal.aborted) return;
        setDisponibilidad(null);
        setErrorSlots(mensajeDeError(error, 'No pudimos consultar los horarios libres.'));
      })
      .finally(() => {
        if (!control.signal.aborted) setCargandoSlots(false);
      });

    return () => control.abort();
  }, [idServicio, idProfesional, fecha]);

  useEffect(() => {
    if (!idProfesional) {
      setDiasAtencion(null);
      return undefined;
    }

    const control = new AbortController();
    setDiasAtencion(null);

    getHorarios({ idProfesional, signal: control.signal })
      .then((datos) => {
        if (control.signal.aborted) return;
        const dias = (Array.isArray(datos) ? datos : [])
          .map((horario) => Number(horario.diaSemana))
          .filter((dia) => Number.isInteger(dia) && dia >= 0 && dia <= 6);
        setDiasAtencion(Array.from(new Set(dias)));
      })
      .catch(() => {
        // Si falla la consulta, el calendario no bloquea días por horario.
        if (!control.signal.aborted) setDiasAtencion(null);
      });

    return () => control.abort();
  }, [idProfesional]);

  useEffect(() => {
    if (!fecha || !Array.isArray(diasAtencion)) return;
    const dia = fechaDesdeClaveLocal(fecha)?.getDay();
    if (dia === undefined || dia === null) return;

    if (!diasAtencion.includes(dia)) {
      setFecha('');
      setHora('');
    }
  }, [diasAtencion, fecha]);

  function elegirServicio(id) {
    setIdServicio(id);
    setIdProfesional('');
    setFecha('');
    setHora('');
    setMostrarTodas(false);
  }

  function elegirProfesional(id) {
    setIdProfesional(id);
    setHora('');
    setDiasAtencion(null);
  }

  function elegirFecha(clave) {
    setFecha(clave);
    setHora('');
  }

  function validarCliente() {
    const nuevos = {};

    if (!cliente.nombre.trim()) {
      nuevos.nombre = 'Escribe tu nombre completo.';
    }

    const telefono = cliente.telefono.replace(/\D/g, '');
    if (telefono.length < 7 || telefono.length > 15) {
      nuevos.telefono = 'Usa un teléfono de 7 a 15 dígitos.';
    }

    return nuevos;
  }

  async function confirmarCita(evento) {
    evento.preventDefault();

    const nuevosErrores = validarCliente();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setErrorEnvio('');

    try {
      const respuesta = await crearCitaPublica({
        idProfesional,
        idServicio,
        fecha,
        horaInicio: hora,
        cliente: {
          nombre: cliente.nombre.trim(),
          telefono: cliente.telefono.replace(/\D/g, ''),
        },
      });

      setResultado({ enlaceToken: respuesta.enlaceToken, cita: respuesta.cita });
      setPaso(4);
    } catch (error) {
      setErrorEnvio(mensajeDeError(error, 'No pudimos agendar la cita. Intenta de nuevo.'));
    } finally {
      setEnviando(false);
    }
  }

  const enlaceCita = resultado?.enlaceToken
    ? `${window.location.origin}/cita/${resultado.enlaceToken}`
    : '';

  const mensajeCita = resultado
    ? mensajeEnlaceCita({
        nombre: cliente.nombre.trim().split(/\s+/)[0],
        servicio: servicioSeleccionado?.nombre,
        profesional: nombreDeProfesional(profesionalSeleccionado),
        fecha,
        hora,
        enlace: enlaceCita,
      })
    : '';

  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const puedeWhatsApp = telefonoParaWhatsApp(cliente.telefono).length >= 10;

  async function copiarEnlace() {
    if (!enlaceCita) return;
    const copiado = await copiarTexto(enlaceCita);
    setEstadoCopia(copiado ? 'copiado' : 'error');
  }

  function enviarPorWhatsApp() {
    if (!enlaceCita) return;
    const ventana = window.open(enlaceWhatsApp(cliente.telefono, mensajeCita), '_blank');
    setEstadoEnvio(ventana ? 'whatsapp' : 'error-whatsapp');
  }

  async function compartirEnlace() {
    if (!enlaceCita || !puedeCompartir) return;

    try {
      await navigator.share({
        title: 'Mi cita en Three Masters',
        text: mensajeCita,
      });
      setEstadoEnvio('compartido');
    } catch (error) {
      if (error?.name !== 'AbortError') setEstadoEnvio('error-compartir');
    }
  }

  const listoParaConfirmar = Boolean(idProfesional && fecha && hora);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Agenda en línea</p>
          <h1 className={styles.title}>Reserva tu próxima cita.</h1>
          <p className={styles.subtitle}>
            Elige el servicio, la profesional y el horario que mejor te quede. No necesitas crear una cuenta.
          </p>
        </header>

        {paso < 4 && (
          <ol className={styles.stepper} aria-label="Pasos de la reserva">
            {PASOS.map((etiqueta, indice) => {
              const numero = indice + 1;
              const clase =
                numero === paso
                  ? `${styles.step} ${styles.stepActive}`
                  : numero < paso
                    ? `${styles.step} ${styles.stepDone}`
                    : styles.step;

              return (
                <li key={etiqueta} className={clase} aria-current={numero === paso ? 'step' : undefined}>
                  <span className={styles.stepNumber}>{numero}</span>
                  {etiqueta}
                </li>
              );
            })}
          </ol>
        )}

        {paso === 1 && (
          <section className={styles.panel} aria-labelledby="paso-servicio">
            <div className={styles.panelHead}>
              <h2 id="paso-servicio" className={styles.panelTitle}>Elige tu servicio</h2>
              {servicioSeleccionado && (
                <p className={styles.panelHint}>
                  {formatearDuracion(servicioSeleccionado.duracion)} · {formatearPrecio(servicioSeleccionado.precio)}
                </p>
              )}
            </div>

            {cargandoServicios ? (
              <p className={styles.loading} role="status">Cargando servicios…</p>
            ) : errorServicios ? (
              <div className={`${styles.notice} ${styles.noticeError}`} role="alert">
                <p>{errorServicios}</p>
                <button type="button" className={styles.textLink} onClick={() => recargarServicios()}>
                  Reintentar
                </button>
              </div>
            ) : serviciosActivos.length === 0 ? (
              <p className={styles.empty}>
                Todavía no hay servicios publicados. Comunícate con el salón para agendar tu cita.
              </p>
            ) : (
              <div className={styles.serviceGrid} role="radiogroup" aria-label="Servicios disponibles">
                {serviciosActivos.map((servicio) => {
                  const activo = servicio._id === idServicio;

                  return (
                    <button
                      key={servicio._id}
                      type="button"
                      role="radio"
                      aria-checked={activo}
                      className={`${styles.optionCard} ${activo ? styles.optionCardActive : ''}`}
                      onClick={() => elegirServicio(servicio._id)}
                    >
                      <span className={styles.optionName}>{servicio.nombre}</span>
                      <span className={styles.optionMeta}>
                        {formatearDuracion(servicio.duracion)} · {formatearPrecio(servicio.precio)}
                      </span>
                      {servicio.descripcion && (
                        <span className={styles.optionDescription}>{servicio.descripcion}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                disabled={!servicioSeleccionado}
                onClick={() => setPaso(2)}
              >
                Elegir profesional y horario
              </button>
            </div>
          </section>
        )}

        {paso === 2 && servicioSeleccionado && (
          <section className={styles.panel} aria-labelledby="paso-horario">
            <div className={styles.panelHead}>
              <h2 id="paso-horario" className={styles.panelTitle}>Profesional y horario</h2>
              <p className={styles.panelHint}>{servicioSeleccionado.nombre}</p>
            </div>

            <div>
              <p className={styles.label}>Profesional</p>
              {cargandoProfesionales ? (
                <p className={styles.loading} role="status">Cargando profesionales…</p>
              ) : errorProfesionales ? (
                <div className={`${styles.notice} ${styles.noticeError}`} role="alert">
                  <p>{errorProfesionales}</p>
                  <button type="button" className={styles.textLink} onClick={() => recargarProfesionales()}>
                    Reintentar
                  </button>
                </div>
              ) : profesionalesFiltrados.length === 0 ? (
                <div className={styles.empty}>
                  <p>Ninguna profesional tiene este servicio entre sus especialidades.</p>
                  {profesionales.length > 0 && !mostrarTodas && (
                    <button type="button" className={styles.textLink} onClick={() => setMostrarTodas(true)}>
                      Ver todas las profesionales
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.professionalGrid} role="radiogroup" aria-label="Profesionales disponibles">
                  {profesionalesFiltrados.map((profesional) => {
                    const activo = profesional._id === idProfesional;
                    const nombre = nombreDeProfesional(profesional);

                    return (
                      <button
                        key={profesional._id}
                        type="button"
                        role="radio"
                        aria-checked={activo}
                        className={`${styles.professionalCard} ${activo ? styles.professionalCardActive : ''}`}
                        onClick={() => elegirProfesional(profesional._id)}
                      >
                        <span className={styles.avatar} aria-hidden="true">{inicialesDe(nombre)}</span>
                        <span>
                          <span className={styles.professionalName}>{nombre} - </span>
                          {profesional.anioExperiencia > 0 && (
                            <span className={styles.professionalMeta}>
                              {profesional.anioExperiencia} {profesional.anioExperiencia === 1 ? 'año' : 'años'} de experiencia
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className={styles.label}>Fecha</p>
              <CalendarioFechas valor={fecha} onElegir={elegirFecha} diasAtencion={diasAtencion} />
            </div>

            <div>
              <p className={styles.label}>Hora disponible</p>

              {!idProfesional || !fecha ? (
                <p className={styles.empty}>Elige primero una profesional y una fecha.</p>
              ) : cargandoSlots ? (
                <p className={styles.loading} role="status">Consultando la agenda…</p>
              ) : errorSlots ? (
                <p className={`${styles.notice} ${styles.noticeError}`} role="alert">{errorSlots}</p>
              ) : disponibilidad?.mensaje ? (
                <p className={styles.notice}>{disponibilidad.mensaje}.</p>
              ) : slots.length === 0 ? (
                <p className={styles.empty}>
                  No quedan horarios libres para este día. Prueba con otra fecha u otra profesional.
                </p>
              ) : (
                <div className={styles.slots} role="radiogroup" aria-label="Horarios disponibles">
                  {slots.map((slot) => {
                    const activo = slot.horaInicio === hora;

                    return (
                      <button
                        key={slot.horaInicio}
                        type="button"
                        role="radio"
                        aria-checked={activo}
                        className={`${styles.slot} ${activo ? styles.slotActive : ''}`}
                        onClick={() => setHora(slot.horaInicio)}
                      >
                        {formatearHora(slot.horaInicio)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.actionsBetween}>
              <button type="button" className={styles.secondary} onClick={() => setPaso(1)}>
                Volver
              </button>
              <button
                type="button"
                className={styles.primary}
                disabled={!listoParaConfirmar}
                onClick={() => setPaso(3)}
              >
                Continuar con mis datos
              </button>
            </div>
          </section>
        )}

        {paso === 3 && servicioSeleccionado && (
          <section className={styles.panel} aria-labelledby="paso-datos">
            <div className={styles.panelHead}>
              <h2 id="paso-datos" className={styles.panelTitle}>Tus datos</h2>
              <p className={styles.panelHint}>Revisa el resumen antes de confirmar.</p>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Servicio</span>
                <span className={styles.summaryValue}>{servicioSeleccionado.nombre}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Profesional</span>
                <span className={styles.summaryValue}>{nombreDeProfesional(profesionalSeleccionado)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Fecha y hora</span>
                <span className={styles.summaryValue}>
                  {formatearFechaLarga(fecha)} · {formatearHora(hora)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Duración</span>
                <span className={styles.summaryValue}>{formatearDuracion(servicioSeleccionado.duracion)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Valor</span>
                <span className={styles.summaryValue}>{formatearPrecio(servicioSeleccionado.precio)}</span>
              </div>
            </div>

            <form className={styles.fieldGrid} onSubmit={confirmarCita} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="cliente-nombre">Nombre completo</label>
                <input
                  id="cliente-nombre"
                  className={styles.input}
                  type="text"
                  autoComplete="name"
                  value={cliente.nombre}
                  onChange={(evento) => setCliente((previo) => ({ ...previo, nombre: evento.target.value }))}
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre ? 'cliente-nombre-error' : undefined}
                  placeholder="Ej. Laura Gómez"
                />
                {errores.nombre && (
                  <span id="cliente-nombre-error" className={styles.error}>{errores.nombre}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="cliente-telefono">Teléfono</label>
                <input
                  id="cliente-telefono"
                  className={styles.input}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={cliente.telefono}
                  onChange={(evento) => setCliente((previo) => ({ ...previo, telefono: evento.target.value }))}
                  aria-invalid={Boolean(errores.telefono)}
                  aria-describedby={errores.telefono ? 'cliente-telefono-error' : 'cliente-telefono-ayuda'}
                  placeholder="Ej. 318 450 9821"
                />
                {errores.telefono ? (
                  <span id="cliente-telefono-error" className={styles.error}>{errores.telefono}</span>
                ) : (
                  <span id="cliente-telefono-ayuda" className={styles.hint}>
                    Lo usamos para enviarte el enlace de tu cita y avisarte si algo cambia.
                  </span>
                )}
              </div>
            </form>

            {errorEnvio && (
              <p className={`${styles.notice} ${styles.noticeError}`} role="alert">{errorEnvio}</p>
            )}

            <div className={styles.actionsBetween}>
              <button type="button" className={styles.secondary} onClick={() => setPaso(2)}>
                Volver
              </button>
              <button
                type="button"
                className={styles.primary}
                disabled={enviando}
                onClick={confirmarCita}
              >
                {enviando ? 'Agendando…' : 'Confirmar cita'}
              </button>
            </div>
          </section>
        )}

        {paso === 4 && resultado && (
          <section className={`${styles.panel} ${styles.success}`} aria-live="polite">
            <span className={styles.successMark} aria-hidden="true"><IconoCheck /></span>
            <h2 className={styles.panelTitle}>Tu cita quedó agendada</h2>
            <p className={styles.subtitle}>
              Envía el enlace a tu teléfono con un toque. Con él puedes revisar o cancelar la cita sin crear una cuenta.
            </p>

            <div className={styles.summary} style={{ width: '100%', maxWidth: 620, textAlign: 'left' }}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Servicio</span>
                <span className={styles.summaryValue}>{resultado.cita?.servicio?.name ?? servicioSeleccionado?.nombre}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Profesional</span>
                <span className={styles.summaryValue}>{nombreDeProfesional(profesionalSeleccionado)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Fecha y hora</span>
                <span className={styles.summaryValue}>
                  {formatearFechaLarga(fecha)} · {formatearHora(hora)}
                </span>
              </div>
            </div>

            <div className={styles.linkBox}>
              <span className={styles.label}>Enlace de tu cita</span>
              <span className={styles.linkValue}>{enlaceCita}</span>
              <div className={styles.actions}>
                {puedeCompartir && (
                  <button type="button" className={styles.secondary} onClick={compartirEnlace}>
                    Compartir
                  </button>
                )}
                <button type="button" className={styles.secondary} onClick={copiarEnlace}>
                  {estadoCopia === 'copiado' ? 'Enlace copiado' : 'Copiar enlace'}
                </button>
                {puedeWhatsApp && (
                  <button type="button" className={styles.primary} onClick={enviarPorWhatsApp}>
                    Enviar a mi WhatsApp
                  </button>
                )}
              </div>
              <span className={styles.hint}>
                {!puedeWhatsApp
                  ? 'Copia el enlace y envíalo al teléfono desde tu aplicación de mensajes.'
                  : estadoEnvio === 'whatsapp'
                    ? `Abrimos WhatsApp con el mensaje listo para el ${cliente.telefono}. Solo pulsa enviar.`
                    : estadoEnvio === 'error-whatsapp'
                      ? 'No pudimos abrir WhatsApp. Usa el botón Copiar enlace.'
                      : `Se abrirá WhatsApp con el mensaje listo para el ${cliente.telefono}.`}
              </span>
              {estadoCopia === 'error' && (
                <span className={styles.error}>No pudimos copiarlo automáticamente. Selecciona el enlace y cópialo.</span>
              )}
              {estadoEnvio === 'error-compartir' && (
                <span className={styles.error}>No pudimos abrir el menú para compartir. Usa WhatsApp o copia el enlace.</span>
              )}
              {estadoEnvio === 'error-whatsapp' && (
                <span className={styles.error}>El navegador bloqueó la ventana de WhatsApp. Habilítala o copia el enlace.</span>
              )}
            </div>

            <div className={styles.actions}>
              <Link className={styles.secondary} to={`/cita/${resultado.enlaceToken}`}>
                Ver mi cita
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
