import axiosClient from './axiosClient';

export const getProfesionales = async ({ signal } = {}) => {
  const response = await axiosClient.get('/profesionales', { signal });
  return response.data;
};

export const getProfesionalPorId = async (id, { signal } = {}) => {
  const response = await axiosClient.get(`/profesionales/${id}`, { signal });
  return response.data;
};

export const crearProfesional = async (datos) => {
  const response = await axiosClient.post('/profesionales', datos);
  return response.data;
};

export const actualizarProfesional = async (id, datos) => {
  const response = await axiosClient.put(`/profesionales/${id}`, datos);
  return response.data;
};

export const eliminarProfesional = async (id) => {
  const response = await axiosClient.delete(`/profesionales/${id}`);
  return response.data;
};
