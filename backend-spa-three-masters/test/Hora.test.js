import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Hora } from '../src/shared/utils/Hora.js';

describe('Utilidad de Dominio: Hora', () => {
  describe('esValida()', () => {
    it('debe retornar true para formatos de hora válidos HH:mm (24 horas)', () => {
      assert.equal(Hora.esValida('00:00'), true);
      assert.equal(Hora.esValida('08:30'), true);
      assert.equal(Hora.esValida('13:45'), true);
      assert.equal(Hora.esValida('23:59'), true);
    });

    it('debe retornar false para horas fuera del rango permitido', () => {
      assert.equal(Hora.esValida('24:00'), false);
      assert.equal(Hora.esValida('25:10'), false);
      assert.equal(Hora.esValida('12:60'), false);
      assert.equal(Hora.esValida('-01:00'), false);
    });

    it('debe retornar false para formatos incompletos, tipos erróneos o vacíos', () => {
      assert.equal(Hora.esValida('8:30'), false); // falta cero inicial
      assert.equal(Hora.esValida('14:5'), false); // falta dígito de minuto
      assert.equal(Hora.esValida(''), false);
      assert.equal(Hora.esValida(null), false);
      assert.equal(Hora.esValida(undefined), false);
      assert.equal(Hora.esValida(1230), false);
    });
  });

  describe('aMinutos()', () => {
    it('debe convertir correctamente una hora a minutos desde medianoche', () => {
      assert.equal(Hora.aMinutos('00:00'), 0);
      assert.equal(Hora.aMinutos('01:30'), 90);
      assert.equal(Hora.aMinutos('08:15'), 495);
      assert.equal(Hora.aMinutos('23:59'), 1439);
    });

    it('debe lanzar error cuando el formato de hora es inválido', () => {
      assert.throws(() => Hora.aMinutos('hora-invalida'), {
        message: /Hora inválida/,
      });
      assert.throws(() => Hora.aMinutos('25:00'), {
        message: /Hora inválida/,
      });
    });
  });

  describe('aTexto()', () => {
    it('debe formatear minutos en formato HH:mm con ceros a la izquierda', () => {
      assert.equal(Hora.aTexto(0), '00:00');
      assert.equal(Hora.aTexto(90), '01:30');
      assert.equal(Hora.aTexto(545), '09:05');
      assert.equal(Hora.aTexto(1439), '23:59');
    });
  });

  describe('sumar()', () => {
    it('debe sumar minutos a una hora y retornar la nueva hora en formato HH:mm', () => {
      assert.equal(Hora.sumar('09:00', 30), '09:30');
      assert.equal(Hora.sumar('10:45', 45), '11:30');
      assert.equal(Hora.sumar('14:15', 60), '15:15');
    });

    it('debe lanzar error si el resultado cruza la medianoche (>= 24 horas)', () => {
      assert.throws(() => Hora.sumar('23:30', 45), {
        message: /El horario termina después de la medianoche/,
      });
      assert.throws(() => Hora.sumar('23:00', 60), {
        message: /El horario termina después de la medianoche/,
      });
    });
  });
});

