import assert from 'node:assert/strict';
import test from 'node:test';

import { Cita } from '../src/modules/citas/models/domain/Cita.js';
import { CitaServicio } from '../src/modules/citas/cita.servicio.js';
import { Cliente } from '../src/modules/clientes/models/domain/Cliente.js';
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
    citaDeCliente: null,
    async obtenerCitasConfirmadasPorProfesionalYFecha() {
      return this.citasDelDia;
    },
    async obtenerCitaDeClientePorId(id, idCliente) {
      const cita = this.citaDeCliente;
      if (!cita) return null;
      if (String(cita._id) !== String(id)) return null;
      if (String(cita.idCliente) !== String(idCliente)) return null;
      return cita;
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
    async obtenerPorUsuario(idUsuario) {
      return (
        this.clientes.find(
          (cliente) => String(cliente.idUsuario) === String(idUsuario)
        ) || null
      );
    },
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
    async guardar(cliente) {
      const indice = this.clientes.findIndex(
        (item) => String(item._id) === String(cliente._id)
      );
      if (indice >= 0) this.clientes[indice] = cliente;
      return cliente;
    },
  };
}

function crearServicioDeCitas(
  repositorio,
  clienteServicio = new ClienteServicio(crearClienteRepositorioFalso()),
  profesionalRepositorio = null
) {
  return new CitaServicio(
    repositorio,
    {
      async obtenerServicioPorId(id) {
        return id === 'servicio-1' ? crearServicioFalso() : null;
      },
    },
    clienteServicio,
    null,
    profesionalRepositorio
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

test('guarda el nombre de la profesional como snapshot en la cita', async () => {
  const repositorio = crearRepositorioFalso();
  const servicio = crearServicioDeCitas(repositorio, undefined, {
    async obtenerProfesionalPorId(id) {
      return id === 'profesional-1'
        ? { idUsuario: { nombrecompleto: 'Marta Gómez' } }
        : null;
    },
  });

  const resultado = await servicio.crearCita({
    idProfesional: 'profesional-1',
    idCliente: 'cliente-1',
    idServicio: 'servicio-1',
    fecha: '2026-11-10',
    horaInicio: '10:00',
  });

  assert.equal(resultado.cita.profesional.nombre, 'Marta Gómez');
});

test('rechaza la cita si la profesional no existe', async () => {
  const repositorio = crearRepositorioFalso();
  const servicio = crearServicioDeCitas(repositorio, undefined, {
    async obtenerProfesionalPorId() {
      return null;
    },
  });

  await assert.rejects(
    () =>
      servicio.crearCita({
        idProfesional: 'profesional-inexistente',
        idCliente: 'cliente-1',
        idServicio: 'servicio-1',
        fecha: '2026-11-10',
        horaInicio: '10:00',
      }),
    (error) => error.statusCode === 404 && /profesional/i.test(error.message)
  );

  assert.equal(repositorio.citasGuardadas.length, 0);
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

test('FN-19 vincula el historial de invitada por teléfono y nombre', async () => {
  const clienteRepositorio = crearClienteRepositorioFalso();
  clienteRepositorio.clientes.push(
    Object.assign(new Cliente(), {
      _id: 'cliente-1',
      nombre: 'Ana Pérez',
      nombreNormalizado: 'ana perez',
      telefono: '3001234567',
      telefonoNormalizado: '3001234567',
      idUsuario: null,
    })
  );

  const servicio = new ClienteServicio(clienteRepositorio);
  const cliente = await servicio.obtenerMiCliente('usuario-1', {
    _id: 'usuario-1',
    nombrecompleto: 'ana  perez',
    telefono: 3001234567,
  });

  assert.equal(cliente._id, 'cliente-1');
  assert.equal(cliente.idUsuario, 'usuario-1');
});

test('FN-19 crea la clienta de la cuenta si no hay historial previo', async () => {
  const clienteRepositorio = crearClienteRepositorioFalso();
  const servicio = new ClienteServicio(clienteRepositorio);

  const cliente = await servicio.obtenerMiCliente('usuario-1', {
    _id: 'usuario-1',
    nombrecompleto: 'Laura Gómez',
    telefono: 3105557788,
  });

  assert.equal(cliente.idUsuario, 'usuario-1');
  assert.equal(cliente.telefonoNormalizado, '3105557788');
  assert.equal(clienteRepositorio.clientes.length, 1);
});

test('FN-19 rechaza reclamar un historial ya vinculado a otra cuenta', async () => {
  const clienteRepositorio = crearClienteRepositorioFalso();
  clienteRepositorio.clientes.push(
    Object.assign(new Cliente(), {
      _id: 'cliente-1',
      nombre: 'Ana Pérez',
      nombreNormalizado: 'ana perez',
      telefono: '3001234567',
      telefonoNormalizado: '3001234567',
      idUsuario: 'usuario-2',
    })
  );

  const servicio = new ClienteServicio(clienteRepositorio);

  await assert.rejects(
    () =>
      servicio.obtenerMiCliente('usuario-1', {
        _id: 'usuario-1',
        nombrecompleto: 'Ana Pérez',
        telefono: 3001234567,
      }),
    /Ya existe una cuenta vinculada a estos datos/
  );
});

test('FN-19 la cita pública con sesión usa la cuenta del token, no el cuerpo', async () => {
  const citaRepositorio = crearRepositorioFalso();
  const clienteRepositorio = crearClienteRepositorioFalso();
  const clienteServicio = new ClienteServicio(clienteRepositorio);
  const servicio = crearServicioDeCitas(citaRepositorio, clienteServicio);

  const resultado = await servicio.crearCitaPublica(
    {
      cliente: { nombre: 'Otra Persona', telefono: '3000000000' },
      idProfesional: 'profesional-1',
      idServicio: 'servicio-1',
      fecha: '2026-11-10',
      horaInicio: '10:00',
    },
    {
      _id: 'usuario-1',
      rol: RolUsuario.CLIENTE,
      nombrecompleto: 'Laura Gómez',
      telefono: 3105557788,
    }
  );

  assert.equal(resultado.cita.idCliente, 'cliente-1');
  assert.equal(clienteRepositorio.clientes.length, 1);
  assert.equal(clienteRepositorio.clientes[0].nombre, 'Laura Gómez');
  assert.equal(clienteRepositorio.clientes[0].idUsuario, 'usuario-1');
});

function crearServicioDeCitasConClienta(citaRepositorio, idCliente = 'cliente-1') {
  const clienteRepositorio = crearClienteRepositorioFalso();
  clienteRepositorio.clientes.push(
    Object.assign(new Cliente(), {
      _id: idCliente,
      nombre: 'Laura Gómez',
      nombreNormalizado: 'laura gomez',
      telefono: '3105557788',
      telefonoNormalizado: '3105557788',
      idUsuario: 'usuario-1',
    })
  );

  const clienteServicio = new ClienteServicio(clienteRepositorio);
  return crearServicioDeCitas(citaRepositorio, clienteServicio);
}

test('FN-24 obtiene el detalle y cancela una cita propia desde la cuenta', async () => {
  const repositorio = crearRepositorioFalso();
  const cita = crearCita({
    _id: 'cita-1',
    fecha: Fecha.normalizar('2026-11-10'),
    horaInicio: '10:00',
    horaFin: '11:00',
    idCliente: 'cliente-1',
    idProfesional: 'profesional-1',
    estado: EstadoCita.CONFIRMADA,
  });
  repositorio.citaDeCliente = cita;

  const servicio = crearServicioDeCitasConClienta(repositorio);
  const usuario = { _id: 'usuario-1', rol: RolUsuario.CLIENTE };

  const detalle = await servicio.obtenerCitaDeCliente('cita-1', 'usuario-1', usuario);
  assert.equal(detalle, cita);

  const cancelada = await servicio.cancelarCitaDeCliente(
    'cita-1',
    'usuario-1',
    usuario,
    'Surgió un imprevisto'
  );
  assert.equal(cancelada.estado, EstadoCita.CANCELADA);
  assert.equal(cancelada.canceladaPor, RolUsuario.CLIENTE);
  assert.equal(cancelada.motivoCancelacion, 'Surgió un imprevisto');
  assert.equal(repositorio.citaGuardada, cita);
});

test('FN-24 no expone ni cancela la cita de otra clienta', async () => {
  const repositorio = crearRepositorioFalso();
  repositorio.citaDeCliente = crearCita({
    _id: 'cita-2',
    fecha: Fecha.normalizar('2026-11-11'),
    horaInicio: '10:00',
    horaFin: '11:00',
    idCliente: 'cliente-2',
    idProfesional: 'profesional-1',
    estado: EstadoCita.CONFIRMADA,
  });

  const servicio = crearServicioDeCitasConClienta(repositorio);
  const usuario = { _id: 'usuario-1', rol: RolUsuario.CLIENTE };

  await assert.rejects(
    () => servicio.obtenerCitaDeCliente('cita-2', 'usuario-1', usuario),
    (error) => error.statusCode === 404
  );

  await assert.rejects(
    () => servicio.cancelarCitaDeCliente('cita-2', 'usuario-1', usuario, ''),
    (error) => error.statusCode === 404
  );

  assert.equal(repositorio.citaGuardada, undefined);
});

test('FN-24 rechaza cancelar una cita que ya no está confirmada', async () => {
  const repositorio = crearRepositorioFalso();
  repositorio.citaDeCliente = crearCita({
    _id: 'cita-1',
    fecha: Fecha.normalizar('2026-11-10'),
    horaInicio: '10:00',
    horaFin: '11:00',
    idCliente: 'cliente-1',
    idProfesional: 'profesional-1',
    estado: EstadoCita.CANCELADA,
  });

  const servicio = crearServicioDeCitasConClienta(repositorio);
  const usuario = { _id: 'usuario-1', rol: RolUsuario.CLIENTE };

  await assert.rejects(
    () => servicio.cancelarCitaDeCliente('cita-1', 'usuario-1', usuario, ''),
    (error) => error.statusCode === 409
  );

  assert.equal(repositorio.citaGuardada, undefined);
});
