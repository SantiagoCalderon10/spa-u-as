import { ForbiddenError, UnauthorizedError } from "../errors/AppError.js";

export function permitirRoles(...rolesPermitidos) {
  return function autorizarRol(req, res, next) {
    if (!req.usuario) {
      return next(new UnauthorizedError());
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(new ForbiddenError());
    }

    return next();
  };
}
