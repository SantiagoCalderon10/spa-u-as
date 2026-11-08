import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Cliente } from '../src/modules/clientes/models/domain/Cliente.js';
import { ConflictError, ValidationError } from '../src/shared/errors/AppError.js';

describe('Modelo de Dominio: Cliente', () => {
  describe('normalizarNombre()', () => {
    it('debe limpiar espacios adicionales al inicio, al final y entre palabras', () => {
      const resultado = Cliente.normalizarNombre('   Laura   Camila   Gómez   ');
      assert.equal(resultado, 'Laura Camila Gómez');
    });

    it('debe lanzar ValidationError si el nombre no es una cadena o está vacío', () => {
      assert.throws(() => Cliente.normalizarNombre(''), ValidationError);
      assert.throws(() => Cliente.normalizarNombre('    '), ValidationError);
      assert.throws(() => Cliente.normalizarNombre(null), ValidationError);
      assert.throws(() => Cliente.normalizarNombre(12345), ValidationError);
    });
  });

  describe('claveNombre()', () => {
    it('debe normalizar a minúsculas y remover acentos y tildes para indexación', () => {
      assert.equal(Cliente.claveNombre('Ángela María Núñez'), 'angela maria nunez');
      assert.equal(Cliente.claveNombre('  ÉRIKA   SOFÍA  '), 'erika sofia');
    });
  });

  describe('normalizarTelefono()', () => {
    it('debe extraer solo los dígitos de cadenas con guiones, espacios o paréntesis', () => {
      assert.equal(Cliente.normalizarTelefono('312-456-7890'), '3124567890');
      assert.equal(Cliente.normalizarTelefono('312 456 7890'), '3124567890');
    });

    it('debe descartar el indicativo de Colombia cuando llega en el texto', () => {
      assert.equal(Cliente.normalizarTelefono('+57 (310) 456-7890'), '3104567890');
    });

    it('debe aceptar números directamente y convertirlos a cadena limpia', () => {
      assert.equal(Cliente.normalizarTelefono(3001234567), '3001234567');
    });

    it('debe lanzar ValidationError si el teléfono no tiene exactamente 10 dígitos', () => {
      assert.throws(() => Cliente.normalizarTelefono('123456'), ValidationError); // 6 dígitos
      assert.throws(() => Cliente.normalizarTelefono('300123456'), ValidationError); // 9 dígitos
      assert.throws(() => Cliente.normalizarTelefono('30012345678'), ValidationError); // 11 dígitos
      assert.throws(() => Cliente.normalizarTelefono('1234567890123456'), ValidationError); // 16 dígitos
      assert.throws(() => Cliente.normalizarTelefono(''), ValidationError);
      assert.throws(() => Cliente.normalizarTelefono('abc'), ValidationError);
    });
  });

  describe('Vincular cuenta de usuario (vincularUsuario)', () => {
    it('debe vincular exitosamente un idUsuario si la clienta no tenía cuenta previa', () => {
      const cliente = new Cliente();
      assert.equal(cliente.estaRegistrado, false);

      cliente.vincularUsuario('usuario-123');
      assert.equal(cliente.idUsuario, 'usuario-123');
      assert.equal(cliente.estaRegistrado, true);
    });

    it('debe lanzar ConflictError si ya tiene una cuenta de usuario vinculada', () => {
      const cliente = Object.assign(new Cliente(), {
        idUsuario: 'usuario-existente',
      });

      assert.equal(cliente.estaRegistrado, true);
      assert.throws(
        () => cliente.vincularUsuario('otro-usuario-456'),
        ConflictError
      );
    });
  });
});

