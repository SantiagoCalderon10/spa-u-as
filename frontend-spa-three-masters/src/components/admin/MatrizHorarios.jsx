import { useMemo } from 'react';
import {
  aMinutos,
  formatearDuracionFranja,
  formatearFranja,
  idDeProfesional,
  inicialesDe,
} from '../../utils/agenda';
import styles from './MatrizHorarios.module.css';

function IconoMas() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Vista semanal de las franjas: una fila por profesional y una columna por día.
 * Las franjas se derivan de los mismos datos que la vista de lista, así que no
 * hay lógica de negocio nueva ni cambios en el backend.
 */
export default function MatrizHorarios({ filas, dias, franjas, onEditar, onNueva, onEliminar }) {
  const franjasPorCelda = useMemo(() => {
    const mapa = new Map();

    franjas.forEach((horario) => {
      const clave = `${idDeProfesional(horario)}:${Number(horario.diaSemana)}`;
      if (!mapa.has(clave)) mapa.set(clave, []);
      mapa.get(clave).push(horario);
    });

    mapa.forEach((lista) =>
      lista.sort((a, b) => aMinutos(a.horaInicio) - aMinutos(b.horaInicio))
    );

    return mapa;
  }, [franjas]);

  return (
    <div className={styles.envoltura}>
      <table className={styles.tabla}>
        <caption className={styles.srOnly}>
          Franjas horarias semanales por profesional
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.colProfesional}>
              Profesional
            </th>
            {dias.map((dia) => (
              <th scope="col" key={dia.valor}>
                {dia.etiqueta}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              <th scope="row" className={styles.celdaProfesional}>
                <span className={styles.profesional}>
                  <span className={styles.avatar} aria-hidden="true">
                    {inicialesDe(fila.nombre)}
                  </span>
                  <span className={styles.datosProfesional}>
                    <span className={styles.nombreProfesional}>{fila.nombre}</span>
                    {!fila.existe && <span className={styles.sinPerfil}>Sin perfil</span>}
                  </span>
                </span>
              </th>

              {dias.map((dia) => {
                const clave = `${fila.id}:${dia.valor}`;
                const lista = franjasPorCelda.get(clave) ?? [];

                return (
                  <td key={dia.valor} className={styles.celda}>
                    <div className={styles.contenidoCelda}>
                      {lista.map((horario) => {
                        const rango = formatearFranja(horario.horaInicio, horario.horaFin);
                        const duracion = formatearDuracionFranja(
                          horario.horaInicio,
                          horario.horaFin
                        );

                        return (
                          <div className={styles.franja} key={horario._id}>
                            <button
                              type="button"
                              className={styles.chip}
                              onClick={() => onEditar(horario)}
                              title="Editar franja"
                              aria-label={`Editar la franja del ${dia.etiqueta} de ${rango} de ${fila.nombre}`}
                            >
                              <span className={styles.chipHoras}>{rango}</span>
                              <span className={styles.chipDuracion}>{duracion}</span>
                            </button>
                            <button
                              type="button"
                              className={styles.botonEliminar}
                              onClick={() => onEliminar(horario)}
                              title="Eliminar franja"
                              aria-label={`Eliminar la franja del ${dia.etiqueta} de ${rango} de ${fila.nombre}`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}

                      {fila.existe && (
                        <button
                          type="button"
                          className={styles.botonAgregar}
                          onClick={() => onNueva(fila, dia)}
                          title={`Agregar franja el ${dia.etiqueta}`}
                          aria-label={`Agregar franja el ${dia.etiqueta} para ${fila.nombre}`}
                        >
                          <IconoMas />
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
