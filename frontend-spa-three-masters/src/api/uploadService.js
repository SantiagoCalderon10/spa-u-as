import axiosClient from './axiosClient';

// Sube una imagen y devuelve la URL pública que se guarda en `urlFoto`.
// `carpeta` solo acepta los destinos que el backend tiene permitidos.
export const subirImagen = async (
  archivo,
  { carpeta = 'servicios', signal, onProgress } = {}
) => {
  const datos = new FormData();
  datos.append('carpeta', carpeta);
  datos.append('imagen', archivo);

  const response = await axiosClient.post('/uploads', datos, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal,
    // Subir una foto tarda más que una petición JSON normal.
    timeout: 30000,
    onUploadProgress: (evento) => {
      if (!onProgress || !evento.total) return;
      onProgress(Math.round((evento.loaded * 100) / evento.total));
    },
  });

  return response.data.url;
};
