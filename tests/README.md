# Pruebas de navegador

`portfolio.spec.cjs` comprueba el sitio estático en Chromium con Playwright y las aserciones incluidas en Node.js. Las pruebas no agregan dependencias de producción ni necesitan un framework de aplicación.

Incluyen cinco anchos de pantalla (1440, 1024, 768, 390 y 320 px), navegación, traducción completa ES/EN y persistencia, menú móvil, carga real de las 52 capturas, teclado y foco de la galería, movimiento reducido, contenido sin JavaScript, almacenamiento bloqueado y destinos de contacto/CV. No envían correos ni abren los enlaces externos.

## Preparación independiente del sitio

Con Node.js y Python instalados, ejecutar desde la raíz del repositorio:

```powershell
npm install --prefix ../portfolio-browser-tests playwright
node ../portfolio-browser-tests/node_modules/playwright/cli.js install chromium
$env:PORTFOLIO_PLAYWRIGHT_MODULE = (Resolve-Path '../portfolio-browser-tests/node_modules/playwright').Path
```

También se puede usar una instalación existente: `PORTFOLIO_PLAYWRIGHT_MODULE` acepta la ruta absoluta del paquete `playwright`; si se omite, el script usa `require('playwright')`, respetando `NODE_PATH`.

Si se necesita un Chromium ya instalado, `PORTFOLIO_BROWSER_PATH` acepta la ruta absoluta a su ejecutable. Si se omite, se usa la versión instalada por Playwright.

Iniciar un servidor estático desde la raíz del repositorio, en otra terminal:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Ejecutar las pruebas en la primera terminal:

```powershell
$env:PORTFOLIO_BASE_URL = 'http://127.0.0.1:4173/'
node tests/portfolio.spec.cjs
```

El código de salida es `0` cuando todas las comprobaciones pasan y `1` cuando alguna falla. Si el servidor ya sirve el sitio bajo `/Miport-folio/`, usar esa URL en `PORTFOLIO_BASE_URL`; ese es el valor predeterminado del script. Probar ese prefijo también verifica las rutas usadas en GitHub Pages.

Opcionalmente, guardar capturas completas de los cinco tamaños y un informe JSON fuera del repositorio:

```powershell
$env:PORTFOLIO_TEST_OUTPUT = '../portfolio-test-results'
node tests/portfolio.spec.cjs
```

`PORTFOLIO_HEADED=1` permite observar Chromium durante las pruebas. Las comprobaciones de contactos corresponden a los canales existentes del portfolio y a la solicitud de CV por correo. Si se configura un CV real o se cambian los contactos, actualizar esas expectativas junto con el contenido.
