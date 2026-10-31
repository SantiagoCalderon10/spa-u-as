import { Hora } from '../../../../shared/utils/Hora.js'

export class Servicio {
  calcularHoraFin(horaInicio) {
    return Hora.sumar(horaInicio, this.duracion);
  }

  cambiarPrecio(nuevoPrecio) {
    if (typeof nuevoPrecio !== 'number' || !Number.isFinite(nuevoPrecio) || nuevoPrecio < 0) {
      throw new Error('El precio debe ser un número mayor o igual a cero');
    }
    this.precio = nuevoPrecio;
  }

  desactivar() {
    this.estado = false;
  }
}