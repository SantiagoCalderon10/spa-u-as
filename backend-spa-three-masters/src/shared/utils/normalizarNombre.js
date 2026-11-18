/** Comparación de nombres tolerante a mayúsculas, tildes y espacios dobles. */
export function normalizarNombre(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es');
}

/** Nombre listo para guardar: sin espacios sobrantes al inicio, fin o entre palabras. */
export function limpiarNombre(valor) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Indica si `nombre` ya aparece en `elementos`, ignorando el registro que se
 * está editando (idExcluido).
 */
export function nombreDuplicado(nombre, elementos = [], idExcluido) {
  const objetivo = normalizarNombre(nombre);
  if (!objetivo) return false;

  return elementos.some((elemento) => {
    const id = elemento?._id ?? elemento?.id;
    if (idExcluido != null && id != null && String(id) === String(idExcluido)) {
      return false;
    }
    return normalizarNombre(elemento?.nombre) === objetivo;
  });
}
