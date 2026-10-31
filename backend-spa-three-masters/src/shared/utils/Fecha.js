export class Fecha {
  static #FORMATO = /^(\d{4})-(\d{2})-(\d{2})$/;

  static normalizar(texto) {
    if (texto instanceof Date) {
      if (Number.isNaN(texto.getTime())) {
        throw new Error('Fecha inválida');
      }
      return new Date(Date.UTC(texto.getUTCFullYear(), texto.getUTCMonth(), texto.getUTCDate()));
    }

    if (typeof texto !== 'string') {
      throw new Error('La fecha debe ser un texto con formato YYYY-MM-DD');
    }

    const coincidencia = Fecha.#FORMATO.exec(texto.slice(0, 10));
    if (!coincidencia) {
      throw new Error(`Fecha inválida: ${texto}`);
    }

    const anio = Number(coincidencia[1]);
    const mes = Number(coincidencia[2]);
    const dia = Number(coincidencia[3]);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));

    if (
      fecha.getUTCFullYear() !== anio ||
      fecha.getUTCMonth() !== mes - 1 ||
      fecha.getUTCDate() !== dia
    ) {
      throw new Error(`Fecha inválida: ${texto}`);
    }

    return fecha;
  }

  static clave(fecha) {
    const valor = fecha instanceof Date ? fecha : Fecha.normalizar(fecha);

    if (Number.isNaN(valor.getTime())) {
      throw new Error('Fecha inválida');
    }

    const anio = valor.getUTCFullYear();
    const mes = String(valor.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(valor.getUTCDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  static finDelDia(texto) {
    return new Date(Fecha.normalizar(texto).getTime() + 24 * 60 * 60 * 1000);
  }
}
