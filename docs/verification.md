# Verificación del rediseño

Pruebas realizadas sobre un servidor local bajo el prefijo `/Miport-folio/`, para reproducir las rutas de GitHub Pages.

## Navegador

La batería `tests/portfolio.spec.cjs` completó **25 de 25 comprobaciones** en Chromium, tras la evolución visual del 24 de septiembre de 2026:

- Sin desbordamiento horizontal en 1440, 1024, 768, 390 y 320 px, en ambos idiomas.
- Navegación a las seis secciones y enlace para saltar al contenido.
- Traducciones ES/EN, atributos accesibles y persistencia del idioma.
- Iconos SVG locales: referencias válidas, geometría renderizada y conservación al cambiar ES/EN.
- Controles de icono con nombre accesible, ayuda traducida y área táctil de al menos 44 × 44 px.
- Conservación de destinos de enlaces, metadatos sociales, URL canónica y recursos SEO.
- Selector de tres proyectos en portada: clic, flechas, Inicio y Fin; textos, imágenes, enlaces y selección conservada al cambiar de idioma.
- Copia del correo con portapapeles simulado: éxito, permiso rechazado y API ausente; alternativa de selección manual y mensajes ES/EN.
- Menú móvil, cierre por Escape, enlaces y clic exterior.
- Carga real de las 52 capturas; botones, flechas, recorrido circular, ciclo de foco y cierre de las galerías.
- Galería utilizable en 320 px y retorno del foco al enlace que la abrió.
- Preferencia de movimiento reducido.
- Lectura y navegación sin JavaScript; apertura de capturas mediante enlaces normales.
- Almacenamiento local bloqueado e `IntersectionObserver` ausente.
- Experiencia y formación del CV coherentes entre el HTML estático y la versión con JavaScript; traducción ES/EN sin perder fechas, niveles ni estados de estudios.
- Apertura y descarga del PDF original, con y sin JavaScript, bajo el prefijo del sitio. Verificación de integridad mediante SHA-256.
- Destinos de contacto, incluido WhatsApp según el CV; protección de pestañas externas.

Se inspeccionaron capturas de la portada, proyectos, stack, experiencia y contacto en escritorio, tablet y móvil. Una comprobación adicional de la versión actual no detectó desbordamiento horizontal en diez anchos desde 320 hasta 1920 px, en ES y EN. El contenido profesional, los destinos existentes y los bytes del CV se compararon con la versión anterior.

## Lighthouse móvil

Medición local del 24 de septiembre, ejecutada después de terminar las demás pruebas de navegador:

| Categoría | Puntuación local |
| --- | ---: |
| Rendimiento | 96 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

LCP: 2,3 s. CLS: 0. Tiempo total de bloqueo: 150 ms. La carga inicial medida utiliza una fuente local, cuatro módulos JavaScript y ninguna biblioteca de iconos ejecutable.

Una medición previa ejecutada mientras otras pruebas de navegador estaban activas obtuvo 86 en rendimiento. Se repitió de forma aislada para reducir la interferencia de esas tareas; se conserva esta distinción para no confundir los resultados.

Lighthouse generó el informe completo; su proceso terminó con un error de permisos al limpiar una carpeta temporal de Windows después de guardar los resultados.

axe volvió a ejecutarse tras la evolución visual y no detectó infracciones automáticas con las etiquetas WCAG 2 A/AA, 2.1 AA y 2.2 AA utilizadas. La navegación por teclado se comprobó por separado. Estos resultados no equivalen a una certificación de accesibilidad.

Las puntuaciones corresponden al servidor local y a la simulación móvil de Lighthouse. Deben volver a medirse en el sitio publicado, ya que el alojamiento y la red influyen en el resultado.

## Destinos externos

Comprobados mediante GET con timeout el 24 de septiembre de 2026, a las 14:24 UTC:

- GitHub personal y repositorios Chartier, Comercio45 y Maquinaria: HTTP 200.
- Hojalatería Chartier y demo de Maquinaria: HTTP 200.
- WhatsApp: redirección 302 a la página de contacto, que responde 200; no verifica la existencia de la cuenta y no se envió ningún mensaje.
- LinkedIn: HTTP 999, bloqueo de comprobaciones automatizadas. El enlace existente se conserva; no se interpreta como un enlace roto ni se afirma haber verificado el perfil.

No hubo respuestas 404/410 ni errores TLS o timeout en estos destinos. Su disponibilidad puede variar después de la revisión.
