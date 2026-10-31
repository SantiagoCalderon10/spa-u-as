import axiosClient from './axiosClient';

export const getServicios = async ({ signal } = {}) => {
  const response = await axiosClient.get('/servicios', { signal });
  return response.data;
};

export const getServicioPorId = async (id, { signal } = {}) => {
  const response = await axiosClient.get(`/servicios/${id}`, { signal });
  return response.data;
};

export const crearServicio = async (datos) => {
  const response = await axiosClient.post('/servicios', datos);
  return response.data;
};

export const actualizarServicio = async (id, datos) => {
  const response = await axiosClient.put(`/servicios/${id}`, datos);
  return response.data;
};

export const eliminarServicio = async (id) => {
  const response = await axiosClient.delete(`/servicios/${id}`);
  return response.data;
};
