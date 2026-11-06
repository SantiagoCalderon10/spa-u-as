import multer from "multer";
import { ValidationError } from "../../shared/errors/AppError.js";

// El archivo se mantiene en memoria solo hasta subirlo a Cloudinary.
const TIPOS_PERMITIDOS = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB

export const subirImagen = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANO_MAXIMO, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      return cb(
        new ValidationError("Formato no permitido. Usa una imagen JPG, PNG, WEBP o AVIF.")
      );
    }
    cb(null, true);
  },
}).single("imagen");
