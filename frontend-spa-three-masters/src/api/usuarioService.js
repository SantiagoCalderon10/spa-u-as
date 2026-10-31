import axiosClient from './axiosClient';

export const getUsuarios = async ({ signal } = {}) => {
  const response = await axiosClient.get('/usuarios', { signal });
  return response.data;
};

export const crearUsuario = async (datos) => {
  const response = await axiosClient.post('/usuarios', datos);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  const response = await axiosClient.delete(`/usuarios/${id}`);
  return response.data;
};
