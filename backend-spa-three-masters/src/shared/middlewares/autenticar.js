export function crearAutenticar(authServicio) {
  if (!authServicio) {
    throw new Error("AuthServicio es requerido para crear el middleware autenticar");
  }

  return async function autenticar(req, res, next) {
    const token = extraerToken(req);
    req.usuario = await authServicio.autenticarToken(token);
    next();
  };
}

export function extraerToken(req) {
  const encabezado = req.get("authorization") || "";
  const [tipo, token] = encabezado.trim().split(/\s+/);

  if (tipo?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}
