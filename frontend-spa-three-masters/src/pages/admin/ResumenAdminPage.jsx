import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Boton from '../../components/admin/Boton';
import { useAuth } from '../../context/AuthContext';
import { useCitas } from '../../hooks/useCitas';
import { useProfesionales } from '../../hooks/useProfesionales';
import { useServicios } from '../../hooks/useServicios';
import { inicialesDe } from '../../utils/agenda';
import { formatearPrecio } from '../../utils/catalogo';
import {
  claveDeHoy,
  claveFechaDeCita,
  esCitaDeHoy,
  esCitaFutura,
  nombreClienteDeCita,
  nombreProfesionalDeCita,
  nombreServicioDeCita,
  precioServicioDeCita,
} from '../../utils/citas';
import {
  claveFecha,
  etiquetaEstado,
  formatearFechaCorta,
  formatearFechaLarga,
  formatearHora,
} from '../../utils/reserva';
import page from './AdminPage.module.css';
import styles from './ResumenAdmin.module.css';

const ESTADOS_RESUMEN = ['confirmada', 'completada', 'cancelada', 'no_asistio'];

const FILTROS_TEMPORALES = [
  { id: 'semana', etiqueta: 'Esta semana' },
  { id: 'mes', etiqueta: 'Este mes' },
  { id: 'anio', etiqueta: 'Este año' },
  { id: 'todos', etiqueta: 'Histórico' },
];

const ETIQUETAS_PERIODO = {
  semana: 'Citas esta semana',
  mes: 'Citas este mes',
  anio: 'Citas este año',
  todos: 'Total citas',
};

function calcularRangoSemana(ahora = new Date()) {
  const diaSemana = (ahora.getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() - diaSemana);
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  return {
    inicio: claveFecha(lunes),
    fin: claveFecha(domingo),
  };
}

const CLASES_BARRA = {
  confirmada: styles.barraConfirmada,
  completada: styles.barraCompletada,
  cancelada: styles.barraCancelada,
  noAsistio: styles.barraNoAsistio,
};

const CLASES_PUNTO = {
  confirmada: styles.puntoConfirmada,
  completada: styles.puntoCompletada,
  cancelada: styles.puntoCancelada,
  noAsistio: styles.puntoNoAsistio,
};

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

function IconoFlecha() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function IconoEsmalte() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 8h6v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8z" />
      <path d="M10 8V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V8" />
      <path d="M9 12h6" />
    </svg>
  );
}

function IconoPersona() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.3 3.1-5.6 7-5.6s7 2.3 7 5.6" />
    </svg>
  );
}

function IconoFiltro() {
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

function ordenarPorFecha(a, b) {
  const claveA = `${claveFechaDeCita(a)}T${a.horaInicio || '00:00'}`;
  const claveB = `${claveFechaDeCita(b)}T${b.horaInicio || '00:00'}`;
  return claveA.localeCompare(claveB);
}

function EsqueletoCitas() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 4 }).map((_, indice) => (
        <div className={styles.esqueletoFila} key={indice}>
          <span className={`${page.esqueleto} ${styles.esqueletoFecha}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoCirculo}`} />
          <span className={styles.esqueletoTexto}>
            <span className={`${page.esqueleto} ${styles.esqueletoLinea}`} />
            <span className={`${page.esqueleto} ${styles.esqueletoLineaCorta}`} />
          </span>
        </div>
      ))}
    </div>
  );
}

function EsqueletoBarras() {
  return (
    <div className={styles.esqueletoPanel} aria-hidden="true">
      {Array.from({ length: 4 }).map((_, indice) => (
        <span className={`${page.esqueleto} ${styles.esqueletoBarra}`} key={indice} />
      ))}
    </div>
  );
}

function EsqueletoRanking() {
  return (
    <div className={styles.esqueletoPanel} aria-hidden="true">
      {Array.from({ length: 4 }).map((_, indice) => (
        <span className={styles.esqueletoFilaRanking} key={indice}>
          <span className={`${page.esqueleto} ${styles.esqueletoPuesto}`} />
          <span className={`${page.esqueleto} ${styles.esqueletoLinea}`} />
        </span>
      ))}
    </div>
  );
}

