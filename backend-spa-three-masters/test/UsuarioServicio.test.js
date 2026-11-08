import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { UsuarioServicio } from '../src/modules/usuarios/usuario.servicio.js';
import { ValidationError } from '../src/shared/errors/AppError.js';

function crearRepositorioFalso() {
  const usuarios = [];

  return {
    usuarios,

    async obtenerPorCorreo(correo) {
      return usuarios.find((usuario) => usuario.correo === correo) ?? null;
    },

    async crearUsuario(datos) {
      const nuevo = { _id: `usuario-${usuarios.length + 1}`, ...datos };
      usuarios.push(nuevo);
      return nuevo;
    },

    async actualizarUsuario(id, cambios) {
      const indice = usuarios.findIndex((usuario) => usuario._id === id);
      if (indice === -1) return null;
      usuarios[indice] = { ...usuarios[indice], ...cambios };
      return usuarios[indice];
    },
  };
}

function crearServicio() {
  return new UsuarioServicio(crearRepositorioFalso());
}

const REGISTRO_VALIDO = {
  nombreusuario: 'ana',
  correo: '  Ana@Correo.COM ',
  telefono: '312 345 6789',
  nombrecompleto: 'Ana Pérez',
  contrasena: 'secreta1',
};

describe('UsuarioServicio: normalización de correo y teléfono', () => {
  describe('crearUsuario()', () => {
    it('normaliza el correo y deja el teléfono en 10 dígitos numéricos', async () => {
      const servicio = crearServicio();
      const usuario = await servicio.crearUsuario({ ...REGISTRO_VALIDO });

      assert.equal(usuario.correo, 'ana@correo.com');
      assert.equal(usuario.telefono, 3123456789);
      assert.equal(usuario.contrasenaHash, undefined);
    });

    it('descarta el indicativo de Colombia si llega en el teléfono', async () => {
      const servicio = crearServicio();
      const usuario = await servicio.crearUsuario({
        ...REGISTRO_VALIDO,
        telefono: '+57 312 345 6789',
      });

      assert.equal(usuario.telefono, 3123456789);
    });

    it('rechaza un correo con formato inválido', async () => {
      const servicio = crearServicio();

      await assert.rejects(
        servicio.crearUsuario({ ...REGISTRO_VALIDO, correo: 'ana-correo.com' }),
        ValidationError
      );
    });

    it('rechaza teléfonos que no tengan exactamente 10 dígitos', async () => {
      const servicio = crearServicio();

      await assert.rejects(
        servicio.crearUsuario({ ...REGISTRO_VALIDO, telefono: '312345678' }),
        ValidationError
      );
      await assert.rejects(
        servicio.crearUsuario({ ...REGISTRO_VALIDO, telefono: '31234567890' }),
        ValidationError
      );
      await assert.rejects(
        servicio.crearUsuario({ ...REGISTRO_VALIDO, telefono: 'abc' }),
        ValidationError
      );
    });
  });

  describe('actualizarPerfilCliente()', () => {
    it('guarda el teléfono como número de 10 dígitos y normaliza el correo', async () => {
      const repositorio = crearRepositorioFalso();
      const servicio = new UsuarioServicio(repositorio);
      const creado = await servicio.crearUsuario({ ...REGISTRO_VALIDO });

      const actualizado = await servicio.actualizarPerfilCliente(creado._id, {
        telefono: '300 123 4567',
        correo: ' NUEVO@Correo.COM ',
      });

      assert.equal(actualizado.telefono, 3001234567);
      assert.equal(actualizado.correo, 'nuevo@correo.com');
    });

    it('rechaza teléfonos y correos inválidos sin tocar el registro', async () => {
      const repositorio = crearRepositorioFalso();
      const servicio = new UsuarioServicio(repositorio);
      const creado = await servicio.crearUsuario({ ...REGISTRO_VALIDO });

      await assert.rejects(
        servicio.actualizarPerfilCliente(creado._id, { telefono: '300123456' }),
        ValidationError
      );
      await assert.rejects(
        servicio.actualizarPerfilCliente(creado._id, { correo: 'sin-arroba' }),
        ValidationError
      );

      assert.equal(repositorio.usuarios[0].telefono, 3123456789);
      assert.equal(repositorio.usuarios[0].correo, 'ana@correo.com');
    });
  });
});
