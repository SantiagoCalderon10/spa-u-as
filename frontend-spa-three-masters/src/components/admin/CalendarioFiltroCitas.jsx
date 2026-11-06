import { useEffect, useMemo, useState } from 'react';
import { claveFecha, fechaDesdeClaveLocal, formatearFechaLarga } from '../../utils/reserva';
import styles from './CalendarioFiltroCitas.module.css';

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

/** Meses que se pueden navegar hacia atrás y hacia adelante. */
const MESES_ATRAS = 24;
const MESES_ADELANTE = 24;

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

function cantidadDe(conteoPorDia, clave) {
  const cantidad = conteoPorDia?.get?.(clave);
  return Number.isFinite(cantidad) ? cantidad : 0;
}

/**
 * Calendario mensual que funciona como filtro de la agenda administrativa.
 * Conserva el lenguaje visual del calendario de agendamiento público e
 * incorpora marcas para los días que ya tienen citas.
 */
export default function CalendarioFiltroCitas({ valor, onElegir, conteoPorDia }) {
  const [hoy] = useState(hoyLocal);
  const [mesVisible, setMesVisible] = useState(() =>
    inicioDeMes(fechaDesdeClaveLocal(valor) ?? hoy)
  );

  useEffect(() => {
    const elegida = fechaDesdeClaveLocal(valor);
    if (!elegida) return;
    setMesVisible((actual) => (mismoMes(actual, elegida) ? actual : inicioDeMes(elegida)));
  }, [valor]);

  const limiteAnterior = useMemo(
    () => new Date(hoy.getFullYear(), hoy.getMonth() - MESES_ATRAS, 1),
    [hoy]
  );
  const limiteSiguiente = useMemo(
    () => new Date(hoy.getFullYear(), hoy.getMonth() + MESES_ADELANTE, 1),
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

  const claveHoy = claveFecha(hoy);
  const puedeAnterior = mesVisible.getTime() > limiteAnterior.getTime();
  const puedeSiguiente = mesVisible.getTime() < limiteSiguiente.getTime();

  const citasDelMes = useMemo(
    () =>
      celdas.reduce(
        (total, celda) => (celda ? total + cantidadDe(conteoPorDia, claveFecha(celda)) : total),
        0
      ),
    [celdas, conteoPorDia]
  );

  const citasDelDia = cantidadDe(conteoPorDia, valor);

  function moverMes(delta) {
    setMesVisible((actual) => new Date(actual.getFullYear(), actual.getMonth() + delta, 1));
  }

  return (
    <div className={styles.calendario}>
      <div className={styles.encabezado}>
        <p className={styles.etiqueta}>Calendario</p>
        <span className={styles.contadorMes}>
          {citasDelMes} {citasDelMes === 1 ? 'cita' : 'citas'}
        </span>
      </div>

      <div className={styles.cabeceraMes}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => moverMes(-1)}
          disabled={!puedeAnterior}
          aria-label="Mes anterior"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <p className={styles.mes} aria-live="polite">
          {MESES_LARGOS[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </p>
        <button
          type="button"
          className={styles.nav}
          onClick={() => moverMes(1)}
          disabled={!puedeSiguiente}
          aria-label="Mes siguiente"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className={styles.grid} role="group" aria-label="Filtrar citas por día">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia} className={styles.semana} aria-hidden="true">
            {dia}
          </span>
        ))}

        {celdas.map((celda, indice) => {
          if (!celda) {
            return <span key={`vacio-${indice}`} className={styles.vacio} aria-hidden="true" />;
          }

          const clave = claveFecha(celda);
          const activo = clave === valor;
          const esHoy = clave === claveHoy;
          const cantidad = cantidadDe(conteoPorDia, clave);

          const clase = [
            styles.dia,
            esHoy ? styles.hoy : '',
            activo ? styles.activo : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={clave}
              type="button"
              aria-pressed={activo}
              aria-label={`${formatearFechaLarga(clave)}: ${
                cantidad === 0
                  ? 'sin citas'
                  : `${cantidad} ${cantidad === 1 ? 'cita agendada' : 'citas agendadas'}`
              }`}
              className={clase}
              onClick={() => onElegir(clave)}
              title={`${cantidad} ${cantidad === 1 ? 'cita' : 'citas'}`}
            >
              {celda.getDate()}
              {cantidad > 0 && <span className={styles.punto} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <p className={styles.pista} aria-live="polite">
        {valor
          ? `${citasDelDia} ${citasDelDia === 1 ? 'cita agendada' : 'citas agendadas'} el ${formatearFechaLarga(valor)}.`
          : 'Elige un día para ver solo sus citas en orden cronológico.'}
      </p>

      <div className={styles.pie}>
        <button type="button" className={styles.pieBoton} onClick={() => onElegir(claveHoy)}>
          Hoy
        </button>
        <button
          type="button"
          className={styles.pieBoton}
          onClick={() => onElegir('')}
          disabled={!valor}
        >
          Ver toda la agenda
        </button>
      </div>
    </div>
  );
}
