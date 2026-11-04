import axiosClient from './axiosClient';

export const obtenerMiPerfil = async ({ signal } = {}) => {
  const response = await axiosClient.get('/clientes/mi-perfil', { signal });
  return response.data;
};

export const actualizarMiPerfil = async (datos) => {
  const response = await axiosClient.put('/clientes/mi-perfil', datos);
  return response.data;
};
