import { useCallback, useEffect, useState } from 'react';
import {
  actualizarHorario,
  crearHorario,
  eliminarHorario,
  getHorarios,
} from '../api/horarioService';
import { cuerpoHorario } from '../utils/agenda';
import { mensajeDeError } from '../utils/catalogo';

export function useHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getHorarios({ signal });
      setHorarios(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar los horarios.'));
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  const recargar = useCallback(() => cargar(), [cargar]);

  const crear = useCallback(
    async (datos) => {
      await crearHorario(cuerpoHorario(datos));
      await recargar();
    },
    [recargar]
  );

  const actualizar = useCallback(
    async (id, datos) => {
      await actualizarHorario(id, cuerpoHorario(datos));
      await recargar();
    },
    [recargar]
  );

  const eliminar = useCallback(
    async (id) => {
      await eliminarHorario(id);
      await recargar();
    },
    [recargar]
  );

  return { horarios, cargando, error, recargar, crear, actualizar, eliminar };
}
