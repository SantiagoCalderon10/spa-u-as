import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { actualizarMiPerfil, obtenerMiPerfil } from '../../api/clienteService';
import { getMisCitas } from '../../api/citaService';
import { useAuth } from '../../context/AuthContext';
import { inicialesDe } from '../../utils/agenda';
import { formatearPrecio, mensajeDeError } from '../../utils/catalogo';
import {
  claveDeHoy,
  claveFechaDeCita,
  nombreProfesionalDeCita,
  nombreServicioDeCita,
  precioServicioDeCita,
  resumenHorarioCita,
} from '../../utils/citas';
import { etiquetaEstado, formatearFechaCita } from '../../utils/reserva';
import {
  EJEMPLO_TELEFONO,
  MAX_TELEFONO_FORMATEADO,
  MENSAJES,
  correoValido,
  digitosTelefono,
  formatearTelefono,
  normalizarCorreo,
  telefonoValido,
} from '../../utils/validacion';
import styles from './PerfilCliente.module.css';

function formularioDesde(usuario) {
  return {
    nombrecompleto: usuario?.nombrecompleto ?? '',
    telefono: usuario?.telefono ? formatearTelefono(usuario.telefono) : '',
    correo: usuario?.correo ?? '',
  };
}

function validarFormulario(datos) {
  const errores = {};

  if (datos.nombrecompleto.trim().length < 3) {
    errores.nombrecompleto = 'Escribe tu nombre completo.';
  }
  if (!telefonoValido(datos.telefono)) {
    errores.telefono = MENSAJES.telefono;
  }
  if (!correoValido(datos.correo)) {
    errores.correo = MENSAJES.correo;
  }

  return errores;
}

