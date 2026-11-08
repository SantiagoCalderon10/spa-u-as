// Reglas compartidas de correo y teléfono para todos los formularios.
// El backend replica estas mismas reglas como defensa en profundidad.

export const LONGITUD_TELEFONO = 10;
// 10 dígitos + los dos espacios del formato `312 345 6789`.
export const MAX_TELEFONO_FORMATEADO = 12;
export const EJEMPLO_TELEFONO = '312 345 6789';

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MENSAJES = {
  correo: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
  telefono: `Escribe un teléfono de ${LONGITUD_TELEFONO} dígitos, por ejemplo ${EJEMPLO_TELEFONO}.`,
};

export function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase();
}

export function correoValido(correo) {
  const valor = normalizarCorreo(correo);
  return valor.length >= 6 && valor.length <= 254 && PATRON_CORREO.test(valor);
}

/** Deja únicamente dígitos y recorta al máximo indicado. */
export function soloDigitos(valor, maximo = Infinity) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  return Number.isFinite(maximo) ? digitos.slice(0, maximo) : digitos;
}

/**
 * Teléfono local: exactamente 10 dígitos y sin caracteres que no sean números.
 * Si la clienta pega el número con el indicativo de Colombia (`+57 …`), se
 * descarta el prefijo en lugar de recortar dígitos del número real.
 */
export function digitosTelefono(telefono) {
  let digitos = soloDigitos(telefono);

  if (digitos.length > LONGITUD_TELEFONO && digitos.startsWith('57')) {
    digitos = digitos.slice(2);
  }

  return digitos.slice(0, LONGITUD_TELEFONO);
}

/** Aplica el formato `312 345 6789` mientras se escribe. */
export function formatearTelefono(telefono) {
  const digitos = digitosTelefono(telefono);

  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) {
    return `${digitos.slice(0, 3)} ${digitos.slice(3)}`;
  }
  return `${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`;
}

export function telefonoValido(telefono) {
  return digitosTelefono(telefono).length === LONGITUD_TELEFONO;
}
