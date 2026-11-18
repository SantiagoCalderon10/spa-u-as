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

// Consulta previa para advertir qué citas quedan fuera de la franja.
// Sin `cambios` se evalúa una eliminación; con ellos, una edición.
export const getCitasAfectadas = async (id, cambios, { signal } = {}) => {
  const params = Object.fromEntries(
    Object.entries(cambios ?? {}).filter(
      ([, valor]) => valor !== '' && valor !== null && valor !== undefined
    )
  );

  const response = await axiosClient.get(`/horarios/${id}/citas-afectadas`, {
    params: Object.keys(params).length > 0 ? params : undefined,
    signal,
  });
  return Array.isArray(response.data) ? response.data : [];
};
