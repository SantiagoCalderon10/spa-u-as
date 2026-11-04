import { extraerToken } from "./autenticar.js";

/**
 * Autenticación opcional para rutas públicas que aprovechan la sesión.
 * Si no hay token, o el token ya no sirve, la petición sigue como invitada:
 * nunca bloquea el agendamiento público.
 */
export function crearAutenticarOpcional(authServicio) {
  if (!authServicio) {
    throw new Error("AuthServicio es requerido para crear el middleware autenticarOpcional");
  }

  return async function autenticarOpcional(req, res, next) {
    const token = extraerToken(req);
    if (!token) {
      req.usuario = null;
      return next();
    }

    try {
      req.usuario = await authServicio.autenticarToken(token);
    } catch {
      req.usuario = null;
    }

    next();
  };
}
