import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CONTACTO } from '../../content/landing';
import { getServicios } from '../../api/servicioService';
import {es} from 'react-day-picker/locale/es';
import { getProfesionales } from '../../api/profesionalService';
import { crearCitaPublica, obtenerDisponibilidad } from '../../api/citaService';
import { mensajeDeError } from '../../utils/catalogo';
import styles from './ContactoSection.module.css';

function IconoTelefono() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 12.8v2.2a1.5 1.5 0 0 1-1.64 1.5 14.84 14.84 0 0 1-6.47-2.3 14.62 14.62 0 0 1-4.5-4.5A14.84 14.84 0 0 1 1.6 3.2 1.5 1.5 0 0 1 3.1 1.5h2.2a1.5 1.5 0 0 1 1.5 1.29 9.61 9.61 0 0 0 .52 2.11 1.5 1.5 0 0 1-.34 1.58L5.8 7.66a11.74 11.74 0 0 0 4.5 4.5l1.18-1.18a1.5 1.5 0 0 1 1.58-.34 9.61 9.61 0 0 0 2.11.52 1.5 1.5 0 0 1 1.29 1.52z" />
    </svg>
  );
}

function IconoCorreo() {
  return (
    <svg
      className={styles.channelIcon}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.25" y="3.75" width="13.5" height="10.5" rx="2" />
      <polyline points="15.75,5.25 9,9.75 2.25,5.25" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4,5.25 7,8.25 10,5.25" />
    </svg>
  );
}


