# Validación del portafolio

Pruebas: cinco anchos (1440, 1024, 768, 390, 320 px), imágenes, enlaces, perfiles, fechas, filtros, traducción, teclado, menú móvil, galerías, un único CV, contenido sin JS, almacenamiento bloqueado, movimiento reducido y SEO. Sin dependencias de producción.

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

El 14/10/2026 se completaron 13 comprobaciones funcionales. La descarga real del CV único funcionó y sus bytes coincidieron con el PDF original enviado por Iris. No se registraron límites de guardado local.

## Corrección solicitada por Iris

Se usa exclusivamente el archivo «Iris Luján Lazzarini _Analista Junior_ Curriculum vitaee.pdf» como CV para todo el portafolio, sin editar sus bytes. Se retiró la tarjeta de CV administrativo, los PDF generados y su generador. Las áreas profesionales del sitio se mantienen; la corrección afecta únicamente al CV.
