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

/* ------------------------- Panel de la profesional ------------------------- */

export const getCitasProfesional = async ({ signal } = {}) => {
  const response = await axiosClient.get('/citas/mias', { signal });
  return response.data;
};

export const cancelarCitaProfesional = async (id, motivo) => {
  const response = await axiosClient.patch(`/citas/mias/${id}/cancelar`, { motivo });
  return response.data;
};

/* ------------------------- Administración ------------------------- */

export const getCitas = async ({ signal } = {}) => {
  const response = await axiosClient.get('/citas', { signal });
  return response.data;
};

export const cancelarCita = async (id, motivo) => {
  const response = await axiosClient.patch(`/citas/${id}/cancelar`, { motivo });
  return response.data;
};

export const reprogramarCita = async (id, { nuevaFecha, nuevaHoraInicio }) => {
  const response = await axiosClient.patch(`/citas/${id}/reprogramar`, {
    nuevaFecha,
    nuevaHoraInicio,
  });
  return response.data;
};

export const completarCita = async (id) => {
  const response = await axiosClient.patch(`/citas/${id}/completar`);
  return response.data;
};

export const marcarCitaNoAsistio = async (id) => {
  const response = await axiosClient.patch(`/citas/${id}/no-asistio`);
  return response.data;
};
