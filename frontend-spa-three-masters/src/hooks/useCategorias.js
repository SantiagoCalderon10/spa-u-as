import { useCallback, useEffect, useState } from 'react';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  getCategorias,
} from '../api/categoriaService';
import { mensajeDeError } from '../utils/catalogo';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getCategorias({ signal });
      setCategorias(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar las categorías.'));
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
    const categoria = await crearCategoria(datos);
    setCategorias((previas) => [categoria, ...previas]);
    return categoria;
  }, []);

  const actualizar = useCallback(async (id, datos) => {
    const categoria = await actualizarCategoria(id, datos);
    setCategorias((previas) => previas.map((item) => (item._id === id ? categoria : item)));
    return categoria;
  }, []);

  const eliminar = useCallback(async (id) => {
    await eliminarCategoria(id);
    setCategorias((previas) => previas.filter((item) => item._id !== id));
  }, []);

  return { categorias, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}
