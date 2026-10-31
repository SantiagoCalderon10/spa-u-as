# Imágenes de la landing

Los archivos de esta carpeta se sirven tal cual: la ruta `/images/...` del CSS
corresponde a `public/images/...`. **Si un archivo no existe, la sección muestra
un degradado de respaldo y no se rompe nada.**

## Nombres exactos

| Archivo | Dónde se ve | Tamaño en el diseño |
|---|---|---|
| `public/images/barberia-three-masters.jpg` | El salón, foto de la izquierda | 455 × 367 |
| `public/images/galeria/manicura-burdeos.jpg` | Galería, foto grande de la izquierda | 512 × 388 |
| `public/images/galeria/french-tips-burdeos.jpg` | Galería, foto central (más baja) | 360 × 332 |
| `public/images/galeria/nude-rosa.jpg` | Galería, foto de la derecha | 360 × 388 |
| `public/images/cuidado-aceite.jpg` | Nuestro cuidado, foto de la izquierda | 490 × 432 |
| `src/assets/hero/hero.jpg` | Hero, fondo completo | 1519 × 901 |

La foto del Hero va aparte porque Vite la compila: al guardarla hay que
descomentar la línea `--hero-photo` en
`src/components/Hero/Hero.module.css`.

## Qué foto va en cada archivo

El export de Figma trae la descripción de cada imagen. Sirven como guía para
elegir la foto real:

- **`barberia-three-masters.jpg`**: interior del salón.
- **`manicura-burdeos.jpg`**: manos femeninas con manicura almendra burdeos
  brillante sobre seda marfil, anillo escultórico dorado, luz cálida lateral.
- **`french-tips-burdeos.jpg`**: mano con french tips burdeos y micro-líneas
  finas sobre base nude, fondo marfil, luz de ventana.
- **`nude-rosa.jpg`**: manos con manicura redonda nude rosado, uña corta
  natural, sobre travertino marfil, luz suave.
- **`cuidado-aceite.jpg`**: aplicación de aceite de cutícula con gotero de
  vidrio, lino marfil, cuenco de cerámica, luz difusa cálida.
- **`hero.jpg`**: fotografía editorial del salón para el fondo del Hero.

## Fotos del equipo

No van aquí. Salen de la API (`GET /profesionales`, campo `urlFoto`). Si una
profesional no tiene foto, la tarjeta muestra sus iniciales.

## Formato

Cualquier formato sirve (`.jpg`, `.png`, `.webp`), pero **si cambias la
extensión hay que actualizar la ruta en el CSS** del componente. Lo más simple
es exportar en `.jpg` con el nombre de la tabla.
