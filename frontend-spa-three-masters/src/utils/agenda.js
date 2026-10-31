// Utilidades compartidas por los módulos de profesionales y horarios.

// El backend guarda diaSemana con la convención de JavaScript (0 = domingo).
// La agenda del atelier se muestra de lunes a domingo.
export const DIAS_SEMANA = [
  { valor: 1, etiqueta: 'Lunes', corto: 'Lun' },
  { valor: 2, etiqueta: 'Martes', corto: 'Mar' },
  { valor: 3, etiqueta: 'Miércoles', corto: 'Mié' },
  { valor: 4, etiqueta: 'Jueves', corto: 'Jue' },
  { valor: 5, etiqueta: 'Viernes', corto: 'Vie' },
  { valor: 6, etiqueta: 'Sábado', corto: 'Sáb' },
  { valor: 0, etiqueta: 'Domingo', corto: 'Dom' },
];

export function nombreDia(valor) {
  return DIAS_SEMANA.find((dia) => dia.valor === Number(valor))?.etiqueta ?? '—';
}

export function aMinutos(hora) {
  const [horas, minutos] = String(hora ?? '').split(':').map(Number);
  if (!Number.isFinite(horas) || !Number.isFinite(minutos)) return NaN;
  return horas * 60 + minutos;
}

export function duracionFranja(horaInicio, horaFin) {
  const minutos = aMinutos(horaFin) - aMinutos(horaInicio);
  return Number.isFinite(minutos) ? minutos : 0;
}

export function formatearFranja(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return '—';
  return `${horaInicio} – ${horaFin}`;
}

