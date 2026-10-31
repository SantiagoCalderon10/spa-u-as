import Boton from './Boton';
import Dialogo from './Dialogo';
import styles from './Confirmacion.module.css';

export default function Confirmacion({
  titulo,
  children,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar',
  cargando = false,
  onConfirmar,
  onCerrar,
}) {
  return (
    <Dialogo titulo={titulo} onCerrar={onCerrar} bloqueado={cargando} ancho="sm">
      <div className={styles.mensaje}>{children}</div>

      <div className={styles.acciones}>
        <Boton onClick={onCerrar} disabled={cargando}>
          {textoCancelar}
        </Boton>
        <Boton variante="peligro" onClick={onConfirmar} cargando={cargando}>
          {textoConfirmar}
        </Boton>
      </div>
    </Dialogo>
  );
}
