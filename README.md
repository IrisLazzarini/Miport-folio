# Portafolio Profesional - Iris Lazzarini

Este es un portafolio profesional moderno y responsive desarrollado con HTML, CSS y JavaScript.

## Características

- Diseño moderno y limpio
- Totalmente responsive
- Animaciones suaves
- Formulario de contacto
- Integración con redes sociales
- Botón flotante de WhatsApp
- Secciones para proyectos y habilidades

## Estructura del Proyecto

```
miportafolio/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── profile-placeholder.jpg
│   ├── agromapa.jpg
│   ├── sistema-contable.jpg
│   └── polo-estudiantil.jpg
└── README.md
```

## Configuración

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/miportafolio.git
   ```

2. Personaliza el contenido:
   - Modifica el texto en `index.html`
   - Actualiza las imágenes en la carpeta `assets/`
   - Ajusta los colores en `css/styles.css` (variables en la raíz)
   - Configura los enlaces a tus redes sociales

3. Despliega en GitHub Pages:
   - Sube los cambios a tu repositorio
   - Activa GitHub Pages en la configuración del repositorio
   - Selecciona la rama main como fuente

## Personalización

### Colores
Los colores principales se pueden modificar en las variables CSS al inicio de `styles.css`:

```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #ffffff;
    --text-color: #333333;
    --background-color: #f5f5f5;
    --accent-color: #004d99;
}
```

### Imágenes
Reemplaza las imágenes en la carpeta `assets/` con tus propias imágenes:
- `profile-placeholder.jpg`: Tu foto de perfil
- `agromapa.jpg`: Captura del proyecto Agromapa
- `sistema-contable.jpg`: Captura del sistema contable
- `polo-estudiantil.jpg`: Captura del proyecto Polo Estudiantil

### Enlaces
Actualiza los enlaces a tus redes sociales en el HTML:
```html
<div class="social-links">
    <a href="https://linkedin.com/tu-perfil" target="_blank">
        <i class="fab fa-linkedin"></i>
    </a>
    <a href="https://github.com/tu-usuario" target="_blank">
        <i class="fab fa-github"></i>
    </a>
</div>
```

### WhatsApp
Actualiza el número de WhatsApp en el HTML:
```html
<a href="https://wa.me/tu-numero" class="whatsapp-btn" target="_blank">
    <i class="fab fa-whatsapp"></i>
</a>
```

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome (iconos)
- Google Fonts (Poppins)

## Compatibilidad

El portafolio es compatible con los siguientes navegadores:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge
- Opera

## Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de modificarlo y utilizarlo para tu propio portafolio.

## Contacto

Para cualquier consulta o sugerencia, no dudes en contactarme:
- Email: [tu-email@ejemplo.com]
- LinkedIn: [tu-perfil-linkedin]
- GitHub: [tu-usuario-github]