# Revisión UX/UI y evidencia — 19 de octubre de 2026

## Diagnóstico y decisiones

Se conserva la arquitectura estática: HTML semántico, CSS responsive, JavaScript modular, Manrope local, WebP y sprite SVG. Se revisaron los cuatro módulos JS, CSS, HTML, scripts de imágenes, pruebas y documentación. No se agregan dependencias de producción.

El principal problema visual era la acumulación de estilos de revisiones anteriores y la menor relevancia del rol profesional en el hero. Se unifica la identidad en azul marino, azul eléctrico, blanco y acentos cian; se mejora lectura de fechas, títulos, foco, controles y secciones. Formación queda accesible desde el menú. Se retiran únicamente reglas muertas del avatar, la firma y bloques que Iris ya había pedido eliminar. Se conservan las funciones de idioma, teclado, menú móvil, galerías, CV y correo.

El diagnóstico y el plan se presentaron antes de implementar. La selección de cuatro proyectos se aprobó expresamente antes de cambiar sus fichas: Fondo Becario, Sistema contable, Polo Universitario y Chartier. Los demás permanecen en la página. Se utilizan desplegables nativos para aporte, evidencia y conversación técnica; no requieren JavaScript adicional.

## Criterios de contenido

Las nuevas fichas distinguen problema, funciones presentes en código o capturas, tecnologías, aporte documentado y límites de evidencia. No se asume autoría total por ser propietaria del repositorio. No se presentan como demos verificadas destinos inaccesibles. Se aclaran el simulador fiscal y el uso de mailto; no equivalen a integración fiscal productiva ni entrega de correo. No se publican archivos privados, credenciales ni código de los proyectos auditados.

Agromapa mantiene sus capturas, con una nota de correspondencia y base de datos pendientes de confirmar. Las afirmaciones generales sobre uso responsable de IA permanecen en Cómo trabajo; no se atribuye a cada proyecto un uso de IA sin evidencia específica.

## Rendimiento y accesibilidad

La revisión encontró un salto inicial: el menú sin JavaScript se dibujaba expandido antes de activar la mejora progresiva. Se detecta JavaScript antes de dibujar la página y se restaura el modo estático si falla la carga del módulo. Sin JavaScript, la navegación permanece visible y funcional.

No se añadieron imágenes, tipografías remotas, trackers ni bibliotecas de animación. Las microinteracciones son transiciones breves; se respeta prefers-reduced-motion. Los informes locales completos se entregan fuera del repositorio para revisión. Las métricas locales no certifican el comportamiento del alojamiento público.

La medición de la primera etapa obtuvo 98/100 en rendimiento y 100/100 en accesibilidad, buenas prácticas y SEO, con CLS 0, LCP 2,3 s y TBT 0 ms. Se verifican nuevamente las fichas aprobadas antes del cierre.

## Banner

## Aclaraciones posteriores de Iris

Iris confirmó que Chartier fue un desarrollo web freelance encargado por un cliente; que Sistema contable fue un trabajo institucional para una distribuidora, relacionado con libros contables, facturas y ARCA; y que Agroconta es un proyecto distinto de contabilidad agropecuaria. Se actualizan las fichas sin asociar fechas o tecnologías del freelance anónimo del CV a Chartier. La aclaración sobre ARCA no acredita una integración productiva: se conserva la distinción del simulador observado en el código.

Se unifican los siete proyectos en una sola grilla, manteniendo primero los cuatro aprobados, y se elimina el encabezado separador «Otros proyectos». Las capturas y enlaces existentes se conservan.

No se modifica LinkedIn ni su banner durante esta revisión. Iris solicitó trabajar sobre el original editable y conservar su composición; se espera ese archivo antes de generar la versión 1584 × 396.
