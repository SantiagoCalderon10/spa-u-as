import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';

import { AuthServicio } from '../src/modules/auth/auth.servicio.js';
import { permitirRoles } from '../src/shared/middlewares/permitirRoles.js';
import { RolUsuario } from '../src/shared/enums.js';
import { NotFoundError } from '../src/shared/errors/AppError.js';

const SECRETO = 'secreto-de-prueba-suficientemente-largo';

function crearUsuarioServicioFalso() {
  const usuarios = [];

  return {
    usuarios,
    async crearUsuario(datos) {
      const { contrasena, ...resto } = datos;
      const usuario = {
        _id: `usuario-${usuarios.length + 1}`,
        activo: true,
        ...resto,
        contrasenaHash: await bcrypt.hash(contrasena, 4),
      };
      usuarios.push(usuario);
      const { contrasenaHash, ...sinHash } = usuario;
      return sinHash;
    },
    async obtenerPorCorreoConContrasena(correo) {
      return usuarios.find((usuario) => usuario.correo === correo) || null;
    },
    async obtenerUsuarioPorId(id) {
      const usuario = usuarios.find((item) => item._id === id);
      if (!usuario) throw new NotFoundError('Usuario no encontrado');
      const { contrasenaHash, ...sinHash } = usuario;
      return sinHash;
    },
  };
}

function crearAuth(usuarioServicio) {
  return new AuthServicio(usuarioServicio, { jwtSecret: SECRETO });
}

function registrarCliente(auth, correo = 'ana@example.com') {
  return auth.registrar({
    nombreusuario: 'ana',
    correo,
    contrasena: 'secreta1',
    telefono: 3001234567,
    nombrecompleto: 'Ana Pérez',
  });
}

test('el registro público siempre crea un cliente aunque envíen otro rol', async () => {
  const auth = crearAuth(crearUsuarioServicioFalso());

  const { usuario, token } = await auth.registrar({
    nombreusuario: 'ana',
    correo: 'ana@example.com',
    contrasena: 'secreta1',
    telefono: 3001234567,
    nombrecompleto: 'Ana Pérez',
    rol: RolUsuario.ADMINISTRADOR,
  });

  assert.equal(usuario.rol, RolUsuario.CLIENTE);
  assert.equal(usuario.contrasenaHash, undefined);
  assert.equal(typeof token, 'string');
});

test('el login normaliza el correo y devuelve un token sin exponer el hash', async () => {
  const auth = crearAuth(crearUsuarioServicioFalso());
  await registrarCliente(auth);

  const { usuario, token } = await auth.iniciarSesion('  ANA@EXAMPLE.COM ', 'secreta1');

  assert.equal(usuario.correo, 'ana@example.com');
  assert.equal(usuario.contrasenaHash, undefined);
  assert.equal(typeof token, 'string');
});

test('el login rechaza contraseña incorrecta con 401', async () => {
  const auth = crearAuth(crearUsuarioServicioFalso());
  await registrarCliente(auth);

  await assert.rejects(
    () => auth.iniciarSesion('ana@example.com', 'incorrecta'),
    (error) => error.statusCode === 401
  );
});

test('el login rechaza un usuario inactivo con 401', async () => {
  const usuarioServicio = crearUsuarioServicioFalso();
  const auth = crearAuth(usuarioServicio);
  await registrarCliente(auth);
  usuarioServicio.usuarios[0].activo = false;

  await assert.rejects(
    () => auth.iniciarSesion('ana@example.com', 'secreta1'),
    (error) => error.statusCode === 401
  );
});

test('autenticarToken devuelve el usuario vigente y rechaza tokens inválidos', async () => {
  const auth = crearAuth(crearUsuarioServicioFalso());
  const { token } = await registrarCliente(auth);

  const usuario = await auth.autenticarToken(token);
  assert.equal(usuario.correo, 'ana@example.com');
  assert.equal(usuario.contrasenaHash, undefined);

  await assert.rejects(
    () => auth.autenticarToken('token-invalido'),
    (error) => error.statusCode === 401
  );
  await assert.rejects(
    () => auth.autenticarToken(null),
    (error) => error.statusCode === 401
  );
});

function ejecutarMiddleware(middleware, req) {
  return new Promise((resolve) => {
    middleware(req, {}, (error) => resolve(error));
  });
}

test('permitirRoles deja pasar al rol autorizado y bloquea al resto', async () => {
  const middleware = permitirRoles(RolUsuario.ADMINISTRADOR);

  const permitido = await ejecutarMiddleware(middleware, {
    usuario: { rol: RolUsuario.ADMINISTRADOR },
  });
  assert.equal(permitido, undefined);

  const bloqueado = await ejecutarMiddleware(middleware, {
    usuario: { rol: RolUsuario.CLIENTE },
  });
  assert.equal(bloqueado.statusCode, 403);

  const sinSesion = await ejecutarMiddleware(middleware, {});
  assert.equal(sinSesion.statusCode, 401);
});
