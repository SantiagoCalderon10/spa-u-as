import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Profesional } from '../src/modules/profesionales/models/domain/Profesional.js';

describe('Modelo de Dominio: Profesional', () => {
  let profesional;

  beforeEach(() => {
    profesional = Object.assign(new Profesional(), {
      _id: 'prof-1',
      especialidades: ['cat-manicura', 'cat-pedicura'],
      anioExperiencia: 5,
    });
  });

  describe('atiende(servicio)', () => {
    it('debe retornar true si el servicio pertenece a una especialidad del profesional', () => {
      const servicioManicura = { idCategoria: 'cat-manicura' };
      assert.equal(profesional.atiende(servicioManicura), true);
    });

    it('debe retornar false si el servicio no está entre sus especialidades', () => {
      const servicioSpaFacial = { idCategoria: 'cat-facial' };
      assert.equal(profesional.atiende(servicioSpaFacial), false);
    });

    it('debe retornar false si el servicio no tiene idCategoria o el profesional no tiene especialidades', () => {
      assert.equal(profesional.atiende({}), false);
      assert.equal(profesional.atiende(null), false);

      const profSinEspecialidades = Object.assign(new Profesional(), { especialidades: null });
      assert.equal(profSinEspecialidades.atiende({ idCategoria: 'cat-manicura' }), false);
    });
  });

  describe('agregarEspecialidad(idCategoria)', () => {
    it('debe agregar una nueva especialidad si no la tenía previamente', () => {
      profesional.agregarEspecialidad('cat-masajes');
      assert.equal(profesional.especialidades.includes('cat-masajes'), true);
      assert.equal(profesional.especialidades.length, 3);
    });

    it('debe lanzar error si ya cuenta con la especialidad', () => {
      assert.throws(() => profesional.agregarEspecialidad('cat-manicura'), {
        message: /El profesional ya tiene esta especialidad/,
      });
    });
  });

  describe('quitarEspecialidad(idCategoria)', () => {
    it('debe remover la especialidad especificada de su lista', () => {
      profesional.quitarEspecialidad('cat-pedicura');
      assert.equal(profesional.especialidades.includes('cat-pedicura'), false);
      assert.equal(profesional.especialidades.length, 1);
    });

    it('no debe fallar si la especialidad a remover no existía', () => {
      assert.doesNotThrow(() => profesional.quitarEspecialidad('cat-inexistente'));
      assert.equal(profesional.especialidades.length, 2);
    });
  });
});

