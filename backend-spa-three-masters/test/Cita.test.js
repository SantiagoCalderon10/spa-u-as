import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Cita } from '../src/modules/citas/models/domain/Cita.js';
import { EstadoCita, RolUsuario } from '../src/shared/enums.js';
import { ConflictError, ValidationError } from '../src/shared/errors/AppError.js';
import { Fecha } from '../src/shared/utils/Fecha.js';

describe('Modelo de Dominio: Cita', () => {
  let citaBase;

  beforeEach(() => {
    citaBase = Object.assign(new Cita(), {
      _id: 'cita-1',
      idProfesional: 'prof-100',
      idCliente: 'cli-200',
      idServicio: 'serv-300',
      fecha: Fecha.normalizar('2026-11-10'),
      horaInicio: '09:00',
      horaFin: '10:00',
      estado: EstadoCita.CONFIRMADA,
    });
  });

  describe('Consultas de Estado y Duración', () => {
    it('debe calcular la duración en minutos correctamente', () => {
      assert.equal(citaBase.duracionMinutos, 60);
    });

    it('debe reportar esEditable() como true solo cuando el estado es CONFIRMADA', () => {
      assert.equal(citaBase.esEditable(), true);
      assert.equal(citaBase.estaConfirmada, true);

      citaBase.estado = EstadoCita.CANCELADA;
      assert.equal(citaBase.esEditable(), false);
      assert.equal(citaBase.estaCancelada, true);

      citaBase.estado = EstadoCita.COMPLETADA;
      assert.equal(citaBase.esEditable(), false);
      assert.equal(citaBase.estaCompletada, true);
    });
  });

  describe('validarHorario()', () => {
    it('no debe lanzar error cuando horaInicio < horaFin con formato HH:mm válido', () => {
      assert.doesNotThrow(() => citaBase.validarHorario());
    });

    it('debe lanzar ValidationError si la hora de inicio es igual o posterior a la hora de fin', () => {
      citaBase.horaInicio = '10:00';
      citaBase.horaFin = '10:00';
      assert.throws(() => citaBase.validarHorario(), ValidationError);

      citaBase.horaInicio = '11:00';
      citaBase.horaFin = '10:00';
      assert.throws(() => citaBase.validarHorario(), ValidationError);
    });

    it('debe lanzar ValidationError si los formatos de hora son inválidos', () => {
      citaBase.horaInicio = 'invalido';
      assert.throws(() => citaBase.validarHorario(), ValidationError);
    });
  });

  describe('seSolapaCon() (Detección de Colisiones de Horarios)', () => {
    it('debe retornar true cuando dos citas del mismo profesional y misma fecha se cruzan', () => {
      // citaBase: 09:00 a 10:00
      const cruceParcialInicio = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '08:30',
        horaFin: '09:30',
      });
      assert.equal(citaBase.seSolapaCon(cruceParcialInicio), true);

      const cruceParcialFin = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '09:30',
        horaFin: '10:30',
      });
      assert.equal(citaBase.seSolapaCon(cruceParcialFin), true);

      const contenidaDentro = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '09:15',
        horaFin: '09:45',
      });
      assert.equal(citaBase.seSolapaCon(contenidaDentro), true);
    });

    it('debe retornar false si las citas son contiguas (ej. termina a las 10:00 y la otra empieza a las 10:00)', () => {
      const contiguaDespues = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '10:00',
        horaFin: '11:00',
      });
      assert.equal(citaBase.seSolapaCon(contiguaDespues), false);

      const contiguaAntes = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '08:00',
        horaFin: '09:00',
      });
      assert.equal(citaBase.seSolapaCon(contiguaAntes), false);
    });

    it('debe retornar false si pertenecen a diferente profesional aunque coincida el horario', () => {
      const otroProfesional = Object.assign(new Cita(), {
        idProfesional: 'prof-999',
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '09:00',
        horaFin: '10:00',
      });
      assert.equal(citaBase.seSolapaCon(otroProfesional), false);
    });

    it('debe retornar false si tienen fechas diferentes', () => {
      const otroDia = Object.assign(new Cita(), {
        idProfesional: 'prof-100',
        fecha: Fecha.normalizar('2026-11-11'),
        horaInicio: '09:00',
        horaFin: '10:00',
      });
      assert.equal(citaBase.seSolapaCon(otroDia), false);
    });
  });

  describe('cancelar()', () => {
    it('permite al cliente cancelar sin especificar motivo obligatorio', () => {
      citaBase.cancelar(RolUsuario.CLIENTE);
      assert.equal(citaBase.estado, EstadoCita.CANCELADA);
      assert.equal(citaBase.canceladaPor, RolUsuario.CLIENTE);
      assert.equal(citaBase.motivoCancelacion, 'Cancelada por el cliente');
      assert.ok(citaBase.fechaCancelacion instanceof Date);
    });

    it('permite al cliente cancelar especificando un motivo opcional', () => {
      citaBase.cancelar(RolUsuario.CLIENTE, 'Surgió un imprevisto familiar');
      assert.equal(citaBase.motivoCancelacion, 'Surgió un imprevisto familiar');
    });

    it('exige motivo obligatorio cuando cancela el profesional o el administrador', () => {
      assert.throws(
        () => citaBase.cancelar(RolUsuario.PROFESIONAL, ''),
        ValidationError
      );
      assert.throws(
        () => citaBase.cancelar(RolUsuario.ADMINISTRADOR, '   '),
        ValidationError
      );

      citaBase.cancelar(RolUsuario.PROFESIONAL, 'Incapacidad médica del manicurista');
      assert.equal(citaBase.estado, EstadoCita.CANCELADA);
      assert.equal(citaBase.motivoCancelacion, 'Incapacidad médica del manicurista');
    });

    it('lanza ConflictError si se intenta cancelar una cita que ya no está confirmada', () => {
      citaBase.estado = EstadoCita.COMPLETADA;
      assert.throws(
        () => citaBase.cancelar(RolUsuario.ADMINISTRADOR, 'Motivo'),
        ConflictError
      );
    });
  });

  describe('reprogramar()', () => {
    it('debe actualizar la fecha y los horarios de una cita confirmada', () => {
      citaBase.reprogramar('2026-11-15', '14:00', '15:00');
      assert.equal(Fecha.clave(citaBase.fecha), '2026-11-15');
      assert.equal(citaBase.horaInicio, '14:00');
      assert.equal(citaBase.horaFin, '15:00');
    });

    it('debe lanzar ValidationError si los nuevos horarios son incoherentes (inicio >= fin)', () => {
      assert.throws(
        () => citaBase.reprogramar('2026-11-15', '16:00', '15:00'),
        ValidationError
      );
    });

    it('debe lanzar ConflictError si la cita ya está cancelada o completada', () => {
      citaBase.estado = EstadoCita.CANCELADA;
      assert.throws(
        () => citaBase.reprogramar('2026-11-15', '14:00', '15:00'),
        ConflictError
      );
    });
  });

  describe('completar() y marcarNoAsistida()', () => {
    it('debe transicionar a COMPLETADA solo si estaba confirmada', () => {
      citaBase.completar();
      assert.equal(citaBase.estado, EstadoCita.COMPLETADA);

      assert.throws(() => citaBase.completar(), ConflictError);
    });

    it('debe transicionar a NO_ASISTIO solo si estaba confirmada', () => {
      citaBase.marcarNoAsistida();
      assert.equal(citaBase.estado, EstadoCita.NO_ASISTIO);

      assert.throws(() => citaBase.marcarNoAsistida(), ConflictError);
    });
  });
});

