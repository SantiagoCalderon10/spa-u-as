export function errorMiddleware(err, req, res, next) {
  // Errores controlados de nuestra jerarquía (AppError y sus hijas)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Identificador con formato inválido (por ejemplo, un ObjectId mal escrito)
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "El identificador enviado no es válido",
    });
  }

  // Validación de Mongoose (forma de los datos)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Los datos enviados no son válidos",
    });
  }

  // Índice único duplicado (correo, teléfono + nombre, etc.)
  if (err.code === 11000) {
    return res.status(409).json({
      error: "El recurso ya existe",
    });
  }

  // JSON mal formado en el cuerpo de la petición
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "El cuerpo de la petición no es un JSON válido",
    });
  }

  // Errores de subida de archivos (Multer)
  if (err.name === "MulterError") {
    const mensaje =
      err.code === "LIMIT_FILE_SIZE"
        ? "La imagen supera el límite de 5 MB"
        : "No pudimos procesar el archivo enviado";

    return res.status(400).json({ error: mensaje });
  }

  // Error inesperado: no se exponen detalles técnicos al cliente
  console.error("💥 Error inesperado:", err.stack || err.message);
  return res.status(500).json({
    error: "Ocurrió un error interno en el servidor",
  });
}
