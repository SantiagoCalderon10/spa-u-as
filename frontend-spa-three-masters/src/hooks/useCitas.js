import { useCallback, useEffect, useState } from 'react';
import {
  cancelarCita,
  completarCita,
  getCitas,
  marcarCitaNoAsistio,
  reprogramarCita,
} from '../api/citaService';
import { mensajeDeError } from '../utils/catalogo';

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal, silencioso = false) => {
    if (!silencioso) setCargando(true);
    setError('');

    try {
      const datos = await getCitas({ signal });
      setCitas(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar las citas.'));
    } finally {
      if (!signal?.aborted && !silencioso) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  /** Recarga sin reemplazar la tabla por esqueletos durante las acciones. */
  const recargar = useCallback(() => cargar(undefined, true), [cargar]);

  const cancelar = useCallback(
    async (id, motivo) => {
      await cancelarCita(id, motivo);
      await recargar();
    },
    [recargar]
  );

  const reprogramar = useCallback(
    async (id, datos) => {
      await reprogramarCita(id, datos);
      await recargar();
    },
    [recargar]
  );

  const completar = useCallback(
    async (id) => {
      await completarCita(id);
      await recargar();
    },
    [recargar]
  );

  const marcarNoAsistio = useCallback(
    async (id) => {
      await marcarCitaNoAsistio(id);
      await recargar();
    },
    [recargar]
  );

  return {
    citas,
    cargando,
    error,
    recargar,
    cancelar,
    reprogramar,
    completar,
    marcarNoAsistio,
  };
}
