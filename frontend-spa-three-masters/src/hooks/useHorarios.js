import { useCallback, useEffect, useState } from 'react';
import {
  actualizarHorario,
  crearHorario,
  eliminarHorario,
  getHorarios,
} from '../api/horarioService';
import { cuerpoHorario } from '../utils/agenda';
import { mensajeDeError } from '../utils/catalogo';

export function useHorarios({ idProfesional, activo = true } = {}) {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(activo);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    if (!activo) {
      setHorarios([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const datos = await getHorarios({ idProfesional, signal });
      setHorarios(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar los horarios.'));
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, [activo, idProfesional]);

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
