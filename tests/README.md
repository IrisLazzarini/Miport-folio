# Validación del portafolio

Pruebas: cinco anchos (1440, 1024, 768, 390, 320 px), imágenes, enlaces, perfiles, fechas, filtros, traducción, teclado, menú móvil, galerías, dos CV, contenido sin JS, almacenamiento bloqueado, movimiento reducido y SEO. Sin dependencias de producción.

Desde la raíz del repositorio:

```powershell
npm install --prefix ../portfolio-browser-tests playwright
node ../portfolio-browser-tests/node_modules/playwright/cli.js install chromium
$env:PORTFOLIO_PLAYWRIGHT_MODULE = (Resolve-Path '../portfolio-browser-tests/node_modules/playwright').Path
python -m http.server 4173 --bind 127.0.0.1 --directory ..
```

En otra terminal, desde el repositorio:

```powershell
$env:PORTFOLIO_BASE_URL = 'http://127.0.0.1:4173/Miport-folio/'
$env:PORTFOLIO_TEST_OUTPUT = '../portfolio-test-results'
node tests/portfolio.spec.cjs
```

Ajustar la URL si la carpeta tiene otro nombre. `PORTFOLIO_BROWSER_PATH` permite usar un navegador existente.

Se comprueban la ruta correcta de cada PDF, los bytes servidos y el evento de descarga con el nombre esperado. El guardado en disco también se intenta: si el navegador lo cancela, se registra `status: limited`; no se cuenta como guardado exitoso. Para exigirlo como requisito de aprobación:

```powershell
$env:PORTFOLIO_REQUIRE_DISK_DOWNLOAD = '1'
node tests/portfolio.spec.cjs
```

El 14/10/2026 se completaron 13 comprobaciones funcionales. El navegador recibió los dos PDF pero canceló ambos guardados locales. Queda pendiente la descarga manual en un navegador sin esa restricción. Cada CV tiene una página, con texto extraíble y contenido diferente; ambos se renderizaron y revisaron visualmente.
