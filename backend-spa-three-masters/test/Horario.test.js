import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Horario } from '../src/modules/horarios/models/domain/Horario.js';

describe('Modelo de Dominio: Horario', () => {
  let jornada;

  beforeEach(() => {
    jornada = Object.assign(new Horario(), {
      _id: 'hor-1',
      idProfesional: 'prof-10',
      diaSemana: 1, // Lunes
      horaInicio: '08:00',
      horaFin: '17:00',
    });
  });

  describe('duracionMinutos', () => {
    it('debe calcular la duración en minutos de la jornada laboral', () => {
      // 08:00 a 17:00 = 9 horas = 540 minutos
      assert.equal(jornada.duracionMinutos, 540);
    });
  });

  describe('cubre(horaInicio, horaFin)', () => {
    it('debe retornar true si el intervalo solicitado está completamente dentro de la jornada', () => {
      assert.equal(jornada.cubre('08:00', '09:00'), true);
      assert.equal(jornada.cubre('10:30', '12:00'), true);
      assert.equal(jornada.cubre('16:00', '17:00'), true);
      assert.equal(jornada.cubre('08:00', '17:00'), true); // Coincide exactamente con la jornada
    });

    it('debe retornar false si la hora de inicio es antes de que comience la jornada', () => {
      assert.equal(jornada.cubre('07:30', '09:00'), false);
    });

    it('debe retornar false si la hora de fin sobrepasa el cierre de la jornada', () => {
      assert.equal(jornada.cubre('16:30', '17:30'), false);
    });

    it('debe retornar false si está completamente por fuera de la jornada', () => {
      assert.equal(jornada.cubre('18:00', '19:00'), false);
      assert.equal(jornada.cubre('06:00', '07:00'), false);
    });
  });

  describe('seSolapaCon(otro)', () => {
    it('debe retornar true si es el mismo profesional y día y los turnos se cruzan', () => {
      const turnoTarde = Object.assign(new Horario(), {
        idProfesional: 'prof-10',
        diaSemana: 1,
        horaInicio: '16:00',
        horaFin: '20:00',
      });

      assert.equal(jornada.seSolapaCon(turnoTarde), true);
    });

    it('debe retornar false si son turnos contiguos (ej. 08:00-13:00 y 13:00-17:00)', () => {
      const turnoManana = Object.assign(new Horario(), {
        idProfesional: 'prof-10',
        diaSemana: 1,
        horaInicio: '08:00',
        horaFin: '13:00',
      });

      const turnoTarde = Object.assign(new Horario(), {
        idProfesional: 'prof-10',
        diaSemana: 1,
        horaInicio: '13:00',
        horaFin: '18:00',
      });

      assert.equal(turnoManana.seSolapaCon(turnoTarde), false);
    });

    it('debe retornar false si pertenecen a diferente profesional aunque coincida horario y día', () => {
      const otroProfesional = Object.assign(new Horario(), {
        idProfesional: 'prof-99',
        diaSemana: 1,
        horaInicio: '08:00',
        horaFin: '17:00',
      });

      assert.equal(jornada.seSolapaCon(otroProfesional), false);
    });

    it('debe retornar false si es el mismo profesional pero en diferente día de la semana', () => {
      const martes = Object.assign(new Horario(), {
        idProfesional: 'prof-10',
        diaSemana: 2, // Martes
        horaInicio: '08:00',
        horaFin: '17:00',
      });

      assert.equal(jornada.seSolapaCon(martes), false);
    });
  });
});

