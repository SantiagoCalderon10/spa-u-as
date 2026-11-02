import jwt from "jsonwebtoken";

export function firmarToken(payload, secreto, expira = "8h") {
  return jwt.sign(payload, secreto, { expiresIn: expira });
}

export function verificarToken(token, secreto) {
  return jwt.verify(token, secreto);
}
