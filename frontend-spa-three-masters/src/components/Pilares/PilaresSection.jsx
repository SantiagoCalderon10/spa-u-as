import sparkle from '../../assets/hero/sparkle.svg';
import styles from './PilaresSection.module.css';

const PILARES = [
  'Un momento solo para ti',
  'Manos cuidadas, siempre',
  'Color con personalidad',
  'Belleza sin prisas',
];

export default function PilaresSection() {
  return (
    <div className={styles.section}>
      <ul className={styles.container}>
        {PILARES.map((pilar) => (
          <li key={pilar} className={styles.pilar}>
            <img src={sparkle} alt="" />
            {pilar}
          </li>
        ))}
      </ul>
    </div>
  );
}
