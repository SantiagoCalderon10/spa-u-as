import { CategoriasModel } from './models/entities/Categorias.model.js';

export class CategoriaRepositorio {
  async crearCategoria(categoria) {
    try {
      return await CategoriasModel.create(categoria);
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  async obtenerCategorias() {
    try {
      return await CategoriasModel.find();
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  async obtenerCategoriaPorId(id) {
    try {
      return await CategoriasModel.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener categoría por id: ${error.message}`);
    }
  }

  async actualizarCategoria(id, datosActualizados) {
    try {
      return await CategoriasModel.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  async eliminarCategoria(id) {
    try {
      return await CategoriasModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }
}

