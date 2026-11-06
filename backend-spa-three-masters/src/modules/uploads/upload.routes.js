import { Router } from "express";
import { subirImagen } from "./upload.middleware.js";
import { CARPETAS_IMAGENES, subirImagenCloudinary } from "./cloudinary.js";
import { ValidationError } from "../../shared/errors/AppError.js";

export function crearUploadRoutes(guardia) {
  const router = Router();

  // Solo administración: es el único rol que gestiona catálogo y personal.
  router.use(guardia.soloAdministrador);

  router.post("/", subirImagen, async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ValidationError("No se recibió ninguna imagen.");
      }

      const clave = String(req.body?.carpeta || "servicios").trim();
      const carpeta = Object.hasOwn(CARPETAS_IMAGENES, clave)
        ? CARPETAS_IMAGENES[clave]
        : null;

      if (!carpeta) {
        throw new ValidationError("La carpeta de destino no es válida.");
      }

      const resultado = await subirImagenCloudinary(req.file.buffer, carpeta);

      res.status(201).json({ url: resultado.secure_url });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
