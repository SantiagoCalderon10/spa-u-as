import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { limpiarNombre, nombreDuplicado } from '../../shared/utils/normalizarNombre.js';

export class CategoriaServicio {
  constructor(categoriaRepositorio) {
    this.categoriaRepositorio = categoriaRepositorio;
  }

  /** Valida el nombre y devuelve la forma limpia que se guardará. */
  async validarNombre(nombre, idExcluido) {
    const limpio = limpiarNombre(nombre);
    if (!limpio) throw new ValidationError('El nombre de la categoría es obligatorio');

    const categorias = await this.categoriaRepositorio.obtenerCategorias();
    if (nombreDuplicado(limpio, categorias, idExcluido)) {
      throw new ConflictError(`Ya existe una categoría llamada «${limpio}»`);
    }

    return limpio;
  }

  async crearCategoria(datos) {
    const nombre = await this.validarNombre(datos?.nombre);
    return await this.categoriaRepositorio.crearCategoria({ ...datos, nombre });
  }

  async obtenerCategorias() {
    return await this.categoriaRepositorio.obtenerCategorias();
  }

  async obtenerCategoriaPorId(id) {
    const categoria = await this.categoriaRepositorio.obtenerCategoriaPorId(id);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async actualizarCategoria(id, datos) {
    const categoriaExistente = await this.obtenerCategoriaPorId(id);
    const cambios = { ...(datos ?? {}) };

    if (cambios.nombre !== undefined) {
      cambios.nombre = await this.validarNombre(cambios.nombre, id);
    }

    if (cambios.estado !== undefined) {
      if (cambios.estado) {
        categoriaExistente.activar();
      } else {
        categoriaExistente.desactivar();
      }
      cambios.estado = categoriaExistente.estado;
    }

    const categoria = await this.categoriaRepositorio.actualizarCategoria(id, cambios);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async eliminarCategoria(id) {
    const categoria = await this.categoriaRepositorio.eliminarCategoria(id);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }
}
