import { Hora } from '../../../../shared/utils/Hora.js';

export class Horario {
  get duracionMinutos() {
    return Hora.aMinutos(this.horaFin) - Hora.aMinutos(this.horaInicio);
  }

  cubre(horaInicio, horaFin) {
    return Hora.aMinutos(horaInicio) >= Hora.aMinutos(this.horaInicio)
      && Hora.aMinutos(horaFin) <= Hora.aMinutos(this.horaFin);
  }

  seSolapaCon(otro) {
    return String(this.idProfesional) === String(otro.idProfesional)
      && Number(this.diaSemana) === Number(otro.diaSemana)
      && Hora.aMinutos(this.horaInicio) < Hora.aMinutos(otro.horaFin)
      && Hora.aMinutos(this.horaFin) > Hora.aMinutos(otro.horaInicio);
  }
}

