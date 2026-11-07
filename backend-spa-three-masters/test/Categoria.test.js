import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Categoria } from '../src/modules/categorias/models/domain/Categoria.js';

describe('Modelo de Dominio: Categoria', () => {
  let categoria;

  beforeEach(() => {
    categoria = Object.assign(new Categoria(), {
      _id: 'cat-1',
      nombre: 'Uñas Acrílicas',
      descripcion: 'Diseño y esculpido en acrílico profesional',
      estado: true,
    });
  });

  describe('activar() y desactivar()', () => {
    it('debe desactivar la categoría cambiando su estado a false', () => {
      assert.equal(categoria.estado, true);
      categoria.desactivar();
      assert.equal(categoria.estado, false);
    });

    it('debe reactivar la categoría cambiando su estado a true', () => {
      categoria.desactivar();
      assert.equal(categoria.estado, false);
      categoria.activar();
      assert.equal(categoria.estado, true);
    });
  });
});

