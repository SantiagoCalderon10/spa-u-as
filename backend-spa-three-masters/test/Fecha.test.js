import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Fecha } from '../src/shared/utils/Fecha.js';

describe('Utilidad de Dominio: Fecha', () => {
  describe('normalizar()', () => {
    it('debe normalizar cadenas YYYY-MM-DD a Date en UTC medianoche', () => {
      const fecha = Fecha.normalizar('2026-11-04');
      assert.ok(fecha instanceof Date);
      assert.equal(fecha.getUTCFullYear(), 2026);
      assert.equal(fecha.getUTCMonth(), 10); // Noviembre es mes 10 (0-indexado)
      assert.equal(fecha.getUTCDate(), 4);
      assert.equal(fecha.getUTCHours(), 0);
      assert.equal(fecha.getUTCMinutes(), 0);
    });

    it('debe aceptar instancias de Date válidas y normalizarlas a UTC', () => {
      const original = new Date(Date.UTC(2026, 5, 15, 14, 30));
      const normalizada = Fecha.normalizar(original);
      assert.equal(normalizada.getUTCFullYear(), 2026);
      assert.equal(normalizada.getUTCMonth(), 5);
      assert.equal(normalizada.getUTCDate(), 15);
      assert.equal(normalizada.getUTCHours(), 0);
    });

    it('debe rechazar fechas calendario inexistentes (ej. 30 de febrero o mes 13)', () => {
      assert.throws(() => Fecha.normalizar('2026-02-30'), {
        message: /Fecha inválida/,
      });
      assert.throws(() => Fecha.normalizar('2026-13-01'), {
        message: /Fecha inválida/,
      });
    });

    it('debe rechazar entradas con formatos inválidos o tipos incorrectos', () => {
      assert.throws(() => Fecha.normalizar('04/11/2026'), {
        message: /Fecha inválida/,
      });
      assert.throws(() => Fecha.normalizar('fecha-invalida'), {
        message: /Fecha inválida/,
      });
      assert.throws(() => Fecha.normalizar(null), {
        message: /La fecha debe ser un texto/,
      });
      assert.throws(() => Fecha.normalizar(12345), {
        message: /La fecha debe ser un texto/,
      });
    });
  });

  describe('clave()', () => {
    it('debe generar una clave de fecha en formato exacto YYYY-MM-DD', () => {
      assert.equal(Fecha.clave('2026-03-05'), '2026-03-05');
      const dateUtc = new Date(Date.UTC(2026, 0, 9));
      assert.equal(Fecha.clave(dateUtc), '2026-01-09');
    });

    it('debe lanzar error si se pasa una fecha inválida a clave()', () => {
      assert.throws(() => Fecha.clave('invalido'), {
        message: /Fecha inválida/,
      });
    });
  });

  describe('finDelDia()', () => {
    it('debe retornar exactamente 24 horas después de la medianoche UTC', () => {
      const inicio = Fecha.normalizar('2026-11-04');
      const fin = Fecha.finDelDia('2026-11-04');
      const diferenciaMs = fin.getTime() - inicio.getTime();
      const veinticuatroHorasMs = 24 * 60 * 60 * 1000;
      assert.equal(diferenciaMs, veinticuatroHorasMs);
      assert.equal(fin.getUTCDate(), 5);
    });
  });
});

