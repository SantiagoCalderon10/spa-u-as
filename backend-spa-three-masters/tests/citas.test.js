import assert from 'node:assert/strict';
import test from 'node:test';

import { Cita } from '../src/modules/citas/models/domain/Cita.js';
import { CitaServicio } from '../src/modules/citas/cita.servicio.js';
import { ClienteServicio } from '../src/modules/clientes/cliente.servicio.js';
import { EstadoCita, RolUsuario } from '../src/shared/enums.js';
import { Fecha } from '../src/shared/utils/Fecha.js';

function crearCita(datos) {
  return Object.assign(new Cita(), datos);
}

function crearServicioFalso() {
  return {
    nombre: 'Manicure',
    precio: 25000,
    activo: true,
    calcularHoraFin() {
      return '11:00';
    },
  };
}

function crearRepositorioFalso() {
  return {
    citasDelDia: [],
    citasGuardadas: [],
    citaPorToken: null,
    async obtenerCitasConfirmadasPorProfesionalYFecha() {
      return this.citasDelDia;
    },
    async crearCita(datos) {
      const documento = {
        ...datos,
        _id: 'cita-1',
        toObject() {
          return { ...this };
        },
      };
      this.citasGuardadas.push(documento);
      return documento;
    },
    async obtenerCitaPorTokenHash() {
      return this.citaPorToken;
    },
    async guardar(cita) {
      this.citaGuardada = cita;
      return cita;
    },
  };
}

function crearClienteRepositorioFalso() {
  return {
    clientes: [],
    async obtenerPorTelefonoYNombre(telefonoNormalizado, nombreNormalizado) {
      return (
        this.clientes.find(
          (cliente) =>
            cliente.telefonoNormalizado === telefonoNormalizado &&
            cliente.nombreNormalizado === nombreNormalizado
        ) || null
      );
    },
    async crearCliente(datos) {
      const documento = {
        _id: `cliente-${this.clientes.length + 1}`,
        ...datos,
      };
      this.clientes.push(documento);
      return documento;
    },
  };
}

function crearServicioDeCitas(
  repositorio,
  clienteServicio = new ClienteServicio(crearClienteRepositorioFalso())
) {
  return new CitaServicio(
    repositorio,
    {
      async obtenerServicioPorId(id) {
        return id === 'servicio-1' ? crearServicioFalso() : null;
      },
    },
    clienteServicio
  );
}

test('detecta solapamiento solo para el mismo profesional y fecha', () => {
  const base = crearCita({
    fecha: Fecha.normalizar('2026-11-10'),
    horaInicio: '10:00',
    horaFin: '11:00',
    idProfesional: 'profesional-1',
  });

  assert.equal(
    base.seSolapaCon(
      crearCita({
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '10:30',
        horaFin: '11:30',
        idProfesional: 'profesional-1',
      })
    ),
    true
  );

  assert.equal(
    base.seSolapaCon(
      crearCita({
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '10:30',
        horaFin: '11:30',
        idProfesional: 'profesional-2',
      })
    ),
    false
  );

  assert.equal(
    base.seSolapaCon(
      crearCita({
        fecha: Fecha.normalizar('2026-11-11'),
        horaInicio: '10:30',
        horaFin: '11:30',
        idProfesional: 'profesional-1',
      })
    ),
    false
  );

  assert.equal(
    base.seSolapaCon(
      crearCita({
        fecha: Fecha.normalizar('2026-11-10'),
        horaInicio: '11:00',
        horaFin: '12:00',
        idProfesional: 'profesional-1',
      })
    ),
    false
  );
});

test('normaliza la fecha a medianoche UTC y rechaza fechas inválidas', () => {
  assert.equal(Fecha.clave(Fecha.normalizar('2026-11-10')), '2026-11-10');
  assert.throws(() => Fecha.normalizar('2026-02-30'));
  assert.throws(() => Fecha.normalizar('10/11/2026'));
});

