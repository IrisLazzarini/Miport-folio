# Auditoría de contenido — 22 de septiembre de 2026

## Fuentes y límites

Se revisaron el HTML, CSS, JavaScript, documentación, enlaces y las 55 imágenes existentes. El rediseño parte del commit `caf5b93`, conservando su arquitectura estática y los seis proyectos visibles. La primera versión no incorporó datos de trayectoria laboral o formación sin fuente. Posteriormente Iris aportó su CV para añadirlos; esa integración se documenta abajo.

El HTML del commit previo `af71b2b` aporta evidencia explícita para dos participaciones individuales y para un proyecto que había desaparecido de la presentación:

- Sistema contable: el texto original dice «Desarrollé un sistema de gestión de comprobantes» y describe la persistencia con MySQL/SQLite/JSON y el simulador AFIP para pruebas (líneas 127–156).
- Fondo Becario: el texto dice «Fondo Becario es un sistema web que desarrollé» y «Diseñé e implementé un sistema que», seguido de importaciones, normalización, balances e informes (desde la línea 364).
- Comercio 45: proyecto institucional documentado en ese HTML, con capturas todavía presentes en el repositorio y repositorio público coincidente.

Agromapa no documenta una participación individual específica. Se conserva su caso sin atribuir responsabilidades nuevas; `profile.projectContributions.agromapa` queda preparado para completarlo con datos confirmados.

La sección Experiencia muestra ahora la trayectoria aportada en el CV, con fechas, tipo de participación y organizaciones. Los casos de proyectos conservan sus descripciones y fuentes originales.

## Integración del CV aportado por Iris

Fuente: `Iris Luján Lazzarini _Analista Junior_ Curriculum vitae.pdf`, facilitado por la titular para agregarlo y extraer información. Sus dos páginas se revisaron visualmente. El documento se conserva sin cambios en `assets/docs/iris-lazzarini-cv.pdf` (203.654 bytes; SHA-256 `7f02b67671524e68676be0bd39a8546981ba0cc48dcab61a044b6790d9e6c4f6`).

- AmplixMe, junio–agosto de 2026: Desarrolladora Full Stack Trainee dentro de un programa de aceleración. Se mencionan React/Vite, Node.js/Express, PostgreSQL/Prisma, criterios de aceptación y pruebas funcionales.
- Polo Universitario San Justo / Club de Emprendedores, junio–diciembre de 2025: Analista Funcional Junior. Se identifica expresamente como pasantía; se resumen requerimientos, documentación, soporte, incidencias y SQL.
- Proyecto freelance, agosto–noviembre de 2025: análisis funcional y desarrollo web con React y Tailwind CSS. El documento no identifica al cliente; no se asocia este trabajo a Chartier, PulverAgro ni otro caso del portfolio.
- Egresada de Técnica Superior en Análisis de Sistemas Informáticos, Escuela Superior de Comercio N.º 45 “Dr. José Roberto González”, marzo de 2023–diciembre de 2025.
- Tecnicaturas en Desarrollo de Software y en Soporte de Infraestructura, ISP N.º 20 “Senador Néstor J. Zamaro”, ambas desde marzo de 2026 y en curso según el CV.
- Formación complementaria: JavaScript / Full Stack Job-Ready de AmplixMe, Full Stack Developer de CILSA, Yo Puedo Programar de Junior Achievement Santa Fe e Inglés niveles I y II del Centro Universitario de Idiomas.

El sitio resume estas declaraciones de la titular; no implica una verificación independiente de certificados. Las métricas aproximadas de la pasantía permanecen en el PDF, mientras la síntesis web describe los resultados de forma cualitativa. No se infiere nivel B1/B2 de inglés, equivalencia universitaria de las tecnicaturas ni nuevas responsabilidades en Agromapa.

Los períodos superpuestos de pasantía y freelance se conservan como figuran en el documento. El HTML estático de experiencia coincide con `profile.experiences`, para que la misma información esté disponible sin JavaScript. Las traducciones mantienen nivel Junior/Trainee, condición de pasantía y estudios en curso.

## Enlaces revisados

| Destino | Resultado de la revisión | Decisión |
| --- | --- | --- |
| `https://hojalateriachartier.com/` | HTTP 200 | Mantener enlace al sitio |
| `https://github.com/IrisLazzarini/Chartier` | Público, contenido coincidente | Enlace al repositorio específico |
| `https://irislazzarini.github.io/Maquinaria/` | HTTP 200, PulverAgro | Mantener enlace al sitio |
| `https://github.com/IrisLazzarini/Maquinaria` | Público, contenido coincidente | Enlace al repositorio específico |
| `https://polousanjusto.com.ar/` | No resolvió durante la revisión | Conservar aquí; mostrar galería hasta verificarlo |
| `https://escomercio45.edu.ar/` | HTTP 404 | Conservar aquí; galería y repositorio público |
| `https://github.com/IrisLazzarini/Comercio45` | Público, identidad coincidente | Enlace al repositorio específico |
| `https://github.com/IrisLazzarini/Agromapa` | Público, vacío | No ofrecerlo como código fuente disponible |
| Fondo Becario / Sistema contable / Polo | Repositorios privados o sin fuente pública confirmada | Galería y acceso general a GitHub |

Los estados de servicios externos pueden cambiar. Ningún enlace antiguo fue reemplazado por un destino supuesto.

## Contacto

El portfolio tenía dos correos diferentes. Iris confirmó `irislazzarini81@gmail.com` en esta revisión y el CV coincide; se usa de manera consistente. El CV confirma el teléfono `+54 (3498) 522611`; WhatsApp ahora usa `https://wa.me/543498522611`, sin inferir dígitos adicionales. Se mantienen GitHub y el LinkedIn existente. El texto del CV indica otra variante de LinkedIn (`/iris-lazzarini`) y no contiene un enlace incrustado verificable; no se sustituye automáticamente el destino del portfolio.

El CV personal real se puede abrir y descargar desde el portfolio. La captura `Img/Polo/CV.png` sigue correspondiendo a una función de aquel proyecto y no se usa como CV de Iris.

## Assets

Se conservan todos los originales. El inventario reproducible está en `scripts/image-inventory.json`. Las imágenes son capturas existentes: no se fabricaron pantallas, resultados ni datos. El avatar es una ilustración y así se describe en su texto alternativo.

Las capturas financieras contienen nombres e identificadores visibles ya presentes en los originales; esta revisión no confirma si son datos de demostración. La versión propuesta se deja en una rama para revisión antes de integrar/publicar.
