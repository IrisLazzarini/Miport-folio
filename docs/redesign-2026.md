# Rediseño profesional — 14 de octubre de 2026

## Auditoría

Se revisaron el sitio publicado, HTML, CSS, módulos JS, proyectos, galerías, PDF existente y documentación. Base: commit `a14a56d828226cf091c9a3d3dc3b9ac022fe8513`.

La base ya era estática, responsive y bilingüe, con imágenes WebP, fuente local y galería accesible. El problema principal era el posicionamiento: el inicio priorizaba desarrollo y una estética de editor de código; el voluntariado administrativo no figuraba. Los casos largos dificultaban una lectura rápida. El sistema Fondo Becario podía confundirse con experiencia administrativa de contabilidad. El CV previo incluía porcentajes de mejora sin evidencia adicional. Algunas capturas mostraban nombres y DNI.

## Propuesta e implementación

Orden: Inicio → Sobre mí → Experiencia → Proyectos → Habilidades → Formación → CV → Contacto. Navegación orientada a selección laboral y dos perfiles complementarios.

- Hero con titular solicitado, título, disponibilidad junior y dos áreas de igual jerarquía. Se retiraron el código decorativo y la captura financiera del inicio.
- Azul profundo, azul eléctrico, blanco y grises; tarjetas con espacios consistentes. Un solo tema oscuro conserva coherencia con la base y reduce complejidad. Sin animación automática ni frameworks nuevos.
- Cuatro tarjetas distinguen voluntariado, programa de aceleración, pasantía y freelance.
- Se conservan siete proyectos tecnológicos: Fondo Becario, Sistema contable, Agromapa, Polo Universitario, Hojalatería Chartier, PulverAgro y Escuela de Comercio N.º 45. Se suma el caso administrativo real, sin capturas institucionales sensibles.
- El sistema financiero se presenta como desarrollo de software separado del voluntariado; sus funciones no se atribuyen a experiencia contable de Iris. Los detalles se consultan con `details/summary`.
- Filtros Tecnología y Administración y Datos, con botones nativos, `aria-pressed` y anuncio `aria-live`. Sin JS se muestran todos los proyectos y se oculta el filtro.
- Habilidades administrativas dedicadas, además del stack documentado. C# no se incorporó porque no se encontró evidencia en las fuentes revisadas. Power BI figura como integración en preparación.
- Un único CV: el PDF enviado por Iris. Se retiró la tarjeta administrativa y las dos versiones generadas. Todos los enlaces apuntan al mismo archivo, sin modificar su contenido.
- SEO y vista previa social actualizados. Canonical, recursos locales y rutas relativas conservados.
- Selecciones financieras y una captura de perfil personal retiradas de la galería pública. Los originales permanecen en el repositorio y su historial; no se realizó una eliminación histórica de datos.

## Fuentes

Iris confirmó el título “Técnica Superior en Análisis Funcional de Sistemas Informáticos”, sus estudios actuales, las responsabilidades reales y la fecha del voluntariado: **18 de marzo de 2025 a la actualidad**. Confirmó LinkedIn **https://www.linkedin.com/in/iris-lazzarini**. Correo: coincidencia entre GitHub, web y PDF existente. Ubicación general: San Justo, Santa Fe, Argentina.

El CV existente y la auditoría histórica respaldan AmplixMe (junio-agosto 2026), la pasantía Polo/Club de Emprendedores (junio-diciembre 2025), el freelance (agosto-noviembre 2025), instituciones académicas y formación complementaria. Se conservan como declaraciones de la titular; no se verificaron certificados con terceros.

En Fondo Becario se consignan digitalización, carga y clasificación en Excel, revisión de inconsistencias, consulta de manuscritos y preparación de documentación para control anual y posterior revisión del contador. No se afirman tareas de contabilidad, facturación, conciliación ni gestión de pagos.

## Validación

- Vistas 1440, 1024, 768, 390 y 320 px: imágenes cargadas y sin desbordamiento horizontal. Revisión visual de escritorio y móvil.
- Filtros: ocho casos, uno administrativo y siete tecnológicos. Teclado, ES/EN, persistencia, almacenamiento bloqueado y movimiento reducido.
- Menú móvil, Escape y restitución de foco. Cuatro galerías con capturas reales seleccionadas.
- Sin JS: cuatro experiencias, ocho casos, formación, contacto y un único CV. Recursos y navegación bajo `/Miport-folio/`.
- El PDF único es el documento proporcionado por Iris, conservado byte por byte. No se reescribió su contenido.
- Trece comprobaciones funcionales completas. Descarga real del CV único verificada; bytes idénticos al original enviado por Iris. Sin límites de guardado local.
- Chartier, PulverAgro y repositorios públicos Chartier/Maquinaria/Comercio45: HTTP 200 el 14/10/2026. LinkedIn bloquea la comprobación automática (999); se usa la dirección confirmada. Demos institucionales previamente caídas no se ofrecen como destinos activos.
- La entrega se prepara en una rama con propuesta de cambios. Esto no confirma una actualización del sitio en GitHub Pages.

## Pendientes de contenido

Participación individual específica en Agromapa; ejemplos de C# si se desea incluirlo; capturas financieras aptas para publicar; alcance y evidencia del proyecto Power BI cuando esté desarrollado. Nada de esto se inventó para completar la presentación.

## Archivos y aprendizaje

Modificados: `index.html`, `js/main.js`, `js/profile.js`, `js/showcase.js`, `js/galleries.js`, `assets/social-preview.png`, `README.md`, `tests/portfolio.spec.cjs`, `tests/README.md`.

Nuevos: `css/professional.css`, el PDF único actualizado en `assets/docs/`, `docs/redesign-2026.md`.

El HTML estructura contenido; `data-en` habilita traducciones; `profile.js` alimenta experiencias; `data-category` conecta tarjetas y filtros; CSS Grid adapta columnas; `details` reduce longitud visible sin perder información; las rutas relativas sostienen GitHub Pages. El README explica cómo ejecutar, editar, reemplazar el CV y publicar.

## Corrección solicitada por Iris

Se usa exclusivamente el archivo «Iris Luján Lazzarini _Analista Junior_ Curriculum vitaee.pdf» como CV para todo el portafolio, sin editar sus bytes. Se retiró la tarjeta de CV administrativo, los PDF generados y su generador. Las áreas profesionales del sitio se mantienen; la corrección afecta únicamente al CV.
