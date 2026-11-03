import { useCallback, useEffect, useState } from 'react';
import { getMiPerfilProfesional } from '../api/profesionalService';
import { mensajeDeError } from '../utils/catalogo';

export function useMiPerfilProfesional() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getMiPerfilProfesional({ signal });
      setPerfil(datos || null);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar tu perfil profesional.'));
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

  return { perfil, cargando, error, recargar };
}
