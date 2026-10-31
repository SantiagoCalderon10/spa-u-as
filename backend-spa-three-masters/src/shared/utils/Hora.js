
export class Hora {
  static #FORMATO = /^([01]\d|2[0-3]):[0-5]\d$/;

  static esValida(texto) {
    return typeof texto === 'string' && Hora.#FORMATO.test(texto);
  }

  static aMinutos(texto) {
    if (!Hora.esValida(texto)) throw new Error(`Hora inválida: ${texto}`);
    const [horas, minutos] = texto.split(':').map(Number);
    return horas * 60 + minutos;
  }

  static aTexto(minutos) {
    const h = String(Math.floor(minutos / 60)).padStart(2, '0');
    const m = String(minutos % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  static sumar(texto, minutos) {
    const total = Hora.aMinutos(texto) + minutos;
    if (total >= 24 * 60) throw new Error('El horario termina después de la medianoche');
    return Hora.aTexto(total);
  }
}