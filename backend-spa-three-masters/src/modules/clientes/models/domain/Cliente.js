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
    let telefonoNormalizado = String(telefono ?? '').replace(/\D/g, '');

    // Si llega con el indicativo de Colombia (+57 …), se descarta el prefijo
    // antes de validar: el número local debe quedar en 10 dígitos.
    if (telefonoNormalizado.length > 10 && telefonoNormalizado.startsWith('57')) {
      telefonoNormalizado = telefonoNormalizado.slice(2);
    }

    if (telefonoNormalizado.length !== 10) {
      throw new ValidationError('El teléfono debe tener exactamente 10 dígitos');
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
