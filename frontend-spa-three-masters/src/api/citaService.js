import axiosClient from './axiosClient';

export const obtenerDisponibilidad = async ({ idProfesional, idServicio, fecha, signal } = {}) => {
  const response = await axiosClient.get('/citas/disponibilidad', {
    signal,
    params: { idProfesional, idServicio, fecha },
  });
  return response.data;
};

export const crearCitaPublica = async (datos) => {
  const response = await axiosClient.post('/citas/publica', datos);
  return response.data;
};

export const obtenerCitaPorToken = async (token) => {
  const response = await axiosClient.get(`/citas/enlace/${token}`);
  return response.data;
};

export const cancelarCitaPorToken = async (token, motivo) => {
  const response = await axiosClient.patch(`/citas/enlace/${token}/cancelar`, { motivo });
  return response.data;
};