function EsqueletoCatalogo() {
  return (
    <div className={styles.catalogo} aria-hidden="true">
      {Array.from({ length: 2 }).map((_, indice) => (
        <div className={styles.catalogoEsqueleto} key={indice}>
          <span className={`${page.esqueleto} ${styles.esqueletoCirculo}`} />
          <span className={styles.esqueletoTexto}>
            <span className={`${page.esqueleto} ${styles.esqueletoValor}`} />
            <span className={`${page.esqueleto} ${styles.esqueletoLineaCorta}`} />
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResumenAdminPage() {
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const {
    citas,
    cargando: cargandoCitas,
    error: errorCitas,
    recargar: recargarCitas,
  } = useCitas();
  const {
    servicios,
    cargando: cargandoServicios,
    error: errorServicios,
    recargar: recargarServicios,
  } = useServicios();
  const {
    profesionales,
    cargando: cargandoProfesionales,
    error: errorProfesionales,
    recargar: recargarProfesionales,
  } = useProfesionales({ soloAdmin: true });

  const [periodo, setPeriodo] = useState('mes');
  const rangoSemana = useMemo(() => calcularRangoSemana(), []);

  const hoy = claveDeHoy();
  const fechaHoy = formatearFechaLarga(hoy);
  const nombre = usuario?.nombrecompleto?.split(/\s+/)[0] || usuario?.nombreusuario || 'equipo';

  const citasFiltradas = useMemo(() => {
    if (periodo === 'todos') return citas;

    return citas.filter((cita) => {
      const clave = claveFechaDeCita(cita);
      if (!clave) return false;

      if (periodo === 'semana') return clave >= rangoSemana.inicio && clave <= rangoSemana.fin;
      if (periodo === 'mes') return clave.slice(0, 7) === hoy.slice(0, 7);
      if (periodo === 'anio') return clave.slice(0, 4) === hoy.slice(0, 4);

      return true;
    });
  }, [citas, periodo, hoy, rangoSemana]);

  const totalCitasPeriodo = citasFiltradas.length;
  const confirmadasPeriodo = citasFiltradas.filter((cita) => cita.estado === 'confirmada').length;
  const completadasPeriodo = citasFiltradas.filter((cita) => cita.estado === 'completada').length;
  const ingresosCompletados = citasFiltradas
    .filter((cita) => cita.estado === 'completada')
    .reduce((total, cita) => total + (Number(precioServicioDeCita(cita)) || 0), 0);

  const proximas = useMemo(
    () =>
      citas
        .filter((cita) => cita.estado === 'confirmada' && esCitaFutura(cita, hoy))
        .sort(ordenarPorFecha)
        .slice(0, 5),
    [citas, hoy]
  );

  const distribucion = useMemo(
    () =>
      ESTADOS_RESUMEN.map((estado) => {
        const info = etiquetaEstado(estado);
        const total = citasFiltradas.filter((cita) => cita.estado === estado).length;

        return {
          estado,
          etiqueta: info.etiqueta,
          tono: info.tono,
          total,
          porcentaje: totalCitasPeriodo ? Math.round((total / totalCitasPeriodo) * 100) : 0,
        };
      }),
    [citasFiltradas, totalCitasPeriodo]
  );

  const ranking = useMemo(() => {
    const conteo = new Map();

    citasFiltradas.forEach((cita) => {
      if (cita.estado !== 'confirmada' && cita.estado !== 'completada') return;

      const nombreServicio = nombreServicioDeCita(cita);
      const actual = conteo.get(nombreServicio) ?? { nombre: nombreServicio, total: 0 };
      actual.total += 1;
      conteo.set(nombreServicio, actual);
    });

    const lista = [...conteo.values()].sort(
      (a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre)
    );
    const maximo = lista[0]?.total ?? 0;

    return lista.slice(0, 5).map((item) => ({
      ...item,
      porcentaje: maximo ? Math.round((item.total / maximo) * 100) : 0,
    }));
  }, [citasFiltradas]);

  const serviciosActivos = servicios.filter((servicio) => servicio.activo !== false).length;
  const serviciosPausados = servicios.length - serviciosActivos;

  const hayError = Boolean(errorCitas || errorServicios || errorProfesionales);
  const cargando = cargandoCitas || cargandoServicios || cargandoProfesionales;

  const recargarTodo = () => {
    recargarCitas();
    recargarServicios();
    recargarProfesionales();
  };

  return (
    <div className={page.pagina}>
      <header className={page.cabecera}>
        <div className={page.tituloBloque}>
          <h1 className={page.titulo}>EL PULSO DEL ATELIER</h1>
          <p className={page.intro}>
            Hola, {nombre}. Este es el movimiento del atelier para el{' '}
            <strong className={styles.fechaHoy}>{fechaHoy.toLowerCase()}</strong>.
          </p>
        </div>

        <Boton variante="primario" onClick={() => navegar('/admin/citas')}>
          <IconoCalendario />
          Abrir agenda
        </Boton>
      </header>

      <div className={styles.filtroBarra} role="region" aria-label="Filtro temporal de estadísticas">
        <div className={styles.filtroEtiquetaGrupo}>
          <span className={styles.filtroIcono} aria-hidden="true">
            <IconoFiltro />
          </span>
          <span>Período analítico:</span>
        </div>

        <div className={styles.filtroBotones} role="group" aria-label="Seleccionar rango temporal">
          {FILTROS_TEMPORALES.map((filtro) => {
            const activo = periodo === filtro.id;
            return (
              <button
                key={filtro.id}
                type="button"
                className={`${styles.filtroBoton} ${activo ? styles.filtroBotonActivo : ''}`}
                onClick={() => setPeriodo(filtro.id)}
                aria-pressed={activo}
              >
                {filtro.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      <dl className={page.resumen} aria-label="Indicadores del atelier">
        <div className={page.resumenItem}>
          <dt>{ETIQUETAS_PERIODO[periodo] ?? 'Total citas'}</dt>
          <dd>{cargandoCitas ? '—' : totalCitasPeriodo}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Confirmadas</dt>
          <dd>{cargandoCitas ? '—' : confirmadasPeriodo}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Completadas</dt>
          <dd>{cargandoCitas ? '—' : completadasPeriodo}</dd>
        </div>
        <div className={page.resumenItem}>
          <dt>Ingresos recaudados</dt>
          <dd className={styles.kpiMoneda}>
            {cargandoCitas ? '—' : formatearPrecio(ingresosCompletados)}
          </dd>
        </div>
      </dl>

      {cargando && (
        <p className={page.srOnly} role="status">
          Cargando el resumen del atelier…
        </p>
      )}

      {hayError && (
        <div className={page.errorCarga} role="alert">
          <div>
            <strong>No pudimos cargar todo el resumen.</strong>
            <p>{errorCitas || errorServicios || errorProfesionales}</p>
          </div>
          <Boton tamano="sm" onClick={recargarTodo}>
            Reintentar
          </Boton>
        </div>
      )}

      <div className={styles.tablero}>
        <section className={styles.panel} aria-labelledby="resumen-proximas">
          <div className={styles.panelCabecera}>
            <div>
              <h2 className={styles.panelTitulo} id="resumen-proximas">
                Próximas citas
              </h2>
              <p className={styles.panelNota}>Confirmadas de hoy en adelante</p>
            </div>
            <Link to="/admin/citas" className={styles.enlacePanel}>
              Ver agenda
              <IconoFlecha />
            </Link>
          </div>

          {cargandoCitas ? (
            <EsqueletoCitas />
          ) : proximas.length === 0 ? (
            <div className={styles.vacioPanel}>
              <p className={styles.vacioTitulo}>Sin citas próximas</p>
              <p className={styles.vacioTexto}>
                Cuando una clienta agende, su cita aparecerá aquí para que la prepares con
                calma.
              </p>
              <Link to="/reservar" className={styles.vacioEnlace}>
                Ir al agendamiento
                <IconoFlecha />
              </Link>
            </div>
          ) : (
            <ul className={styles.listaCitas}>
              {proximas.map((cita) => {
                const clienta = nombreClienteDeCita(cita);

                return (
                  <li className={styles.cita} key={cita._id}>
                    <span className={styles.citaFecha}>
                      <span className={styles.citaDia}>
                        {formatearFechaCorta(claveFechaDeCita(cita))}
                      </span>
                      <span className={styles.citaHora}>{formatearHora(cita.horaInicio)}</span>
                    </span>

                    <span className={styles.citaPersona}>
                      <span className={styles.avatar} aria-hidden="true">
                        {inicialesDe(clienta)}
                      </span>
                      <span className={styles.citaTexto}>
                        <span className={styles.citaNombre}>{clienta}</span>
                        <span className={styles.citaDetalle}>
                          {nombreServicioDeCita(cita)} · {nombreProfesionalDeCita(cita)}
                        </span>
                      </span>
                    </span>

                    <span className={styles.citaPrecio}>
                      {formatearPrecio(precioServicioDeCita(cita))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="resumen-estados">
          <div className={styles.panelCabecera}>
            <div>
              <h2 className={styles.panelTitulo} id="resumen-estados">
                Estado de las citas
              </h2>
              <p className={styles.panelNota}>
                {cargandoCitas
                  ? 'Sincronizando agenda…'
                  : `${totalCitasPeriodo} ${
                      totalCitasPeriodo === 1 ? 'cita en el período' : 'citas en el período'
                    }`}
              </p>
            </div>
          </div>

          {cargandoCitas ? (
            <EsqueletoBarras />
          ) : (
            <ul className={styles.distribucion}>
              {distribucion.map((item) => (
                <li className={styles.distribucionItem} key={item.estado}>
                  <div className={styles.distribucionFila}>
                    <span className={styles.distribucionEtiqueta}>
                      <span
                        className={`${styles.punto} ${CLASES_PUNTO[item.tono] ?? ''}`}
                        aria-hidden="true"
                      />
                      {item.etiqueta}
                    </span>
                    <span className={styles.distribucionValor}>{item.total}</span>
                  </div>
                  <span className={styles.barra}>
                    <span
                      className={`${styles.barraRelleno} ${
                        CLASES_BARRA[item.tono] ?? ''
                      }`}
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="resumen-servicios">
          <div className={styles.panelCabecera}>
            <div>
              <h2 className={styles.panelTitulo} id="resumen-servicios">
                Servicios más agendados
              </h2>
              <p className={styles.panelNota}>
                Preferencias según {FILTROS_TEMPORALES.find((f) => f.id === periodo)?.etiqueta.toLowerCase()}
              </p>
            </div>
          </div>

          {cargandoCitas ? (
            <EsqueletoRanking />
          ) : ranking.length === 0 ? (
            <div className={styles.vacioPanel}>
              <p className={styles.vacioTitulo}>Aún no hay preferencias</p>
              <p className={styles.vacioTexto}>
                Cuando el atelier reciba sus primeras citas, aquí verás qué servicios son
                los más pedidos.
              </p>
            </div>
          ) : (
            <ol className={styles.ranking}>
              {ranking.map((item, indice) => (
                <li className={styles.rankingItem} key={item.nombre}>
                  <span className={styles.rankingPuesto} aria-hidden="true">
                    {indice + 1}
                  </span>
                  <span className={styles.rankingTexto}>
                    <span className={styles.rankingNombre}>{item.nombre}</span>
                    <span className={styles.rankingBarra}>
                      <span style={{ width: `${item.porcentaje}%` }} />
                    </span>
                  </span>
                  <span className={styles.rankingTotal}>
                    {item.total} {item.total === 1 ? 'cita' : 'citas'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="resumen-catalogo">
          <div className={styles.panelCabecera}>
            <div>
              <h2 className={styles.panelTitulo} id="resumen-catalogo">
                Catálogo y equipo
              </h2>
              <p className={styles.panelNota}>Lo que sostiene la experiencia del atelier</p>
            </div>
          </div>

          {cargandoServicios || cargandoProfesionales ? (
            <EsqueletoCatalogo />
          ) : (
            <div className={styles.catalogo}>
              <Link to="/admin/servicios" className={styles.catalogoEnlace}>
                <span className={styles.catalogoIcono} aria-hidden="true">
                  <IconoEsmalte />
                </span>
                <span className={styles.catalogoTexto}>
                  <span className={styles.catalogoValor}>{servicios.length}</span>
                  <span className={styles.catalogoEtiqueta}>Servicios en catálogo</span>
                  <span className={styles.catalogoNota}>
                    {serviciosActivos} activos · {serviciosPausados} en pausa
                  </span>
                </span>
              </Link>

              <Link to="/admin/profesionales" className={styles.catalogoEnlace}>
                <span className={styles.catalogoIcono} aria-hidden="true">
                  <IconoPersona />
                </span>
                <span className={styles.catalogoTexto}>
                  <span className={styles.catalogoValor}>{profesionales.length}</span>
                  <span className={styles.catalogoEtiqueta}>Profesionales</span>
                  <span className={styles.catalogoNota}>Equipo disponible en la agenda</span>
                </span>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
