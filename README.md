# Iris Lazzarini — Portfolio profesional

Portfolio bilingüe ES/EN orientado a análisis funcional y desarrollo de software. Conserva la base existente de HTML, CSS y JavaScript; no necesita compilación, frameworks ni dependencias de producción.

## Ejecutar localmente

Desde la raíz del repositorio:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173/`. Los módulos JavaScript requieren un servidor HTTP; no abrir el HTML con `file://`.

GitHub Pages puede servir directamente esta raíz. Todas las rutas de recursos y galerías son relativas para funcionar también bajo `/Miport-folio/`. El canonical y Open Graph conservan `https://irislazzarini.github.io/Miport-folio/`; actualizarlos si cambia el dominio.

## Estructura

```text
index.html                   Contenido estático, metadatos y estructura semántica
css/styles.css               Tokens, componentes y composiciones responsive
js/main.js                   Idiomas, menú, galería y mejoras progresivas
js/profile.js                CV, experiencia y participación pendiente de confirmar
js/galleries.js              Inventario generado de las 52 capturas ES/EN
assets/projects/             Capturas WebP y portadas optimizadas
assets/fonts/                Manrope local y licencia SIL OFL
assets/portrait.webp         Ilustración original optimizada
assets/favicon.svg           Identidad del sitio
assets/social-preview.png    Imagen para compartir enlaces
Img/                         Imágenes originales conservadas
scripts/                     Generación e inventario de imágenes
tests/                       Pruebas de navegador sin dependencias de producción
docs/content-audit.md        Fuentes del contenido y decisiones de conservación
```

## Editar contenido

El texto español está en el HTML. Cada atributo `data-en` contiene su traducción inglesa como texto plano; `data-alt-en` y `data-aria-en` traducen los nombres accesibles. JavaScript cambia el idioma, los metadatos y la preferencia local sin ocultar el contenido si falla el almacenamiento. El idioma inicial es español; una preferencia guardada previamente se respeta.

`js/profile.js` mantiene información que debe ser confirmada antes de publicarse:

- `cvUrl`: `null` mantiene **Solicitar CV** por correo. Un enlace real HTTPS o un PDF relativo activa **Ver CV**. No se crea un CV ficticio.
- `experiences`: vacío muestra experiencia aplicada a través de proyectos. Al cargar roles, organizaciones, períodos, responsabilidades y resultados verificables, se renderizan en la misma composición vertical.
- `projectContributions.agromapa`: vacío omite una participación individual no documentada. Acepta `{ es: '...', en: '...' }`.

El correo profesional confirmado es **irislazzarini81@gmail.com**. No hay formulario ni mensajes de envío ficticios: los enlaces de correo abren el cliente que tenga configurado el visitante.

## Proyectos y conservación

Fondo Becario, Sistema contable y Agromapa son los casos destacados. Polo Universitario, Hojalatería Chartier, PulverAgro y Comercio 45 completan la selección. Las galerías cargan una sola captura a la vez, se controlan con flechas y Escape, conservan el foco y no avanzan automáticamente.

Los repositorios privados o vacíos no se presentan como código público. Los sitios externos que no resolvieron o devolvieron 404 durante la revisión se conservan en `docs/content-audit.md` para volver a verificarlos, con capturas accesibles desde el portfolio.

## Imágenes

Las 55 imágenes originales permanecen en `Img/`. Hay 52 capturas, una ilustración y dos fondos decorativos. Los fondos se conservan como material original, pero la identidad azul utiliza CSS y SVG. La imagen `Img/Agromapa/Portada.png` muestra Comercio 45 y se clasifica correctamente en esa galería.

Las capturas, portadas e ilustración optimizadas suman aproximadamente **2,71 MB**, un **91,2 % menos** que los originales utilizados, incluso contando las portadas adicionales. Esto es el peso total del catálogo, no la descarga inicial. El sitio solo descarga portadas cercanas al viewport y la captura activa cuando se abre una galería.

Para regenerar imágenes, con Python y Pillow instalados:

```sh
python scripts/optimize-images.py
```

Editar `scripts/image-sources.json` para cambiar el orden o los textos alternativos. Los originales no se renombran ni sobrescriben. Ver `IMAGE-NORMALIZATION-GUIDE.md`.

## Verificación

Ver `tests/README.md` para ejecutar la batería de navegador: cinco anchos de pantalla, ES/EN, navegación, las 52 capturas, teclado, foco, movimiento reducido, ausencia de JavaScript y almacenamiento bloqueado. La instalación de Playwright se hace fuera del sitio.

El rediseño también se revisa con Lighthouse y axe. Las mediciones locales sirven para detectar regresiones; el rendimiento de producción depende además del servidor y la red.

## Accesibilidad y diseño

- Un único `h1`, regiones semánticas, enlace para saltar al contenido y foco visible.
- Menú móvil accesible y navegación visible sin JavaScript.
- Galería con `dialog` nativo, ciclo de foco explícito y retorno al enlace de apertura.
- `prefers-reduced-motion` y contenido visible aunque no haya animaciones.
- Fuente local, SVG decorativo oculto a lectores de pantalla y ninguna librería visual externa.

La licencia de la fuente se encuentra en `assets/fonts/OFL.txt`. Las imágenes y el contenido profesional pertenecen al portfolio original.
