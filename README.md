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
js/showcase.js               Selector de proyectos en portada y copia del correo
js/profile.js                CV y experiencia aportados por Iris; participación de Agromapa pendiente
js/galleries.js              Inventario generado de las 52 capturas ES/EN
assets/projects/             Capturas WebP y portadas optimizadas
assets/fonts/                Manrope local y licencia SIL OFL
assets/portrait.webp         Ilustración original optimizada
assets/favicon.svg           Identidad del sitio
assets/social-preview.png    Imagen para compartir enlaces
assets/docs/                 CV original de Iris en PDF
Img/                         Imágenes originales conservadas
scripts/                     Generación e inventario de imágenes
tests/                       Pruebas de navegador sin dependencias de producción
docs/content-audit.md        Fuentes del contenido y decisiones de conservación
```

## Editar contenido

El texto español está en el HTML. Cada atributo `data-en` contiene su traducción inglesa como texto plano; `data-alt-en` y `data-aria-en` traducen los nombres accesibles. JavaScript cambia el idioma, los metadatos y la preferencia local sin ocultar el contenido si falla el almacenamiento. El idioma inicial es español; una preferencia guardada previamente se respeta.

`js/profile.js` contiene la información profesional del CV facilitado por Iris:

- `cvUrl`: apunta al PDF original en `assets/docs/iris-lazzarini-cv.pdf`. Los enlaces **Ver CV** lo abren y **Descargar CV** ofrece una descarga con nombre legible. Los tres enlaces también funcionan sin JavaScript.
- `experiences`: resume el programa trainee en AmplixMe, la pasantía en el Polo Universitario San Justo / Club de Emprendedores y un proyecto freelance, con los períodos y responsabilidades del CV. Mantener sincronizado el contenido español de `.experience-list` en `index.html` para lectura sin JavaScript; las pruebas verifican esa equivalencia.
- `projectContributions.agromapa`: vacío omite una participación individual no documentada. Acepta `{ es: '...', en: '...' }`.

El correo profesional confirmado es **irislazzarini81@gmail.com**. Los enlaces de correo abren el cliente que tenga configurado el visitante. El botón **Copiar correo** utiliza el portapapeles del navegador; si no está disponible o el permiso se rechaza, selecciona el texto y explica cómo copiarlo manualmente.

La sección `#formacion` distingue la titulación finalizada en Análisis de Sistemas de los estudios en curso de Desarrollo de Software y Soporte de Infraestructura. Formación complementaria y competencias se extraen del mismo CV. El PDF conserva exactamente los bytes del archivo aportado; no se modifica ni se traduce. El contenido del sitio sí se presenta en ES/EN. Si se reemplaza el PDF por una nueva versión, actualizar su hash esperado en las pruebas.

## Proyectos y conservación

Fondo Becario, Sistema contable y Agromapa son los casos destacados. Polo Universitario, Hojalatería Chartier, PulverAgro y Comercio 45 completan la selección. Las galerías cargan una sola captura a la vez, se controlan con flechas y Escape, conservan el foco y no avanzan automáticamente.

La portada permite elegir entre los tres casos destacados con botones, flechas, Inicio y Fin. Cada selección muestra una captura real y enlaza al caso correspondiente. No avanza automáticamente y conserva la selección al cambiar de idioma. Los accesos directos de la sección Proyectos y las miniaturas del resto de trabajos facilitan explorar el portfolio.

Los repositorios privados o vacíos no se presentan como código público. Los sitios externos que no resolvieron o devolvieron 404 durante la revisión se conservan en `docs/content-audit.md` para volver a verificarlos, con capturas accesibles desde el portfolio.

## Imágenes

Las 55 imágenes originales permanecen en `Img/`. Hay 52 capturas, una ilustración y dos fondos decorativos. Los fondos se conservan como material original, pero la identidad azul utiliza CSS y SVG. La imagen `Img/Agromapa/Portada.png` muestra Comercio 45 y se clasifica correctamente en esa galería.

Las capturas, portadas e ilustración generadas desde los originales suman aproximadamente **2,71 MB**, un **91,2 % menos** que los originales utilizados, incluso contando las portadas adicionales. Se agrega una portada de PulverAgro de aproximadamente 39 KB, capturada de su sitio real; su procedencia se documenta en `docs/pulveragro-image-source.md`. Estos son pesos del catálogo, no la descarga inicial. El sitio solo descarga portadas cercanas al viewport y la captura activa cuando se abre una galería.

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
