import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { HorarioServicio } from '../src/modules/horarios/horario.servicio.js';
import { Fecha } from '../src/shared/utils/Fecha.js';

const MS_DIA = 24 * 60 * 60 * 1000;

// Miércoles 18 de noviembre de 2026 a mediodía (hora local del salón).
const HOY = new Date(2026, 10, 18, 12, 0, 0);
const BASE = Fecha.normalizar(
  `${HOY.getFullYear()}-${String(HOY.getMonth() + 1).padStart(2, '0')}-${String(
    HOY.getDate()
  ).padStart(2, '0')}`
);

function fechaDe(diaSemana, semanasAdelante = 0) {
  const delta = (diaSemana - BASE.getUTCDay() + 7) % 7;
  return new Date(BASE.getTime() + (delta + semanasAdelante * 7) * MS_DIA);
}

function cita({ id, fecha, horaInicio, horaFin, idProfesional = 'p1', cliente = 'Ana' }) {
  return {
    _id: id,
    idProfesional,
    fecha,
    horaInicio,
    horaFin,
    servicio: { name: 'Manicure' },
    idCliente: { nombre: cliente, telefono: '3123456789' },
  };
}

function repositorioCitas(citas) {
  return {
    async obtenerCitasConfirmadasDesdePorProfesional(idProfesional, desde) {
      return citas.filter(
        (una) =>
          String(una.idProfesional) === String(idProfesional) &&
          una.fecha.getTime() >= desde.getTime()
      );
    },
  };
}

const HORARIO = {
  _id: 'h1',
  idProfesional: 'p1',
  diaSemana: 2,
  horaInicio: '09:00',
  horaFin: '12:00',
};

function crearServicio(citas = []) {
  return new HorarioServicio({}, repositorioCitas(citas), { reloj: () => HOY });
}

describe('HorarioServicio: citas afectadas por cambios en la franja', () => {
  it('detecta y detalla las citas futuras de la franja que se va a eliminar', async () => {
    const servicio = crearServicio([
      cita({ id: 'c1', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00' }),
      cita({ id: 'c2', fecha: fechaDe(2, 2), horaInicio: '09:00', horaFin: '10:00', cliente: 'Luisa' }),
    ]);

    const afectadas = await servicio.citasAfectadas(HORARIO);

    assert.equal(afectadas.length, 2);
    assert.equal(afectadas[0].cliente, 'Ana');
    assert.equal(afectadas[0].servicio, 'Manicure');
    assert.equal(afectadas[0].horaInicio, '10:00');
    assert.equal(typeof afectadas[0].fecha, 'string');
    assert.equal(afectadas[1].cliente, 'Luisa');
  });

  it('ignora citas pasadas, de otro día y de otra profesional', async () => {
    const servicio = crearServicio([
      cita({ id: 'pasada', fecha: fechaDe(2, -2), horaInicio: '10:00', horaFin: '11:00' }),
      cita({ id: 'otrodia', fecha: fechaDe(3, 1), horaInicio: '10:00', horaFin: '11:00' }),
      cita({ id: 'otra', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00', idProfesional: 'p2' }),
    ]);

    assert.deepEqual(await servicio.citasAfectadas(HORARIO), []);
  });

  it('no advierte si la edición sigue cubriendo por completo las citas', async () => {
    const servicio = crearServicio([
      cita({ id: 'c1', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00' }),
    ]);

    const afectadas = await servicio.citasAfectadas(HORARIO, { horaFin: '13:00' });

    assert.deepEqual(afectadas, []);
  });

  it('advierte si la edición desplaza la franja y deja las citas por fuera', async () => {
    const servicio = crearServicio([
      cita({ id: 'c1', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00' }),
      cita({ id: 'c2', fecha: fechaDe(2, 2), horaInicio: '09:00', horaFin: '10:00' }),
    ]);

    const afectadas = await servicio.citasAfectadas(HORARIO, {
      horaInicio: '14:00',
      horaFin: '17:00',
    });

    assert.equal(afectadas.length, 2);
  });

  it('advierte solo por la cita que queda descubierta al acortar el inicio', async () => {
    const servicio = crearServicio([
      cita({ id: 'c1', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00' }),
      cita({ id: 'c2', fecha: fechaDe(2, 2), horaInicio: '09:00', horaFin: '10:00' }),
    ]);

    const afectadas = await servicio.citasAfectadas(HORARIO, { horaInicio: '10:00' });

    assert.deepEqual(afectadas.map((una) => una.id), ['c2']);
  });

  it('advierte si la edición cambia el día de la franja', async () => {
    const servicio = crearServicio([
      cita({ id: 'c1', fecha: fechaDe(2, 1), horaInicio: '10:00', horaFin: '11:00' }),
    ]);

    const afectadas = await servicio.citasAfectadas(HORARIO, { diaSemana: '4' });

    assert.deepEqual(afectadas.map((una) => una.id), ['c1']);
  });

  it('devuelve una lista vacía si no hay repositorio de citas inyectado', async () => {
    const servicio = new HorarioServicio({}, null, { reloj: () => HOY });
    assert.deepEqual(await servicio.citasAfectadas(HORARIO), []);
  });
});
