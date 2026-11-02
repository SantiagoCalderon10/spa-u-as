// Utilidades del flujo público de agendamiento.
// Las fechas viajan al backend como claves `YYYY-MM-DD` y se normalizan a
// medianoche UTC (ver backend/src/shared/utils/Fecha.js). Para mostrar una
// fecha de la base se leen sus componentes UTC y se formatea con timeZone UTC,
// así no se corre un día por la zona horaria de Colombia.

import { aMinutos } from './agenda';
import { idCategoriaDe } from './catalogo';

const PATRON_OBJECT_ID = /^[a-f\d]{24}$/i;

const formatoFechaLarga = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const formatoFechaCorta = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

export const ESTADOS_CITA = {
  confirmada: { etiqueta: 'Confirmada', tono: 'confirmada' },
  cancelada: { etiqueta: 'Cancelada', tono: 'cancelada' },
  completada: { etiqueta: 'Completada', tono: 'completada' },
  no_asistio: { etiqueta: 'No asistió', tono: 'noAsistio' },
};

export function esObjectId(valor) {
  return typeof valor === 'string' && PATRON_OBJECT_ID.test(valor);
}

export function etiquetaEstado(estado) {
  return ESTADOS_CITA[estado] ?? { etiqueta: 'Sin estado', tono: 'neutro' };
}

function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Clave `YYYY-MM-DD` en hora local (para fechas elegidas por la clienta). */
export function claveFecha(fecha = new Date()) {
  const valor = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '';

  const anio = valor.getFullYear();
  const mes = String(valor.getMonth() + 1).padStart(2, '0');
  const dia = String(valor.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Clave `YYYY-MM-DD` en UTC (para fechas que vienen de la base de datos). */
export function claveFechaUTC(fecha) {
  if (!fecha) return '';
  const valor = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '';

  const anio = valor.getUTCFullYear();
  const mes = String(valor.getUTCMonth() + 1).padStart(2, '0');
  const dia = String(valor.getUTCDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function fechaDesdeClave(clave) {
  if (!clave) return null;
  const valor = new Date(`${clave}T12:00:00Z`);
  return Number.isNaN(valor.getTime()) ? null : valor;
}

/** Fecha local (mediodía) para el calendario, a partir de una clave `YYYY-MM-DD`. */
export function fechaDesdeClaveLocal(clave) {
  if (!clave) return null;
  const [anio, mes, dia] = String(clave).split('-').map(Number);
  if (!anio || !mes || !dia) return null;

  const valor = new Date(anio, mes - 1, dia, 12, 0, 0, 0);
  return Number.isNaN(valor.getTime()) ? null : valor;
}

export function formatearFechaLarga(clave) {
  const fecha = fechaDesdeClave(clave);
  if (!fecha) return '—';
  return capitalizar(formatoFechaLarga.format(fecha));
}

export function formatearFechaCorta(clave) {
  const fecha = fechaDesdeClave(clave);
  if (!fecha) return '—';
  return formatoFechaCorta.format(fecha);
}

export function formatearFechaCita(fecha) {
  return formatearFechaLarga(claveFechaUTC(fecha));
}

export function formatearHora(hora) {
  const minutos = aMinutos(hora);
  if (!Number.isFinite(minutos)) return '—';

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  const sufijo = horas < 12 ? 'a. m.' : 'p. m.';
  const horas12 = horas % 12 === 0 ? 12 : horas % 12;

  return `${horas12}:${String(resto).padStart(2, '0')} ${sufijo}`;
}

/** Profesionales cuya especialidad incluye la categoría del servicio. */
export function profesionalesParaServicio(profesionales, servicio) {
  const lista = Array.isArray(profesionales) ? profesionales : [];
  const idCategoria = idCategoriaDe(servicio);

  if (!idCategoria) return lista;

  return lista.filter((profesional) => {
    const especialidades = Array.isArray(profesional?.especialidades) ? profesional.especialidades : [];
    return especialidades.some((especialidad) => {
      const id = typeof especialidad === 'object' ? especialidad?._id : especialidad;
      return String(id) === String(idCategoria);
    });
  });
}

/**
 * El backend no descarta horarios ya pasados del día de hoy. Aquí ocultamos
 * los que empiezan en menos de 30 minutos para no ofrecer una cita imposible.
 */
export function filtrarSlotsFuturos(slots, clave) {
  const lista = Array.isArray(slots) ? slots : [];
  if (clave !== claveFecha(new Date())) return lista;

  const ahora = new Date();
  const limite = ahora.getHours() * 60 + ahora.getMinutes() + 30;

  return lista.filter((slot) => aMinutos(slot.horaInicio) > limite);
}

export function resumenFechaHora(clave, hora) {
  if (!clave || !hora) return '—';
  return `${formatearFechaLarga(clave)} · ${formatearHora(hora)}`;
}

/**
 * Deja el teléfono en formato internacional para los enlaces de WhatsApp.
 * Los celulares de Colombia se guardan con 10 dígitos, sin el indicativo 57.
 */
export function telefonoParaWhatsApp(telefono) {
  const digitos = String(telefono ?? '').replace(/\D/g, '');
  if (!digitos) return '';
  if (digitos.length === 10) return `57${digitos}`;
  return digitos;
}

/** Enlace de WhatsApp con el mensaje ya escrito para enviarlo a la clienta. */
export function enlaceWhatsApp(telefono, mensaje) {
  const numero = telefonoParaWhatsApp(telefono);
  const texto = encodeURIComponent(mensaje ?? '');
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

/** Mensaje que recibe la clienta con el enlace único de su cita. */
export function mensajeEnlaceCita({ nombre, servicio, profesional, fecha, hora, enlace }) {
  const saludo = nombre ? `Hola ${nombre}, ` : 'Hola, ';
  const detalles = [servicio, profesional].filter(Boolean).join(' con ');
  const cuando = resumenFechaHora(fecha, hora);

  return [
    `${saludo}tu cita en Three Masters quedó agendada.`,
    detalles ? `Servicio: ${detalles}.` : '',
    `Fecha: ${cuando}.`,
    `Revisa el detalle o cancela aquí: ${enlace}`,
  ]
    .filter(Boolean)
    .join('\n');
}