function formatearFechaLocal(fecha) {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parsearFechaLocal(texto) {
  if (!texto) return undefined;
  const [yyyy, mm, dd] = texto.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export default function ContactoSection() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [idServicio, setIdServicio] = useState('');
  const [idProfesional, setIdProfesional] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');

  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const control = new AbortController();

    async function cargar() {
      setCargandoDatos(true);
      try {
        const [datosServicios, datosProfesionales] = await Promise.all([
          getServicios({ signal: control.signal }),
          getProfesionales({ signal: control.signal }),
        ]);
        setServicios(Array.isArray(datosServicios) ? datosServicios.filter((s) => s.activo !== false) : []);
        setProfesionales(Array.isArray(datosProfesionales) ? datosProfesionales : []);
      } catch (err) {
        if (control.signal.aborted) return;
        // No rompemos el formulario, solo mostramos aviso suave
        console.info('No se pudieron cargar servicios/profesionales:', mensajeDeError(err));
      } finally {
        if (!control.signal.aborted) setCargandoDatos(false);
      }
    }

    cargar();
    return () => control.abort();
  }, []);

  const fechaMinima = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }, []);

  useEffect(() => {
    setHoraInicio('');
    setDisponibilidad(null);
    setError('');
    setMensaje('');

    if (!idProfesional || !idServicio || !fecha) {
      return;
    }

    const control = new AbortController();

    async function cargarDisponibilidad() {
      setCargandoDisponibilidad(true);
      try {
        const datos = await obtenerDisponibilidad({
          idProfesional,
          idServicio,
          fecha,
          signal: control.signal,
        });
        setDisponibilidad(datos);
      } catch (err) {
        if (control.signal.aborted) return;
        setDisponibilidad({ slots: [], mensaje: mensajeDeError(err, 'No pudimos cargar la disponibilidad.') });
      } finally {
        if (!control.signal.aborted) setCargandoDisponibilidad(false);
      }
    }

    cargarDisponibilidad();
    return () => control.abort();
  }, [idProfesional, idServicio, fecha]);

  const fechaSeleccionada = useMemo(() => parsearFechaLocal(fecha), [fecha]);

  const slotsDisponibles = useMemo(() => disponibilidad?.slots || [], [disponibilidad]);

  function seleccionarServicio(nuevoId) {
    setIdServicio(nuevoId);
    setFecha('');
    setHoraInicio('');
    setDisponibilidad(null);
  }

  function seleccionarProfesional(nuevoId) {
    setIdProfesional(nuevoId);
    setFecha('');
    setHoraInicio('');
    setDisponibilidad(null);
  }

  function seleccionarFecha(dia) {
    if (!dia) return;
    setFecha(formatearFechaLocal(dia));
    setHoraInicio('');
    setError('');
    setMensaje('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nombre.trim()) {
      setError('Por favor, indica tu nombre.');
      return;
    }
    if (!telefono.trim()) {
      setError('Por favor, indica tu teléfono.');
      return;
    }
    if (!idServicio) {
      setError('Selecciona un servicio.');
      return;
    }
    if (!idProfesional) {
      setError('Selecciona un profesional.');
      return;
    }
    if (!fecha) {
      setError('Selecciona una fecha.');
      return;
    }
    if (!horaInicio) {
      setError('Selecciona una hora.');
      return;
    }

    setEnviando(true);
    try {
      await crearCitaPublica({
        cliente: {
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        },
        idServicio,
        idProfesional,
        fecha,
        horaInicio,
      });
      setMensaje('¡Cita agendada con éxito! Te contactaremos para confirmar los detalles.');
      setNombre('');
      setTelefono('');
      setIdServicio('');
      setIdProfesional('');
      setFecha('');
      setHoraInicio('');
      setDisponibilidad(null);
    } catch (err) {
      setError(mensajeDeError(err, 'No pudimos agendar la cita. Intenta nuevamente.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="contacto" className={styles.section} aria-labelledby="contacto-title">
      <div className={styles.container}>
        <div className={styles.info}>
          <header className={styles.infoHeader}>
            <p className={styles.eyebrow}>{CONTACTO.antetitulo}</p>
            <h2 id="contacto-title" className={styles.title}>
              {CONTACTO.titulo}
            </h2>
            <p className={styles.description}>
              Agenda tu cita en pocos pasos: servicio, profesional, fecha y hora. Te confirmaremos por teléfono.
            </p>
          </header>

          <div className={styles.channels}>
            <a className={styles.channel} href="tel:+573184509821">
              <div className={styles.channelSymbol}>
                <IconoTelefono />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.telefono.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.telefono.valor}</p>
              </div>
            </a>

            <a className={styles.channel} href="mailto:contacto@threemasters.com">
              <div className={styles.channelSymbol}>
                <IconoCorreo />
              </div>
              <div>
                <p className={styles.channelTitle}>{CONTACTO.correo.etiqueta}</p>
                <p className={styles.channelValue}>{CONTACTO.correo.valor}</p>
              </div>
            </a>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.stepGroup}>
            <p className={styles.stepLabel}>1. Datos de contacto</p>
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Nombre completo *</span>
                <input
                  className={styles.input}
                  type="text"
                  name="nombre"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Teléfono *</span>
                <input
                  className={styles.input}
                  type="tel"
                  name="telefono"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Tu número"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          <div className={styles.stepGroup}>
            <p className={styles.stepLabel}>2. Servicio y profesional</p>
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Servicio *</span>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    name="servicio"
                    value={idServicio}
                    onChange={(e) => seleccionarServicio(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {cargandoDatos ? 'Cargando servicios...' : 'Selecciona un servicio'}
                    </option>
                    {servicios.map((servicio) => (
                      <option key={servicio._id} value={servicio._id}>
                        {servicio.nombre}
                        {servicio.duracion ? ` (${servicio.duracion} min)` : ''}
                      </option>
                    ))}
                  </select>
                  <IconoFlecha />
                </div>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Profesional *</span>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    name="profesional"
                    value={idProfesional}
                    onChange={(e) => seleccionarProfesional(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {cargandoDatos ? 'Cargando profesionales...' : 'Selecciona un profesional'}
                    </option>
                    {profesionales.map((profesional) => (
                      <option key={profesional._id} value={profesional._id}>
                        {profesional.idUsuario?.nombrecompleto}
                      </option>
                    ))}
                  </select>
                  <IconoFlecha />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.stepGroup}>
            <p className={styles.stepLabel}>3. Fecha</p>
            <div className={styles.calendarWrapper}>
              <DayPicker
                mode="single"
                locale={es}
                selected={fechaSeleccionada}
                onSelect={seleccionarFecha}
                disabled={[{ before: fechaMinima }]}
                weekStartsOn={1}
                showOutsideDays
                className={styles.dayPicker}
                classNames={{
                  months: styles.dpMonths,
                  month: styles.dpMonth,
                  caption: styles.dpCaption,
                  caption_label: styles.dpCaptionLabel,
                  nav: styles.dpNav,
                  nav_button: styles.dpNavButton,
                  table: styles.dpTable,
                  head_row: styles.dpHeadRow,
                  head_cell: styles.dpHeadCell,
                  row: styles.dpRow,
                  cell: styles.dpCell,
                  day: styles.dpDay,
                  day_selected: styles.dpDaySelected,
                  day_today: styles.dpDayToday,
                  day_disabled: styles.dpDayDisabled,
                  day_outside: styles.dpDayOutside,
                }}
              />
            </div>
            {fecha && <p className={styles.selectedInfo}>Fecha seleccionada: {fecha}</p>}
          </div>

          <div className={styles.stepGroup}>
            <p className={styles.stepLabel}>4. Horarios disponibles</p>
            {!idServicio || !idProfesional ? (
              <p className={styles.helperText}>Selecciona servicio y profesional para ver la disponibilidad.</p>
            ) : !fecha ? (
              <p className={styles.helperText}>Selecciona una fecha en el calendario.</p>
            ) : cargandoDisponibilidad ? (
              <p className={styles.helperText}>Consultando disponibilidad...</p>
            ) : slotsDisponibles.length === 0 ? (
              <p className={styles.helperText}>
                {disponibilidad?.mensaje || 'No hay horarios disponibles para esta fecha. Prueba con otra fecha.'}
              </p>
            ) : (
              <div className={styles.slotsGrid} role="radiogroup" aria-label="Horarios disponibles">
                {slotsDisponibles.map((slot) => (
                  <button
                    key={slot.horaInicio}
                    type="button"
                    className={`${styles.slotButton} ${horaInicio === slot.horaInicio ? styles.slotButtonActive : ''}`}
                    onClick={() => setHoraInicio(slot.horaInicio)}
                    aria-pressed={horaInicio === slot.horaInicio}
                  >
                    {slot.horaInicio}
                  </button>
                ))}
              </div>
            )}
            {horaInicio && <p className={styles.selectedInfo}>Hora seleccionada: {horaInicio}</p>}
          </div>

          {mensaje && (
            <p className={styles.success} role="status" aria-live="polite">
              {mensaje}
            </p>
          )}
          {error && (
            <p className={styles.error} role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <button className={styles.button} type="submit" disabled={enviando}>
            {enviando ? 'Agendando...' : 'Agendar cita'}
          </button>
        </form>
      </div>
    </section>
  );
}
