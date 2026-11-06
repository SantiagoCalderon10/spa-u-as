import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config/config.js";
import { AppError } from "../../shared/errors/AppError.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

// Carpetas permitidas: el cliente elige un destino lógico, nunca una ruta libre.
export const CARPETAS_IMAGENES = Object.freeze({
  servicios: "three-masters/servicios",
  profesionales: "three-masters/profesionales",
});

/**
 * Sube un buffer de imagen a Cloudinary y devuelve el resultado del proveedor.
 * La imagen se limita a 1200px por lado y se optimiza automáticamente, así el
 * catálogo no carga fotos de celular de varios megabytes.
 */
export function subirImagenCloudinary(buffer, carpeta) {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    throw new AppError(
      "El almacenamiento de imágenes no está configurado en el servidor.",
      503
    );
  }

  return new Promise((resolve, reject) => {
    const flujo = cloudinary.uploader.upload_stream(
      {
        folder: carpeta,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, resultado) => (error ? reject(error) : resolve(resultado))
    );

    flujo.end(buffer);
  });
}
