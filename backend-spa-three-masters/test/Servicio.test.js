import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Servicio } from '../src/modules/servicios/models/domain/Servicio.js';

describe('Modelo de Dominio: Servicio', () => {
  let servicio;

  beforeEach(() => {
    servicio = Object.assign(new Servicio(), {
      _id: 'serv-1',
      nombre: 'Manicura Semipermanente',
      precio: 45000,
      duracion: 60, // 60 minutos
      estado: true,
    });
  });

  describe('calcularHoraFin(horaInicio)', () => {
    it('debe calcular la hora de fin sumando la duración en minutos del servicio', () => {
      // 09:30 + 60 min = 10:30
      assert.equal(servicio.calcularHoraFin('09:30'), '10:30');

      servicio.duracion = 45; // 45 min
      // 14:15 + 45 min = 15:00
      assert.equal(servicio.calcularHoraFin('14:15'), '15:00');
    });

    it('debe propagar error si la hora calculada sobrepasa la medianoche', () => {
      servicio.duracion = 90;
      assert.throws(() => servicio.calcularHoraFin('23:00'), {
        message: /El horario termina después de la medianoche/,
      });
    });
  });

  describe('cambiarPrecio(nuevoPrecio)', () => {
    it('debe actualizar el precio si se recibe un número válido y mayor o igual a cero', () => {
      servicio.cambiarPrecio(50000);
      assert.equal(servicio.precio, 50000);

      servicio.cambiarPrecio(0); // Promoción / cortesía
      assert.equal(servicio.precio, 0);
    });

    it('debe lanzar error si el precio es negativo', () => {
      assert.throws(() => servicio.cambiarPrecio(-1000), {
        message: /El precio debe ser un número mayor o igual a cero/,
      });
    });

    it('debe lanzar error si el precio no es un número finito válido', () => {
      assert.throws(() => servicio.cambiarPrecio('45000'), {
        message: /El precio debe ser un número mayor o igual a cero/,
      });
      assert.throws(() => servicio.cambiarPrecio(NaN), {
        message: /El precio debe ser un número mayor o igual a cero/,
      });
      assert.throws(() => servicio.cambiarPrecio(Infinity), {
        message: /El precio debe ser un número mayor o igual a cero/,
      });
      assert.throws(() => servicio.cambiarPrecio(null), {
        message: /El precio debe ser un número mayor o igual a cero/,
      });
    });
  });

  describe('activar() y desactivar()', () => {
    it('debe cambiar el estado del servicio a inactivo (false)', () => {
      assert.equal(servicio.estado, true);
      servicio.desactivar();
      assert.equal(servicio.estado, false);
      assert.equal(servicio.activo, false);
    });

    it('debe reactivar el servicio correctamente', () => {
      servicio.desactivar();
      assert.equal(servicio.estado, false);
      servicio.activar();
      assert.equal(servicio.estado, true);
      assert.equal(servicio.activo, true);
    });
  });
});

