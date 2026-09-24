# Iconos locales

`sprite.svg` contiene una selección de símbolos SVG para la interfaz y las tecnologías que ya figuran en el portfolio. Se sirve desde el propio sitio, sin JavaScript, CDN ni paquetes de producción.

```html
<a href="https://github.com/IrisLazzarini" target="_blank" rel="noopener noreferrer">
  <svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <use href="assets/icons/sprite.svg#github"></use>
  </svg>
  GitHub
</a>
```

El texto del enlace proporciona su nombre accesible. Los controles que solo muestran un icono deben conservar `aria-label`, `title`, foco visible y una superficie de al menos 44 × 44 px. `data-title-en` permite traducir las ayudas de los controles junto con sus etiquetas.

Los símbolos usan `currentColor`. `.glyph` define el tamaño común y `.tech-icon` permite acentos discretos en las tecnologías sin cambiar el color del nombre.

## Procedencia

- Simple Icons: marcas de tecnologías y GitHub, licencia CC0-1.0.
- Lucide: iconos de interfaz, licencia ISC y aviso MIT heredado.
- Bootstrap Icons: LinkedIn, licencia MIT.

`sources.json` registra la URL fijada por commit, el hash SHA-256 del archivo de origen y su `viewBox`. Las licencias completas se conservan en este directorio. La adaptación envuelve la geometría original en un `<symbol>` con identificador local; los colores se heredan del componente. Los logotipos identifican sus plataformas y no indican afiliación.
