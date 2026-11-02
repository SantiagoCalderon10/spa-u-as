const CLAVE_TOKEN = 'tm_token';
const CLAVE_USUARIO = 'tm_usuario';

// El token se guarda en localStorage para sobrevivir a recargas.
// Riesgo conocido: si hay XSS, el token queda expuesto. Se mitiga no
// renderizando HTML no confiable y validando siempre en el backend.
function almacen() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function leerToken() {
  return almacen()?.getItem(CLAVE_TOKEN) ?? null;
}

export function leerUsuario() {
  const bruto = almacen()?.getItem(CLAVE_USUARIO);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

export function guardarSesion({ token, usuario } = {}) {
  const store = almacen();
  if (!store) return;

  if (token) store.setItem(CLAVE_TOKEN, token);
  if (usuario) store.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function borrarSesion() {
  const store = almacen();
  if (!store) return;

  store.removeItem(CLAVE_TOKEN);
  store.removeItem(CLAVE_USUARIO);
}

export function notificarSesionExpirada() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tm:sesion-expirada'));
  }
}
