# Auditoría de contenido — 22 de septiembre de 2026

## Fuentes y límites

Se revisaron el HTML, CSS, JavaScript, documentación, enlaces y las 55 imágenes existentes. El rediseño parte del commit `caf5b93`, conservando su arquitectura estática y los seis proyectos visibles. No se agregaron empleadores, títulos académicos, fechas laborales ni métricas.

El HTML del commit previo `af71b2b` aporta evidencia explícita para dos participaciones individuales y para un proyecto que había desaparecido de la presentación:

- Sistema contable: el texto original dice «Desarrollé un sistema de gestión de comprobantes» y describe la persistencia con MySQL/SQLite/JSON y el simulador AFIP para pruebas (líneas 127–156).
- Fondo Becario: el texto dice «Fondo Becario es un sistema web que desarrollé» y «Diseñé e implementé un sistema que», seguido de importaciones, normalización, balances e informes (desde la línea 364).
- Comercio 45: proyecto institucional documentado en ese HTML, con capturas todavía presentes en el repositorio y repositorio público coincidente.

Agromapa no documenta una participación individual específica. Se conserva su caso sin atribuir responsabilidades nuevas; `profile.projectContributions.agromapa` queda preparado para completarlo con datos confirmados.

La sección Experiencia muestra trabajo aplicado en los proyectos, sin presentarlos como puestos laborales ni adjudicar períodos. `profile.experiences` queda preparado para cargar la trayectoria profesional real.

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

El portfolio tenía dos correos diferentes. Iris confirmó `irislazzarini81@gmail.com` en esta revisión; se usa de manera consistente. Se mantienen GitHub y LinkedIn originales. WhatsApp conserva el destino existente `https://wa.me/3498522611`; no se inventó un prefijo internacional.

No hay CV personal en el repositorio. La captura `Img/Polo/CV.png` corresponde a una función de aquel proyecto, no a un CV de Iris. El enlace visible permite solicitarlo por correo hasta disponer del documento real.

## Assets

Se conservan todos los originales. El inventario reproducible está en `scripts/image-inventory.json`. Las imágenes son capturas existentes: no se fabricaron pantallas, resultados ni datos. El avatar es una ilustración y así se describe en su texto alternativo.

Las capturas financieras contienen nombres e identificadores visibles ya presentes en los originales; esta revisión no confirma si son datos de demostración. La versión propuesta se deja en una rama para revisión antes de integrar/publicar.
