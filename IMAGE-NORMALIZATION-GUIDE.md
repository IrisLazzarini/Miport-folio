# Guía de Normalización de Imágenes

## 📋 Resumen de la Solución

Se implementó un sistema robusto para manejar imágenes con nombres problemáticos (espacios, caracteres especiales, paréntesis) que causaban errores 404.

## 🔧 Componentes Implementados

### 1. `sanitizeFileName(filename)`
Normaliza nombres de archivo:
- ✅ Convierte a minúsculas
- ✅ Reemplaza espacios por guiones
- ✅ Elimina paréntesis y caracteres especiales
- ✅ Elimina puntos duplicados
- ✅ Remueve acentos

### 2. `IMAGE_NAME_MAPPING`
Mapping directo de nombres originales → normalizados:
```javascript
'Img/Fondo_becario/Captura de pantalla 2026-01-11 a la(s) 1.49.10 p. m..png'
→ 'Img/Fondo_becario/fb_05_captura-01.png'
```

### 3. `normalizeImagePath(originalPath)`
Normaliza rutas usando mapping o sanitización automática.

### 4. `getAbsoluteImagePath(relativePath)`
Convierte rutas relativas a absolutas basadas en `window.location`.

### 5. `createImagePlaceholder(altText)`
Crea un placeholder SVG cuando una imagen falla (404).

### 6. `normalizeImagePaths(imagePaths)`
Valida y normaliza un array completo de imágenes.

## 📊 Ejemplo de Array de Imágenes

### Antes (problemático):
```javascript
[
  'Img/Fondo_becario/Inicio.png',
  'Img/Fondo_becario/Vista de inicio.png',
  'Img/Fondo_becario/Captura de pantalla 2026-01-11 a la(s) 1.49.10 p. m..png',
  // ... más imágenes con espacios y paréntesis
]
```

### Después (normalizado):
```javascript
[
  'http://localhost:8000/Img/Fondo_becario/fb_01_inicio.png',
  'http://localhost:8000/Img/Fondo_becario/fb_02_vista-inicio.png',
  'http://localhost:8000/Img/Fondo_becario/fb_05_captura-01.png',
  // ... todas con rutas absolutas y nombres normalizados
]
```

## 🚀 Pasos para Aplicar la Solución

### Opción 1: Renombrar Archivos Físicos (Recomendado)
1. Ejecutar el script de renombrado:
```bash
bash rename-images-example.sh
```

2. Actualizar el HTML con los nuevos nombres:
```html
<img src="Img/Fondo_becario/fb_01_inicio.png" alt="Fondo Becario - Inicio">
<img src="Img/Fondo_becario/fb_02_vista-inicio.png" alt="Fondo Becario - Vista de Inicio">
<!-- ... -->
```

### Opción 2: Usar Solo el Mapping (Sin Renombrar)
El código JavaScript manejará automáticamente la conversión usando `IMAGE_NAME_MAPPING`.

## 🔍 Logging y Debugging

El sistema incluye logging detallado:
- ✅ Imágenes cargadas correctamente
- ❌ Errores 404 con detalles completos
- 📋 Proceso de normalización paso a paso

### Ejemplo de Log:
```
[1/12] Normalizando imagen: {
  original: "Img/Fondo_becario/Captura de pantalla...",
  normalized: "Img/Fondo_becario/fb_05_captura-01.png",
  absolute: "http://localhost:8000/Img/Fondo_becario/fb_05_captura-01.png"
}
✅ [1/12] Imagen cargada correctamente
```

## 🛡️ Validación y Placeholders

Si una imagen falla:
1. Se muestra un placeholder SVG con mensaje
2. Se registra el error en consola con detalles
3. El carrusel continúa funcionando normalmente

## 📝 Notas Importantes

- Las rutas se convierten automáticamente a absolutas
- El mapping tiene prioridad sobre la sanitización
- Los placeholders son SVG inline (no requieren archivos externos)
- Compatible con cualquier servidor (localhost, producción, etc.)