export function formatearDuracionFranja(horaInicio, horaFin) {
  const minutos = duracionFranja(horaInicio, horaFin);
  if (minutos <= 0) return '—';

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas} h`;
  return `${horas} h ${resto} min`;
}

export function idDeProfesional(horario) {
  const valor = horario?.idProfesional;
  if (!valor) return '';
  return typeof valor === 'object' ? valor._id ?? '' : valor;
}

export function nombreDeProfesional(profesional) {
  return (
    profesional?.idUsuario?.nombrecompleto ||
    profesional?.nombrecompleto ||
    'Profesional sin nombre'
  );
}

export function inicialesDe(nombre) {
  const partes = String(nombre ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  return `${partes[0].charAt(0)}${partes[partes.length - 1].charAt(0)}`.toUpperCase();
}

/* ------------------------------ Horarios ------------------------------ */

export function datosFormularioHorario(horario) {
  if (!horario) {
    return { idProfesional: '', diaSemana: '1', horaInicio: '', horaFin: '' };
  }

  return {
    idProfesional: idDeProfesional(horario),
    diaSemana: String(horario.diaSemana ?? 1),
    horaInicio: horario.horaInicio ?? '',
    horaFin: horario.horaFin ?? '',
  };
}

export function cuerpoHorario(datos) {
  return {
    idProfesional: datos.idProfesional,
    diaSemana: Number(datos.diaSemana),
    horaInicio: datos.horaInicio,
    horaFin: datos.horaFin,
  };
}

export function seSolapa(franja, otra) {
  if (!franja || !otra) return false;
  if (Number(franja.diaSemana) !== Number(otra.diaSemana)) return false;

  return (
    aMinutos(franja.horaInicio) < aMinutos(otra.horaFin) &&
    aMinutos(franja.horaFin) > aMinutos(otra.horaInicio)
  );
}

/**
 * Valida una franja contra las que ya existen de la misma profesional.
 * El backend todavía no aplica esta regla: aquí evitamos que la interfaz cree
 * cruces que luego la agenda no sabría interpretar.
 */
export function validarHorario(datos, horarios, idActual) {
  const errores = {};

  if (!datos.idProfesional) {
    errores.idProfesional = 'Elige la profesional.';
  }

  if (datos.diaSemana === '' || Number.isNaN(Number(datos.diaSemana))) {
    errores.diaSemana = 'Elige el día de la semana.';
  }

  if (!datos.horaInicio) {
    errores.horaInicio = 'Indica la hora de inicio.';
  }

  if (!datos.horaFin) {
    errores.horaFin = 'Indica la hora de fin.';
  }

  if (!errores.horaInicio && !errores.horaFin) {
    if (aMinutos(datos.horaFin) <= aMinutos(datos.horaInicio)) {
      errores.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
    }
  }

  if (
    Object.keys(errores).length === 0 &&
    datos.idProfesional &&
    horarios.some(
      (horario) =>
        horario._id !== idActual &&
        idDeProfesional(horario) === datos.idProfesional &&
        seSolapa(datos, horario)
    )
  ) {
    errores.horaInicio = 'Esa franja se cruza con otro horario de la misma profesional.';
  }

  return errores;
}

/* ---------------------------- Profesionales ---------------------------- */

export function datosFormularioProfesional(profesional) {
  if (!profesional) {
    return {
      modo: 'nuevo',
      nombrecompleto: '',
      correo: '',
      telefono: '',
      contrasena: '',
      idUsuario: '',
      anioExperiencia: '',
      urlFoto: '',
      especialidades: [],
    };
  }

  return {
    modo: 'editar',
    nombrecompleto: profesional.idUsuario?.nombrecompleto ?? '',
    correo: profesional.idUsuario?.correo ?? '',
    telefono: profesional.idUsuario?.telefono ? String(profesional.idUsuario.telefono) : '',
    contrasena: '',
    idUsuario: profesional.idUsuario?._id ?? profesional.idUsuario ?? '',
    anioExperiencia:
      profesional.anioExperiencia === undefined || profesional.anioExperiencia === null
        ? ''
        : String(profesional.anioExperiencia),
    urlFoto: profesional.urlFoto ?? '',
    especialidades: (profesional.especialidades ?? []).map((especialidad) =>
      typeof especialidad === 'object' ? especialidad._id : especialidad
    ),
  };
}

export function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(correo ?? '').trim());
}

export function telefonoNormalizado(telefono) {
  return String(telefono ?? '').replace(/\D/g, '');
}

export function validarProfesional(datos) {
  const errores = {};
  const creando = datos.modo === 'nuevo';

  if (creando) {
    if (!datos.nombrecompleto.trim()) {
      errores.nombrecompleto = 'Escribe el nombre completo.';
    }

    if (!correoValido(datos.correo)) {
      errores.correo = 'Usa un correo válido, por ejemplo nombre@atelier.com.';
    }

    const telefono = telefonoNormalizado(datos.telefono);
    if (telefono.length < 7) {
      errores.telefono = 'Escribe un teléfono de al menos 7 dígitos.';
    }

    if (datos.contrasena.length < 6) {
      errores.contrasena = 'La contraseña temporal debe tener al menos 6 caracteres.';
    }
  } else if (datos.modo === 'existente') {
    if (!datos.idUsuario) {
      errores.idUsuario = 'Elige la cuenta que se vinculará al perfil.';
    }
  }

  if (datos.anioExperiencia !== '') {
    const anios = Number(datos.anioExperiencia);
    if (!Number.isInteger(anios) || anios < 0 || anios > 70) {
      errores.anioExperiencia = 'Usa un número entero de años entre 0 y 70.';
    }
  }

  if (datos.especialidades.length === 0) {
    errores.especialidades = 'Marca al menos una especialidad.';
  }

  return errores;
}

export function cuerpoPerfilProfesional(datos) {
  return {
    idUsuario: datos.idUsuario || undefined,
    anioExperiencia: datos.anioExperiencia === '' ? 0 : Number(datos.anioExperiencia),
    urlFoto: datos.urlFoto.trim(),
    especialidades: datos.especialidades,
  };
}

/**
 * `nombreusuario` es obligatorio en el esquema de usuarios y no se pide en el
 * formulario: se deriva del correo. Si el correo es `maria@atelier.com`, el
 * usuario queda como `maria`.
 */
export function cuerpoCuentaProfesional(datos) {
  const correo = datos.correo.trim().toLowerCase();
  const nombreusuario = correo.split('@')[0].replace(/[^a-z0-9._-]/g, '') || 'profesional';

  return {
    nombreusuario,
    nombrecompleto: datos.nombrecompleto.trim(),
    correo,
    telefono: Number(telefonoNormalizado(datos.telefono)),
    contrasena: datos.contrasena,
    rol: 'profesional',
  };
}

export function usuariosVinculables(usuarios, profesionales) {
  const vinculados = new Set(
    profesionales.map((profesional) =>
      typeof profesional.idUsuario === 'object'
        ? profesional.idUsuario?._id
        : profesional.idUsuario
    )
  );

  return usuarios.filter(
    (usuario) => usuario.rol !== 'cliente' && !vinculados.has(usuario._id)
  );
}
