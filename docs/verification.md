# Verificación del rediseño

Pruebas realizadas sobre un servidor local bajo el prefijo `/Miport-folio/`, para reproducir las rutas de GitHub Pages.

## Navegador

La batería `tests/portfolio.spec.cjs` completó **20 de 20 comprobaciones** en Chromium:

- Sin desbordamiento horizontal en 1440, 1024, 768, 390 y 320 px, en ambos idiomas.
- Navegación a las seis secciones y enlace para saltar al contenido.
- Traducciones ES/EN, atributos accesibles y persistencia del idioma.
- Selector de tres proyectos en portada: clic, flechas, Inicio y Fin; textos, imágenes, enlaces y selección conservada al cambiar de idioma.
- Copia del correo con portapapeles simulado: éxito, permiso rechazado y API ausente; alternativa de selección manual y mensajes ES/EN.
- Menú móvil, cierre por Escape, enlaces y clic exterior.
- Carga real de las 52 capturas; botones, flechas, recorrido circular, ciclo de foco y cierre de las galerías.
- Galería utilizable en 320 px y retorno del foco al enlace que la abrió.
- Preferencia de movimiento reducido.
- Lectura y navegación sin JavaScript; apertura de capturas mediante enlaces normales.
- Almacenamiento local bloqueado e `IntersectionObserver` ausente.
- Destinos de contacto y solicitud de CV; protección de pestañas externas.

Se inspeccionaron capturas de escritorio y móvil, los tres casos destacados, el contacto y el catálogo de imágenes original. Una revisión adicional no detectó desbordamiento horizontal en diez anchos, desde 320 hasta 1920 px, en ES y EN.

## Lighthouse móvil

| Categoría | Puntuación local |
| --- | ---: |
| Rendimiento | 99 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

LCP: 1,9 s. CLS: 0. Tiempo total de bloqueo: 0 ms.

Lighthouse generó el informe completo; su proceso terminó con un error de permisos al limpiar una carpeta temporal de Windows después de guardar los resultados.

axe no detectó infracciones automáticas con las etiquetas WCAG 2 A/AA, 2.1 AA y 2.2 AA utilizadas. La navegación por teclado se comprobó por separado. Estos resultados no equivalen a una certificación de accesibilidad.

Las puntuaciones corresponden al servidor local y a la simulación móvil de Lighthouse. Deben volver a medirse en el sitio publicado, ya que el alojamiento y la red influyen en el resultado.
