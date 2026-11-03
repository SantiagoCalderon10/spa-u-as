import { useCallback, useEffect, useState } from 'react';
import { cancelarCitaProfesional, getCitasProfesional } from '../api/citaService';
import { mensajeDeError } from '../utils/catalogo';

export function useCitasProfesional() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal, silencioso = false) => {
    if (!silencioso) setCargando(true);
    setError('');

    try {
      const datos = await getCitasProfesional({ signal });
      setCitas(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar tus citas.'));
    } finally {
      if (!signal?.aborted && !silencioso) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  const recargar = useCallback(() => cargar(undefined, true), [cargar]);

  const cancelar = useCallback(
    async (id, motivo) => {
      await cancelarCitaProfesional(id, motivo);
      await recargar();
    },
    [recargar]
  );

  return { citas, cargando, error, recargar, cancelar };
}
