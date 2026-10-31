# Uso de la inteligencia artificial en el proyecto

*Se documentan las decisiones importantes, no todos los prompts.*

## 1. Herramientas y modelos
| Herramienta | Modelo | Para qué se usa |
|---|---|---|
| Claude (con un Project) | *(completar)* | Diseño, análisis, documentación y revisión crítica |
| Agente del IDE (Antigravity) | *(completar: modelo configurado)* | Implementación del código por piezas pequeñas |

## 2. Qué se delegó y qué no
- **Delegado:** explicar conceptos, borradores, revisión, código repetitivo, casos de prueba y borradores de diagramas.
- **Decidido siempre por el equipo:** necesidades del negocio, alcance, prioridades, arquitectura y reglas de negocio.
- Criterio: si no se puede explicar con palabras propias en la sustentación, no se adopta.

## 3. Arquitectura de la solución con IA
- **Instrucciones permanentes:** `AGENTS.md` (reglas, arquitectura, seguridad, forma de trabajo).
- **Contexto del proyecto:** `docs/contexto/` y `docs/requisitos/funcionalidades.md`, que el agente lee antes de actuar.
- **Workflows:** `/registrar-decision-ia` para proponer entradas de esta bitácora.
- **Agentes y skills:** *(completar si se usan)*
- **Project de Claude:** instrucciones y archivo de contexto (versión y fecha).

## 4. Mecanismos de control
- Revisión humana de cada cambio antes de integrarlo (Pull Request revisado por el otro integrante).
- El agente trabaja en ramas y no hace push a `main`.
- Regla de detenerse y preguntar si algo contradice los documentos.
- Pruebas de las reglas del dominio y de los casos de error.
- Verificación de lo técnico con documentación oficial.
- Sin credenciales ni datos reales de clientes en ningún prompt.

## 5. Reglas de negocio que se le dieron
Resumen en `docs/contexto/arquitectura-y-datos.md` (sección 4). Cambios relevantes se anotan en el registro.

## 6. Registro de decisiones
| Fecha | Decisión | Alternativas | Qué recomendó la IA | Qué decidió el equipo y por qué | Quién | Documentos afectados |
|---|---|---|---|---|---|---|
| 2026-10-?? | La cita nace confirmada | Pendiente, confirmada por la administradora | Confirmada, para no crear un cuello de botella | *(completar)* | | funcionalidades, modelo |
| 2026-10-?? | Cliente identificado por teléfono y nombre | Sobrescribir, conservar el primero | Teléfono y nombre | *(completar)* | | modelo |
| 2026-10-?? | Servicios sin repositorios | Con repositorios | Sin repositorios (como en clase) | *(completar)* | | arquitectura |
| 2026-10-29 | Hero público con degradado de respaldo en lugar de la fotografía del diseño | (a) exportar la foto a `src/assets/hero/hero.jpg` y usarla como `background-image`; (b) usar un `<img>` con `object-fit: cover`; (c) dejar el bloque sin imagen | (a) con variable `--hero-photo` documentada en el CSS | El equipo aceptó el respaldo porque la imagen binaria no se pudo exportar en el entorno del agente y el bloque no debía quedar roto. La foto se agrega descomentando una línea cuando se exporte desde Figma | Equipo | `Hero.module.css` |

## 7. Correcciones y rechazos a la IA
Lo más valioso para mostrar criterio propio.
| Fecha | Qué propuso la IA | Por qué se rechazó o corrigió | Qué se hizo |
|---|---|---|---|
| | | | |

## 8. Prompts clave (máximo 10)
| # | Objetivo | Prompt o resumen | Resultado |
|---|---|---|---|
| | | | |

## 9. Lecciones
*(completar al final del proyecto)*