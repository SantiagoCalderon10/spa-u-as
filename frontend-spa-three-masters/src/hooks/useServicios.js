import { useCallback, useEffect, useState } from 'react';
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  getServicios,
} from '../api/servicioService';
import { mensajeDeError } from '../utils/catalogo';

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getServicios({ signal });
      setServicios(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar los servicios.'));
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  const crear = useCallback(async (datos) => {
    const servicio = await crearServicio(datos);
    setServicios((previos) => [servicio, ...previos]);
    return servicio;
  }, []);

  const actualizar = useCallback(async (id, datos) => {
    const servicio = await actualizarServicio(id, datos);
    setServicios((previos) => previos.map((item) => (item._id === id ? servicio : item)));
    return servicio;
  }, []);

  const eliminar = useCallback(async (id) => {
    await eliminarServicio(id);
    setServicios((previos) => previos.filter((item) => item._id !== id));
  }, []);

  return { servicios, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}
