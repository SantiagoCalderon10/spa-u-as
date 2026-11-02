import axiosClient from './axiosClient';

export const iniciarSesion = async (correo, contrasena) => {
  const response = await axiosClient.post('/auth/login', { correo, contrasena });
  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await axiosClient.get('/auth/perfil');
  return response.data;
};
