import { useLayoutEffect } from 'react';

/**
 * Anima la entrada de las secciones a medida que aparecen en pantalla.
 *
 * - Aplica `.ui-reveal` antes del primer pintado (useLayoutEffect) para evitar
 *   el parpadeo de contenido visible que salta a invisible.
 * - Si el navegador no soporta IntersectionObserver o la persona pidió reducir
 *   el movimiento, todo se muestra de inmediato.
 *
 * @param {string} selector Selector de los elementos que se revelarán.
 */
export default function useScrollReveal(selector = 'main > section:not(:first-child)') {
  useLayoutEffect(() => {
    const elementos = Array.from(document.querySelectorAll(selector));
    if (elementos.length === 0) return undefined;

    const reducido =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducido || typeof IntersectionObserver === 'undefined') {
      elementos.forEach((elemento) => elemento.classList.add('ui-reveal', 'ui-reveal--visible'));
      return undefined;
    }

    elementos.forEach((elemento) => elemento.classList.add('ui-reveal'));

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('ui-reveal--visible');
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elementos.forEach((elemento) => observador.observe(elemento));

    return () => observador.disconnect();
  }, [selector]);
}
