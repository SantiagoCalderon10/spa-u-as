import axiosClient from './axiosClient';

export const getCategorias = async ({ signal } = {}) => {
  const response = await axiosClient.get('/categorias', { signal });
  return response.data;
};

export const getCategoriaPorId = async (id, { signal } = {}) => {
  const response = await axiosClient.get(`/categorias/${id}`, { signal });
  return response.data;
};

export const crearCategoria = async (datos) => {
  const response = await axiosClient.post('/categorias', datos);
  return response.data;
};

export const actualizarCategoria = async (id, datos) => {
  const response = await axiosClient.put(`/categorias/${id}`, datos);
  return response.data;
};

export const eliminarCategoria = async (id) => {
  const response = await axiosClient.delete(`/categorias/${id}`);
  return response.data;
};
