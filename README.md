# Portafolio de Iris Luján Lazzarini

Dos áreas complementarias: Tecnología (Análisis Funcional, Desarrollo de Software y Soporte IT) y Administración y Gestión de Datos. HTML, CSS y JavaScript estáticos, compatibles con GitHub Pages y sin dependencias de producción.

## Ejecutar

Desde la raíz del repositorio: `python -m http.server 4173 --bind 127.0.0.1`. Abrir `http://127.0.0.1:4173/`. Usar un servidor; los módulos JavaScript requieren HTTP, no `file://`.

## Editar y aprender

- `index.html`: secciones, contenido estático en español, traducciones `data-en`, enlaces y metadatos. Contenido esencial disponible sin JavaScript.
- `css/styles.css`: base, iconos, navegación y galería accesible.
- `css/professional.css`: colores y layouts del rediseño; se carga después de la base para conservar comportamientos existentes.
- `js/profile.js`: experiencias y fechas ES/EN. Mantener sincronizada su copia estática en HTML para buscadores y visitas sin JS.
- `js/main.js`: traducción, menú, filtros y galería. `data-category="tech"` o `"admin"` asigna categoría; `data-filter` selecciona el filtro.
- `js/showcase.js`: copia del correo, con selección de texto como alternativa al portapapeles.
- `js/galleries.js`: capturas públicas seleccionadas, sin registros financieros ni perfiles personales.
- `assets/docs/iris-lazzarini-cv-it.pdf` y `iris-lazzarini-cv-administrativo.pdf`: dos CV con destinos independientes.
- `scripts/build-cvs.py`: fuente de los CV. Requiere Python y ReportLab solo para regenerar documentos: `python scripts/build-cvs.py`. Revisar visualmente los PDF después de cambiar contenido o fuentes.
- `tests/portfolio.spec.cjs`: pruebas de navegador; instrucciones en `tests/README.md`.

Las imágenes, fuentes e iconos son locales. El contacto abre un cliente de correo con `mailto:`; no envía mensajes automáticamente. CSS Grid adapta columnas; `details/summary` permite consultar información de proyectos sin ocupar toda la pantalla.

## Publicar en GitHub Pages

Integrar la propuesta en `main` y conservar la configuración existente de Settings → Pages. Para publicación desde rama: `main`, `/ (root)`. No necesita compilación. URL: `https://irislazzarini.github.io/Miport-folio/`.

Los recursos usan rutas relativas; también se probaron bajo `/Miport-folio/`. Después de publicar, comprobar móvil, navegación y descarga manual de ambos CV.

## Fuentes y límites

Ver `docs/redesign-2026.md` para auditoría, decisiones, validación y pendientes. Las auditorías previas se conservan como registro histórico.

Los originales que la interfaz ya no utiliza permanecen en el repositorio y en su historial. Algunos contienen datos personales visibles; ocultarlos en la interfaz no los elimina del repositorio. Revisar y preparar una versión apta para publicación antes de reutilizar una captura.
