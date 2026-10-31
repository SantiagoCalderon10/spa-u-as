import { useCallback, useEffect, useState } from 'react';
import { getUsuarios } from '../api/usuarioService';
import { mensajeDeError } from '../utils/catalogo';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getUsuarios({ signal });
      setUsuarios(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar las cuentas del personal.'));
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  return { usuarios, cargando, error, recargar: cargar };
}
