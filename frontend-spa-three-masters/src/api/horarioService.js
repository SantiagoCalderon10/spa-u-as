import axiosClient from './axiosClient';

export const getHorarios = async ({ idProfesional, signal } = {}) => {
  const response = await axiosClient.get('/horarios', {
    signal,
    params: idProfesional ? { idProfesional } : undefined,
  });
  return response.data;
};

export const getHorarioPorId = async (id, { signal } = {}) => {
  const response = await axiosClient.get(`/horarios/${id}`, { signal });
  return response.data;
};

export const crearHorario = async (datos) => {
  const response = await axiosClient.post('/horarios', datos);
  return response.data;
};

export const actualizarHorario = async (id, datos) => {
  const response = await axiosClient.put(`/horarios/${id}`, datos);
  return response.data;
};

export const eliminarHorario = async (id) => {
  const response = await axiosClient.delete(`/horarios/${id}`);
  return response.data;
};
