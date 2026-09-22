# Imágenes y rutas

La fuente de verdad es `scripts/image-sources.json`. `scripts/optimize-images.py` lee los archivos originales de `Img/`, produce WebP y genera `js/galleries.js` e `scripts/image-inventory.json`.

No se deben sanitizar ni renombrar los originales al construir URLs. Cambiar espacios o mayúsculas solo en código produce rutas que no existen, especialmente en GitHub Pages. La implementación actual usa las rutas exactas de las versiones optimizadas, relativas al documento.

## Regeneración

```sh
python -m pip install Pillow
python scripts/optimize-images.py
```

Las capturas se reducen a un máximo de 1600 px de ancho, las portadas a 800 px, conservando relación de aspecto y contenido. El proceso no amplía originales ni copia EXIF. No realiza recortes ni altera datos visibles.

## Cambios respecto del mecanismo anterior

- No se utiliza `sanitizeFileName`, el antiguo mapping parcial ni URLs calculadas desde la raíz del dominio.
- Los originales se conservan; no se ejecuta el antiguo script de renombrado.
- Las galerías cargan una captura por vez y muestran un mensaje accesible si falla una imagen.
- Las capturas se clasifican por su contenido, incluida la portada de Comercio 45 originalmente guardada en Agromapa.

El inventario incluye dimensiones, peso y correspondencia con cada original, además de observaciones sobre su contenido.