export default function PerfilClientePage() {
  const { usuario, actualizarUsuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState(() => formularioDesde(usuario));
  const [errores, setErrores] = useState({});
  const [errorGuardado, setErrorGuardado] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let vigente = true;

    // Primero el perfil y después el historial: ambos resuelven el vínculo
    // cuenta ↔ clienta y no conviene que lo hagan en paralelo la primera vez.
    obtenerMiPerfil()
      .then((datosPerfil) => {
        if (!vigente) return null;
        setPerfil(datosPerfil);
        setFormulario(formularioDesde(datosPerfil.usuario));
        return getMisCitas();
      })
      .then((datosCitas) => {
        if (!vigente || !datosCitas) return;
        setCitas(Array.isArray(datosCitas) ? datosCitas : []);
      })
      .catch((err) => {
        if (!vigente) return;
        setError(
          mensajeDeError(err, 'No pudimos cargar tu perfil. Intenta de nuevo en un momento.')
        );
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const { proximas, pasadas } = useMemo(() => {
    const hoy = claveDeHoy();
    const futuras = [];
    const anteriores = [];

    citas.forEach((cita) => {
      const esProxima = cita.estado === 'confirmada' && claveFechaDeCita(cita) >= hoy;
      (esProxima ? futuras : anteriores).push(cita);
    });

    return { proximas: futuras, pasadas: anteriores };
  }, [citas]);

  const completadas = citas.filter((cita) => cita.estado === 'completada').length;
  const datos = perfil?.usuario ?? usuario;
  const primerNombre = (datos?.nombrecompleto ?? '').trim().split(/\s+/)[0] || 'clienta';

  const alCambiar = (campo) => (evento) => {
    const valor =
      campo === 'telefono' ? formatearTelefono(evento.target.value) : evento.target.value;
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
    setExito('');
  };

  const alGuardar = async (evento) => {
    evento.preventDefault();
    setErrorGuardado('');
    setExito('');

    const nuevosErrores = validarFormulario(formulario);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    try {
      const respuesta = await actualizarMiPerfil({
        nombrecompleto: formulario.nombrecompleto.trim(),
        telefono: digitosTelefono(formulario.telefono),
        correo: normalizarCorreo(formulario.correo),
      });

      setPerfil(respuesta);
      setFormulario(formularioDesde(respuesta.usuario));
      actualizarUsuario(respuesta.usuario);
      setExito('Tus datos se actualizaron.');
    } catch (err) {
      setErrorGuardado(
        mensajeDeError(err, 'No pudimos guardar tus datos. Intenta de nuevo.')
      );
    } finally {
      setGuardando(false);
    }
  };

  const salir = () => {
    cerrarSesion();
    navegar('/cuenta', { replace: true });
  };

  if (cargando) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.estado} role="status" aria-live="polite">
            Cargando tu cuenta…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorCard} role="alert">
            <h1 className={styles.errorTitle}>No pudimos abrir tu cuenta</h1>
            <p className={styles.errorTexto}>{error}</p>
            <button type="button" className={styles.secondary} onClick={salir}>
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">
              {inicialesDe(datos?.nombrecompleto ?? '')}
            </span>
            <div className={styles.identityText}>
              <span className={styles.eyebrow}>Mi cuenta</span>
              <h1 className={styles.title}>Hola, {primerNombre}</h1>
              <p className={styles.subtitle}>{datos?.correo}</p>
            </div>
          </div>
          <button type="button" className={styles.secondary} onClick={salir}>
            Cerrar sesión
          </button>
        </header>

        <section className={styles.stats} aria-label="Resumen de tus citas">
          <article className={styles.stat}>
            <span className={styles.statNumero}>{citas.length}</span>
            <span className={styles.statEtiqueta}>Citas en total</span>
          </article>
          <article className={styles.stat}>
            <span className={styles.statNumero}>{proximas.length}</span>
            <span className={styles.statEtiqueta}>Próximas</span>
          </article>
          <article className={styles.stat}>
            <span className={styles.statNumero}>{completadas}</span>
            <span className={styles.statEtiqueta}>Completadas</span>
          </article>
        </section>

        <div className={styles.grid}>
          <section className={styles.card} aria-labelledby="mis-datos">
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle} id="mis-datos">
                Mis datos
              </h2>
              <p className={styles.cardHint}>
                Es la información con la que el salón te contacta.
              </p>
            </div>

            {errorGuardado && (
              <p className={styles.errorGeneral} role="alert">
                {errorGuardado}
              </p>
            )}
            {exito && (
              <p className={styles.exito} role="status">
                {exito}
              </p>
            )}

            <form className={styles.form} onSubmit={alGuardar} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="perfil-nombre">
                  Nombre completo
                </label>
                <input
                  className={styles.input}
                  id="perfil-nombre"
                  type="text"
                  autoComplete="name"
                  value={formulario.nombrecompleto}
                  onChange={alCambiar('nombrecompleto')}
                  aria-invalid={Boolean(errores.nombrecompleto)}
                  aria-describedby={errores.nombrecompleto ? 'perfil-nombre-error' : undefined}
                />
                {errores.nombrecompleto && (
                  <span className={styles.error} id="perfil-nombre-error" role="alert">
                    {errores.nombrecompleto}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="perfil-telefono">
                  Teléfono
                </label>
                <input
                  className={styles.input}
                  id="perfil-telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={MAX_TELEFONO_FORMATEADO}
                  placeholder={EJEMPLO_TELEFONO}
                  value={formulario.telefono}
                  onChange={alCambiar('telefono')}
                  aria-invalid={Boolean(errores.telefono)}
                  aria-describedby={errores.telefono ? 'perfil-telefono-error' : undefined}
                />
                {errores.telefono && (
                  <span className={styles.error} id="perfil-telefono-error" role="alert">
                    {errores.telefono}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="perfil-correo">
                  Correo
                </label>
                <input
                  className={styles.input}
                  id="perfil-correo"
                  type="email"
                  autoComplete="email"
                  value={formulario.correo}
                  onChange={alCambiar('correo')}
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? 'perfil-correo-error' : undefined}
                />
                {errores.correo && (
                  <span className={styles.error} id="perfil-correo-error" role="alert">
                    {errores.correo}
                  </span>
                )}
              </div>

              <button className={styles.primary} type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </form>
          </section>

          <section className={styles.card} aria-labelledby="reserva-cta">
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle} id="reserva-cta">
                Tu próxima cita
              </h2>
              <p className={styles.cardHint}>
                Reserva cuando quieras; tus datos ya están listos.
              </p>
            </div>

            {proximas.length > 0 ? (
              <div className={styles.proxima}>
                <span className={styles.proximaFecha}>
                  {formatearFechaCita(proximas[0].fecha)}
                </span>
                <span className={styles.proximaHora}>
                  {resumenHorarioCita(proximas[0])}
                </span>
                <span className={styles.proximaServicio}>
                  {nombreServicioDeCita(proximas[0])}
                </span>
                <span className={styles.proximaMeta}>
                  Con {nombreProfesionalDeCita(proximas[0])}
                </span>
              </div>
            ) : (
              <p className={styles.vacio}>Todavía no tienes una cita próxima.</p>
            )}

            <Link to="/reservar" className={styles.primary}>
              Reservar una cita
            </Link>
          </section>
        </div>

        <section className={styles.historial} aria-labelledby="historial">
          <div className={styles.historialHead}>
            <h2 className={styles.cardTitle} id="historial">
              Mi historial de citas
            </h2>
            <p className={styles.cardHint}>
              Consulta tus citas próximas y las que ya pasaron.
            </p>
          </div>

          {citas.length === 0 ? (
            <div className={styles.vacioCard}>
              <p className={styles.vacio}>
                Aún no tienes citas registradas con esta cuenta.
              </p>
              <Link to="/reservar" className={styles.textLink}>
                Reserva tu primera cita
              </Link>
            </div>
          ) : (
            <>
              <ListaCitas titulo="Próximas" citas={proximas} vacio="No tienes citas próximas." />
              <ListaCitas titulo="Pasadas" citas={pasadas} vacio="Aún no tienes citas pasadas." />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ListaCitas({ titulo, citas, vacio }) {
  return (
    <div className={styles.grupo}>
      <h3 className={styles.grupoTitulo}>{titulo}</h3>
      {citas.length === 0 ? (
        <p className={styles.vacio}>{vacio}</p>
      ) : (
        <ul className={styles.lista}>
          {citas.map((cita) => {
            const estado = etiquetaEstado(cita.estado);
            return (
              <li key={cita._id} className={styles.cita}>
                <div className={styles.citaFecha}>
                  <span className={styles.citaDia}>{formatearFechaCita(cita.fecha)}</span>
                  <span className={styles.citaHora}>{resumenHorarioCita(cita)}</span>
                </div>

                <div className={styles.citaDetalle}>
                  <span className={styles.citaServicio}>{nombreServicioDeCita(cita)}</span>
                  <span className={styles.citaMeta}>
                    Con {nombreProfesionalDeCita(cita)}
                  </span>
                  {cita.estado === 'cancelada' && cita.motivoCancelacion && (
                    <span className={styles.citaMotivo}>
                      Motivo: {cita.motivoCancelacion}
                    </span>
                  )}
                  <Link to={`/cuenta/citas/${cita._id}`} className={styles.textLink}>
                    Ver detalle
                  </Link>
                </div>

                <div className={styles.citaLado}>
                  <span className={`${styles.badge} ${styles[estado.tono] ?? ''}`}>
                    {estado.etiqueta}
                  </span>
                  <span className={styles.citaPrecio}>
                    {formatearPrecio(precioServicioDeCita(cita))}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
