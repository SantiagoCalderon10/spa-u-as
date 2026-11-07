// Utilidades de la vista administrativa de citas.
// El backend entrega `idCliente` e `idProfesional` poblados; `idServicio`
// sigue siendo un ObjectId, por eso los helpers aceptan ambos formatos.

import { nombreDeProfesional } from './agenda';
import { claveFecha, claveFechaUTC, formatearHora } from './reserva';

export const FILTROS_ESTADO_CITA = [
  { valor: 'todos', etiqueta: 'Todos los estados' },
  { valor: 'confirmada', etiqueta: 'Confirmadas' },
  { valor: 'completada', etiqueta: 'Completadas' },
  { valor: 'cancelada', etiqueta: 'Canceladas' },
  { valor: 'no_asistio', etiqueta: 'No asistió' },
];

export const FILTROS_FECHA_CITA = [
  { valor: 'todas', etiqueta: 'Todas las fechas' },
  { valor: 'proximas', etiqueta: 'Próximas' },
  { valor: 'hoy', etiqueta: 'Hoy' },
  { valor: 'semana', etiqueta: 'Próximos 7 días' },
];

/** Devuelve el id sin importar si el campo vino poblado o como ObjectId. */
export function idDe(valor) {
  if (!valor) return '';
  return typeof valor === 'object' ? valor._id ?? '' : String(valor);
}

export function idProfesionalDeCita(cita) {
  return idDe(cita?.idProfesional);
}

export function idServicioDeCita(cita) {
  return idDe(cita?.idServicio);
}

export function nombreClienteDeCita(cita) {
  const cliente = cita?.idCliente;
  if (!cliente || typeof cliente !== 'object') return 'Clienta sin nombre';
  return cliente.nombre || 'Clienta sin nombre';
}

export function telefonoClienteDeCita(cita) {
  const cliente = cita?.idCliente;
  if (!cliente || typeof cliente !== 'object') return '';
  return cliente.telefono || '';
}

/**
 * Prioriza el perfil poblado y, si la profesional ya fue dada de baja, cae al
 * snapshot `cita.profesional.nombre` guardado al momento de agendar.
 */
export function nombreProfesionalDeCita(cita) {
  const profesional = cita?.idProfesional;
  if (profesional && typeof profesional === 'object') {
    const nombre = nombreDeProfesional(profesional);
    if (nombre !== 'Profesional sin nombre') return nombre;
  }

  return cita?.profesional?.nombre || 'Profesional sin nombre';
}

export function nombreServicioDeCita(cita) {
  return cita?.servicio?.name || 'Servicio sin nombre';
}

export function precioServicioDeCita(cita) {
  return cita?.servicio?.price;
}

export function claveFechaDeCita(cita) {
  return claveFechaUTC(cita?.fecha);
}

export function claveDeHoy() {
  return claveFecha(new Date());
}

/** Clave `YYYY-MM-DD` de hoy más `dias` días. */
export function claveDentroDe(dias = 7) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return claveFecha(fecha);
}

export function esCitaFutura(cita, hoy = claveDeHoy()) {
  return claveFechaDeCita(cita) >= hoy;
}

export function esCitaDeHoy(cita, hoy = claveDeHoy()) {
  return claveFechaDeCita(cita) === hoy;
}

export function esCitaDeLosProximosDias(cita, hoy = claveDeHoy(), limite = claveDentroDe(7)) {
  const clave = claveFechaDeCita(cita);
  return clave >= hoy && clave <= limite;
}

export function resumenHorarioCita(cita) {
  return `${formatearHora(cita?.horaInicio)} – ${formatearHora(cita?.horaFin)}`;
}

/** Texto plano para el buscador de la tabla. */
export function textoBuscableDeCita(cita) {
  return [
    nombreClienteDeCita(cita),
    telefonoClienteDeCita(cita),
    nombreProfesionalDeCita(cita),
    nombreServicioDeCita(cita),
  ]
    .join(' ')
    .toLowerCase();
}