test('FN-07 calcula la hora de fin, copia el servicio y no expone el token', async () => {
  const repositorio = crearRepositorioFalso();
  const servicio = crearServicioDeCitas(repositorio);

  const resultado = await servicio.crearCita({
    idProfesional: 'profesional-1',
    idCliente: 'cliente-1',
    idServicio: 'servicio-1',
    fecha: '2026-11-10',
    horaInicio: '10:00',
    horaFin: '23:00',
  });

  assert.equal(resultado.cita.horaFin, '11:00');
  assert.equal(resultado.cita.servicio.name, 'Manicure');
  assert.equal(resultado.cita.servicio.price, 25000);
  assert.equal(resultado.cita.estado, EstadoCita.CONFIRMADA);
  assert.equal(Object.hasOwn(resultado.cita, 'tokenHash'), false);
  assert.equal(resultado.enlaceToken.length, 64);
  assert.notEqual(repositorio.citasGuardadas[0].tokenHash, resultado.enlaceToken);
});

test('FN-06 bloquea una cita solapada del mismo profesional', async () => {
  const repositorio = crearRepositorioFalso();
  repositorio.citasDelDia = [
    crearCita({
      fecha: Fecha.normalizar('2026-11-10'),
      horaInicio: '10:30',
      horaFin: '11:30',
      idProfesional: 'profesional-1',
      estado: EstadoCita.CONFIRMADA,
    }),
  ];

  const servicio = crearServicioDeCitas(repositorio);

  await assert.rejects(
    () =>
      servicio.crearCita({
        idProfesional: 'profesional-1',
        idCliente: 'cliente-2',
        idServicio: 'servicio-1',
        fecha: '2026-11-10',
        horaInicio: '10:00',
      }),
    (error) => error.statusCode === 409
  );
});

test('FN-04 permite ver y cancelar una cita con el token', async () => {
  const repositorio = crearRepositorioFalso();
  const cita = crearCita({
    fecha: Fecha.normalizar('2026-11-10'),
    horaInicio: '10:00',
    horaFin: '11:00',
    idProfesional: 'profesional-1',
    estado: EstadoCita.CONFIRMADA,
  });
  repositorio.citaPorToken = cita;

  const servicio = crearServicioDeCitas(repositorio);

  const vista = await servicio.obtenerCitaPorToken('token-de-prueba');
  assert.equal(vista, cita);

  const cancelada = await servicio.cancelarCitaPorToken('token-de-prueba');
  assert.equal(cancelada.estado, EstadoCita.CANCELADA);
  assert.equal(cancelada.canceladaPor, RolUsuario.CLIENTE);
  assert.ok(cancelada.fechaCancelacion instanceof Date);
});

test('FN-03 reutiliza la clienta por teléfono y nombre normalizados', async () => {
  const clienteRepositorio = crearClienteRepositorioFalso();
  const clienteServicio = new ClienteServicio(clienteRepositorio);

  const primero = await clienteServicio.obtenerOCrearCliente({
    nombre: '  Ana   Pérez ',
    telefono: '300 123 4567',
  });
  const segundo = await clienteServicio.obtenerOCrearCliente({
    nombre: 'ana perez',
    telefono: '3001234567',
  });
  const tercero = await clienteServicio.obtenerOCrearCliente({
    nombre: 'Otra Persona',
    telefono: '3001234567',
  });

  assert.equal(primero._id, segundo._id);
  assert.notEqual(primero._id, tercero._id);
  assert.equal(primero.nombre, 'Ana Pérez');
  assert.equal(primero.telefono, '3001234567');
  assert.equal(primero.nombreNormalizado, 'ana perez');
  assert.equal(clienteRepositorio.clientes.length, 2);
});

test('FN-03 agenda sin cuenta creando el cliente y su cita', async () => {
  const citaRepositorio = crearRepositorioFalso();
  const clienteRepositorio = crearClienteRepositorioFalso();
  const clienteServicio = new ClienteServicio(clienteRepositorio);
  const servicio = crearServicioDeCitas(citaRepositorio, clienteServicio);

  const resultado = await servicio.crearCitaPublica({
    cliente: { nombre: 'Ana Pérez', telefono: '300 123 4567' },
    idProfesional: 'profesional-1',
    idServicio: 'servicio-1',
    fecha: '2026-11-10',
    horaInicio: '10:00',
  });

  assert.equal(resultado.cita.idCliente, 'cliente-1');
  assert.equal(resultado.cita.horaFin, '11:00');
  assert.equal(resultado.enlaceToken.length, 64);
  assert.equal(clienteRepositorio.clientes.length, 1);
});
