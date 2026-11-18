import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { CategoriaServicio } from '../src/modules/categorias/categoria.servicio.js';
import { ServicioServicio } from '../src/modules/servicios/servicio.servicio.js';
import { ConflictError, ValidationError } from '../src/shared/errors/AppError.js';

function conMetodosDominio(registro) {
  return {
    activar() {
      this.estado = true;
      this.activo = true;
    },
    desactivar() {
      this.estado = false;
      this.activo = false;
    },
    cambiarPrecio(precio) {
      if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
        throw new Error('El precio debe ser un número mayor o igual a cero');
      }
      this.precio = precio;
    },
    ...registro,
  };
}

function repositorioCategorias(iniciales = []) {
  const categorias = iniciales.map(conMetodosDominio);

  return {
    categorias,
    async obtenerCategorias() {
      return categorias;
    },
    async obtenerCategoriaPorId(id) {
      return categorias.find((categoria) => categoria._id === id) ?? null;
    },
    async crearCategoria(datos) {
      const nueva = conMetodosDominio({ _id: `cat-${categorias.length + 1}`, ...datos });
      categorias.push(nueva);
      return nueva;
    },
    async actualizarCategoria(id, cambios) {
      const indice = categorias.findIndex((categoria) => categoria._id === id);
      if (indice === -1) return null;
      categorias[indice] = conMetodosDominio({ ...categorias[indice], ...cambios });
      return categorias[indice];
    },
  };
}

function repositorioServicios(iniciales = []) {
  const servicios = iniciales.map(conMetodosDominio);

  return {
    servicios,
    async obtenerServicios() {
      return servicios;
    },
    async obtenerServicioPorId(id) {
      return servicios.find((servicio) => servicio._id === id) ?? null;
    },
    async crearServicio(datos) {
      const nuevo = conMetodosDominio({ _id: `srv-${servicios.length + 1}`, ...datos });
      servicios.push(nuevo);
      return nuevo;
    },
    async actualizarServicio(id, cambios) {
      const indice = servicios.findIndex((servicio) => servicio._id === id);
      if (indice === -1) return null;
      servicios[indice] = conMetodosDominio({ ...servicios[indice], ...cambios });
      return servicios[indice];
    },
  };
}

describe('CategoriaServicio: nombres únicos', () => {
  it('rechaza crear una categoría con el mismo nombre (ignora mayúsculas, tildes y espacios)', async () => {
    const servicio = new CategoriaServicio(
      repositorioCategorias([{ _id: 'cat-1', nombre: 'Manicure Express' }])
    );

    await assert.rejects(
      servicio.crearCategoria({ nombre: '  manicure  exprés ' }),
      ConflictError
    );
  });

  it('guarda el nombre de la categoría sin espacios sobrantes', async () => {
    const repositorio = repositorioCategorias();
    const servicio = new CategoriaServicio(repositorio);

    const categoria = await servicio.crearCategoria({ nombre: '  Uñas  Postizas  ' });

    assert.equal(categoria.nombre, 'Uñas Postizas');
  });

  it('permite editar una categoría conservando su propio nombre', async () => {
    const servicio = new CategoriaServicio(
      repositorioCategorias([{ _id: 'cat-1', nombre: 'Manicure' }])
    );

    const categoria = await servicio.actualizarCategoria('cat-1', { nombre: ' manicure ' });

    assert.equal(categoria.nombre, 'manicure');
  });

  it('rechaza editar una categoría con el nombre de otra', async () => {
    const servicio = new CategoriaServicio(
      repositorioCategorias([
        { _id: 'cat-1', nombre: 'Manicure' },
        { _id: 'cat-2', nombre: 'Pedicure' },
      ])
    );

    await assert.rejects(
      servicio.actualizarCategoria('cat-1', { nombre: 'pedicure' }),
      ConflictError
    );
  });

  it('rechaza un nombre vacío', async () => {
    const servicio = new CategoriaServicio(repositorioCategorias());

    await assert.rejects(servicio.crearCategoria({ nombre: '   ' }), ValidationError);
  });
});

describe('ServicioServicio: nombres únicos', () => {
  it('rechaza crear un servicio con el mismo nombre (ignora mayúsculas y espacios)', async () => {
    const servicio = new ServicioServicio(
      repositorioServicios([{ _id: 'srv-1', nombre: 'Manicure Gel' }])
    );

    await assert.rejects(
      servicio.crearServicio({ nombre: ' MANICURE   gel ', precio: 100, duracion: 60 }),
      ConflictError
    );
  });

  it('guarda el nombre del servicio sin espacios sobrantes', async () => {
    const repositorio = repositorioServicios();
    const servicio = new ServicioServicio(repositorio);

    const creado = await servicio.crearServicio({
      nombre: '  Pedicure  Spa  ',
      precio: 120,
      duracion: 60,
    });

    assert.equal(creado.nombre, 'Pedicure Spa');
  });

  it('permite editar un servicio conservando su propio nombre', async () => {
    const servicio = new ServicioServicio(
      repositorioServicios([{ _id: 'srv-1', nombre: 'Manicure Gel' }])
    );

    const actualizado = await servicio.actualizarServicio('srv-1', { nombre: 'manicure gel' });

    assert.equal(actualizado.nombre, 'manicure gel');
  });

  it('rechaza editar un servicio con el nombre de otro', async () => {
    const servicio = new ServicioServicio(
      repositorioServicios([
        { _id: 'srv-1', nombre: 'Manicure' },
        { _id: 'srv-2', nombre: 'Pedicure' },
      ])
    );

    await assert.rejects(
      servicio.actualizarServicio('srv-1', { nombre: ' pedicure ' }),
      ConflictError
    );
  });

  it('mantiene la validación de precio al crear', async () => {
    const servicio = new ServicioServicio(repositorioServicios());

    await assert.rejects(
      servicio.crearServicio({ nombre: 'Nuevo servicio', precio: -1, duracion: 30 }),
      ValidationError
    );
  });
});
