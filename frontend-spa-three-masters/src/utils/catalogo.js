import { isAxiosError } from 'axios';

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '—';
  return formatoMoneda.format(numero);
}

export function formatearDuracion(minutos) {
  const total = Number(minutos);
  if (!Number.isFinite(total) || total <= 0) return '—';

  const horas = Math.floor(total / 60);
  const resto = total % 60;

  if (horas === 0) return `${total} min`;
  if (resto === 0) return `${horas} h`;
  return `${horas} h ${resto} min`;
}

export function idCategoriaDe(servicio) {
  const valor = servicio?.idCategoria;
  if (!valor) return '';
  return typeof valor === 'object' ? valor._id ?? '' : valor;
}

export function datosFormularioServicio(servicio) {
  if (!servicio) {
    return {
      nombre: '',
      descripcion: '',
      precio: '',
      duracion: '',
      idCategoria: '',
      urlFoto: '',
      activo: true,
    };
  }

  return {
    nombre: servicio.nombre ?? '',
    descripcion: servicio.descripcion ?? '',
    precio: servicio.precio === undefined || servicio.precio === null ? '' : String(servicio.precio),
    duracion: servicio.duracion === undefined || servicio.duracion === null ? '' : String(servicio.duracion),
    idCategoria: idCategoriaDe(servicio),
    urlFoto: servicio.urlFoto ?? '',
    activo: servicio.activo !== false,
  };
}

export function cuerpoServicio(datos) {
  return {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    duracion: Number(datos.duracion),
    idCategoria: datos.idCategoria || null,
    urlFoto: datos.urlFoto.trim(),
    activo: Boolean(datos.activo),
  };
}

export function datosFormularioCategoria(categoria) {
  if (!categoria) {
    return { nombre: '', descripcion: '', estado: true };
  }

  return {
    nombre: categoria.nombre ?? '',
    descripcion: categoria.descripcion ?? '',
    estado: categoria.estado !== false,
  };
}

export function cuerpoCategoria(datos) {
  return {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    estado: Boolean(datos.estado),
  };
}

export function validarServicio(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'Escribe el nombre del servicio.';
  }

  if (String(datos.precio).trim() === '') {
    errores.precio = 'Ingresa el precio del servicio.';
  } else {
    const precio = Number(datos.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      errores.precio = 'Usa un precio válido, igual o mayor que cero.';
    }
  }

  if (String(datos.duracion).trim() === '') {
    errores.duracion = 'Ingresa la duración en minutos.';
  } else {
    const duracion = Number(datos.duracion);
    if (!Number.isInteger(duracion) || duracion < 1) {
      errores.duracion = 'Usa una duración en minutos mayor que cero.';
    }
  }

  return errores;
}

export function validarCategoria(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'Escribe el nombre de la categoría.';
  }

  return errores;
}

export function mensajeDeError(error, porDefecto = 'No pudimos completar la operación.') {
  if (isAxiosError(error)) {
    const mensajeApi = error.response?.data?.error;
    if (typeof mensajeApi === 'string' && mensajeApi.trim()) {
      return mensajeApi;
    }

    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Intenta de nuevo.';
    }

    if (!error.response) {
      return 'No pudimos conectar con el servidor. Verifica que la API esté en ejecución.';
    }

    if (error.response.status >= 500) {
      return 'El servidor presentó un error. Intenta de nuevo en unos minutos.';
    }
  }

  return porDefecto;
}
