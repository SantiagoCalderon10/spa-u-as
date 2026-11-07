import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ProfesionalServicio } from '../src/modules/profesionales/profesional.servicio.js';
import { Cita } from '../src/modules/citas/models/domain/Cita.js';
import { EstadoCita, RolUsuario } from '../src/shared/enums.js';

// Reloj fijo: sábado 7 de noviembre de 2026, 12:00 (hora local del servidor).
const AHORA = new Date(2026, 10, 7, 12, 0, 0);

function fechaUTC(anio, mes, dia) {
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function crearCita({
  id = 'cita-1',
  fecha = fechaUTC(2026, 11, 8),
  horaInicio = '10:00',
  horaFin = '11:00',
  cliente = { _id: 'cli-1', nombre: 'Ana Pérez', telefono: 3001234567 },
} = {}) {
  return Object.assign(new Cita(), {
    _id: id,
    fecha,
    horaInicio,
    horaFin,
    estado: EstadoCita.CONFIRMADA,
    idProfesional: 'prof-1',
    idCliente: cliente,
    servicio: { name: 'Manicura', price: 50000 },
  });
}

function crearDobles({
  citas = [],
  horarios = [],
  usuario = { _id: 'usu-1', rol: RolUsuario.PROFESIONAL },
} = {}) {
  const estado = {
    citasGuardadas: [],
    profesionalEliminado: null,
    horariosEliminados: null,
    cuentaEliminada: null,
  };

  const profesional = {
    _id: 'prof-1',
    idUsuario: { _id: 'usu-1', nombrecompleto: 'Marta Gómez' },
  };

  const dobles = {
    estado,
    profesionalRepositorio: {
      obtenerProfesionalPorId: async () => profesional,
      eliminarProfesional: async (id) => {
        estado.profesionalEliminado = id;
        return profesional;
      },
    },
    citaRepositorio: {
      obtenerCitasConfirmadasDesdePorProfesional: async () => citas,
      guardar: async (cita) => {
        estado.citasGuardadas.push(cita);
        return cita;
      },
    },
    horarioRepositorio: {
      obtenerPorProfesional: async () => horarios,
      eliminarPorProfesional: async (id) => {
        estado.horariosEliminados = id;
        return { deletedCount: horarios.length };
      },
    },
    usuarioServicio: {
      obtenerUsuarioPorId: async () => usuario,
      eliminarUsuario: async (id) => {
        estado.cuentaEliminada = id;
        return usuario;
      },
    },
  };

  return dobles;
}

function crearServicio(dobles) {
  return new ProfesionalServicio(dobles.profesionalRepositorio, {
    citaRepositorio: dobles.citaRepositorio,
    horarioRepositorio: dobles.horarioRepositorio,
    usuarioServicio: dobles.usuarioServicio,
    reloj: () => AHORA,
  });
}

describe('ProfesionalServicio: baja de una profesional', () => {
  let dobles;
  let servicio;

  beforeEach(() => {
    dobles = crearDobles();
    servicio = crearServicio(dobles);
  });

  describe('resumenBaja(id)', () => {
    it('solo cuenta las citas confirmadas que todavía no se han atendido', async () => {
      const futura = crearCita({ id: 'futura', fecha: fechaUTC(2026, 11, 9) });
      const hoyPendiente = crearCita({
        id: 'hoy-pendiente',
        fecha: fechaUTC(2026, 11, 7),
        horaInicio: '18:00',
        horaFin: '19:00',
      });
      const hoyPasada = crearCita({
        id: 'hoy-pasada',
        fecha: fechaUTC(2026, 11, 7),
        horaInicio: '09:00',
        horaFin: '10:00',
      });
      const ayer = crearCita({ id: 'ayer', fecha: fechaUTC(2026, 11, 6) });

      dobles = crearDobles({
        citas: [futura, hoyPendiente, hoyPasada, ayer],
        horarios: [{ _id: 'hor-1' }, { _id: 'hor-2' }],
      });
      servicio = crearServicio(dobles);

      const resumen = await servicio.resumenBaja('prof-1');

      assert.equal(resumen.horarios, 2);
      assert.deepEqual(
        resumen.citasFuturas.map((cita) => cita._id),
        ['futura', 'hoy-pendiente']
      );
      assert.equal(resumen.citasFuturas[0].cliente.telefono, 3001234567);
      assert.equal(resumen.citasFuturas[0].servicio, 'Manicura');
    });
  });

  describe('eliminarProfesional(id, opciones)', () => {
    it('bloquea la baja si hay citas futuras y no se piden cancelar', async () => {
      dobles = crearDobles({ citas: [crearCita()] });
      servicio = crearServicio(dobles);

      await assert.rejects(
        () => servicio.eliminarProfesional('prof-1'),
        (error) => error.statusCode === 409 && /cita confirmada futura/.test(error.message)
      );

      assert.equal(dobles.estado.profesionalEliminado, null);
      assert.equal(dobles.estado.citasGuardadas.length, 0);
    });

    it('exige motivo cuando se piden cancelar las citas', async () => {
      dobles = crearDobles({ citas: [crearCita()] });
      servicio = crearServicio(dobles);

      await assert.rejects(
        () => servicio.eliminarProfesional('prof-1', { cancelarCitas: true }),
        (error) => error.statusCode === 400 && /motivo/.test(error.message)
      );

      assert.equal(dobles.estado.citasGuardadas.length, 0);
    });

    it('cancela las citas futuras con el motivo y conserva el registro', async () => {
      const cita = crearCita();
      dobles = crearDobles({ citas: [cita] });
      servicio = crearServicio(dobles);

      const resultado = await servicio.eliminarProfesional('prof-1', {
        cancelarCitas: true,
        motivo: 'Profesional retirada del equipo',
      });

      assert.equal(resultado.citasCanceladas.length, 1);
      assert.equal(resultado.citasCanceladas[0].cliente.nombre, 'Ana Pérez');
      assert.equal(cita.estado, EstadoCita.CANCELADA);
      assert.equal(cita.canceladaPor, RolUsuario.ADMINISTRADOR);
      assert.equal(cita.motivoCancelacion, 'Profesional retirada del equipo');
      assert.ok(cita.fechaCancelacion instanceof Date);
      assert.equal(dobles.estado.profesionalEliminado, 'prof-1');
    });

    it('bloquea la baja si hay horarios y no se confirma eliminarlos', async () => {
      dobles = crearDobles({ horarios: [{ _id: 'hor-1' }] });
      servicio = crearServicio(dobles);

      await assert.rejects(
        () => servicio.eliminarProfesional('prof-1'),
        (error) => error.statusCode === 409 && /franja de horario/.test(error.message)
      );

      assert.equal(dobles.estado.profesionalEliminado, null);
    });

    it('elimina horarios y perfil cuando se confirma la baja', async () => {
      dobles = crearDobles({
        horarios: [{ _id: 'hor-1' }, { _id: 'hor-2' }],
      });
      servicio = crearServicio(dobles);

      const resultado = await servicio.eliminarProfesional('prof-1', {
        eliminarHorarios: true,
      });

      assert.equal(resultado.horariosEliminados, 2);
      assert.equal(dobles.estado.horariosEliminados, 'prof-1');
      assert.equal(dobles.estado.profesionalEliminado, 'prof-1');
      assert.equal(resultado.cuentaEliminada, false);
      assert.equal(dobles.estado.cuentaEliminada, null);
    });

    it('elimina también la cuenta de acceso cuando se pide', async () => {
      dobles = crearDobles();
      servicio = crearServicio(dobles);

      const resultado = await servicio.eliminarProfesional('prof-1', {
        eliminarCuenta: true,
      });

      assert.equal(resultado.cuentaEliminada, true);
      assert.equal(dobles.estado.cuentaEliminada, 'usu-1');
      assert.equal(dobles.estado.profesionalEliminado, 'prof-1');
    });

    it('no elimina cuentas que no tengan rol profesional', async () => {
      dobles = crearDobles({
        usuario: { _id: 'usu-1', rol: RolUsuario.ADMINISTRADOR },
      });
      servicio = crearServicio(dobles);

      await assert.rejects(
        () => servicio.eliminarProfesional('prof-1', { eliminarCuenta: true }),
        (error) => error.statusCode === 409 && /rol profesional/.test(error.message)
      );

      assert.equal(dobles.estado.cuentaEliminada, null);
      assert.equal(dobles.estado.profesionalEliminado, null);
    });

    it('permite eliminar una cuenta que ya no existe sin romper la baja', async () => {
      dobles = crearDobles();
      dobles.usuarioServicio.obtenerUsuarioPorId = async () => {
        const { NotFoundError } = await import('../src/shared/errors/AppError.js');
        throw new NotFoundError();
      };
      servicio = crearServicio(dobles);

      const resultado = await servicio.eliminarProfesional('prof-1', {
        eliminarCuenta: true,
      });

      assert.equal(resultado.cuentaEliminada, false);
      assert.equal(dobles.estado.profesionalEliminado, 'prof-1');
    });
  });
});
