import { ConflictError, ValidationError } from '../../../../shared/errors/AppError.js';

export class Cliente {
  static normalizarNombre(nombre) {
    if (typeof nombre !== 'string') {
      throw new ValidationError('El nombre de la clienta es requerido');
    }

    const nombreNormalizado = nombre.trim().replace(/\s+/g, ' ');
    if (!nombreNormalizado) {
      throw new ValidationError('El nombre de la clienta es requerido');
    }

    return nombreNormalizado;
  }

  static claveNombre(nombre) {
    return Cliente.normalizarNombre(nombre)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  static normalizarTelefono(telefono) {
    const telefonoNormalizado = String(telefono ?? '').replace(/\D/g, '');

    if (telefonoNormalizado.length < 7 || telefonoNormalizado.length > 15) {
      throw new ValidationError('El teléfono debe tener entre 7 y 15 dígitos');
    }

    return telefonoNormalizado;
  }

  get estaRegistrado() {
    return Boolean(this.idUsuario);
  }

  vincularUsuario(idUsuario) {
    if (this.estaRegistrado) throw new ConflictError('Este cliente ya tiene una cuenta vinculada');
    this.idUsuario = idUsuario;
  }
}
