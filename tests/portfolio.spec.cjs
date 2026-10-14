/* Browser checks for the professional dual-profile presentation. No production dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {chromium} = require(process.env.PORTFOLIO_PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/Miport-folio/';
const output=process.env.PORTFOLIO_TEST_OUTPUT;
const results=[];
let browser;
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS '+name)}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL '+name+' '+e.message)}}
async function pageWith(options,fn){const ctx=await browser.newContext({viewport:{width:1440,height:1000},...options});try{const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await fn(p,errors);assert.deepEqual(errors,[])}finally{await ctx.close()}}
const hash=x=>createHash('sha256').update(x).digest('hex');
(async()=>{
 const downloadDir=path.resolve(output || path.join(__dirname,'../../test-results'),'descargas');fs.mkdirSync(downloadDir,{recursive:true});
 browser=await chromium.launch({headless:true,downloadsPath:downloadDir,...(process.env.PORTFOLIO_BROWSER_PATH?{executablePath:process.env.PORTFOLIO_BROWSER_PATH}:{})});
 for(const width of [1440,1024,768,390,320]) await test('Layout, imágenes y enlaces locales a '+width+'px',()=>pageWith({viewport:{width,height:950}},async p=>{
  await p.evaluate(async()=>{for(const image of document.querySelectorAll('img[src]')){image.loading='eager';await image.decode().catch(()=>{})}await document.fonts.ready});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await p.locator('h1').count(),1);
  for(const image of await p.locator('img[src]').all()) assert.equal(await image.evaluate(x=>x.naturalWidth>0),true);
  const bad=await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));assert.deepEqual(bad,[]);
  if(output){fs.mkdirSync(output,{recursive:true});await p.screenshot({path:path.join(output,'pantalla-'+width+'.png'),fullPage:true});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(output,'inicio-'+width+'.png')});}
 }));
 await test('Contenido respaldado, perfiles y datos sensibles fuera de la interfaz',()=>pageWith({},async p=>{
  assert.equal(await p.locator('.experience-item').count(),4);
  assert.match(await p.locator('.experience-item').first().innerText(),/18 de marzo de 2025.*Actualidad/);
  assert.match(await p.locator('.professional-card').innerText(),/Tecnología[\s\S]*Administración y datos/);
  assert.match(await p.locator('#digitalizacion').innerText(),/En preparación/);
  assert.equal(await p.locator('[data-gallery="scholarship"],[data-gallery="accounting"]').count(),0);
  assert.equal(await p.locator('img[src*="scholarship"],img[src*="accounting"]').count(),0);
  assert.equal(await p.locator('#tecnologias').innerText().then(x=>x.includes('C#')),false);
 }));
 await test('Filtros, traducción, teclado y persistencia',()=>pageWith({},async p=>{
  assert.equal(await p.locator('[data-category]:visible').count(),8);
  await p.locator('[data-filter="admin"]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-category]:visible').count(),1);
  await p.locator('[data-language="en"]').click();assert.match(await p.locator('.filter-status').innerText(),/1 projects shown/);assert.equal(await p.locator('[data-category]:visible').count(),1);
  assert.match(await p.locator('.professional-card').innerText(),/Administration and data/);
  await p.locator('[data-filter="tech"]').click();assert.equal(await p.locator('[data-category]:visible').count(),7);
  await p.reload();assert.equal(await p.locator('html').getAttribute('lang'),'en');
  await p.locator('[data-filter="all"]').click();assert.equal(await p.locator('[data-category]:visible').count(),8);
 }));
 await test('Menú móvil, navegación y Escape',()=>pageWith({viewport:{width:390,height:844}},async p=>{
  const menu=p.locator('.menu-toggle');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');
  await p.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');assert.equal(await menu.evaluate(x=>x===document.activeElement),true);
  await menu.click();await p.locator('.navigation a[href="#formacion"]').click();assert.equal(await menu.getAttribute('aria-expanded'),'false');assert.equal(new URL(p.url()).hash,'#formacion');
 }));
 await test('Galerías reales, imágenes, Escape y restitución de foco',()=>pageWith({},async p=>{
  for(const key of ['agromapa','chartier','polo','comercio45']){
   const opener=p.locator('[data-gallery="'+key+'"]').first();await opener.click();assert.equal(await p.locator('.gallery-dialog').evaluate(x=>x.open),true);
   const count=Number((await p.locator('.gallery-count').innerText()).split('/')[1]);
   for(let i=0;i<count;i++){await p.locator('.gallery-image').evaluate(x=>x.decode());assert.equal(await p.locator('.gallery-image').evaluate(x=>x.naturalWidth>0),true);assert.ok((await p.locator('.gallery-image').getAttribute('alt')).length);await p.locator('.gallery-next').click()}
   await p.keyboard.press('Escape');assert.equal(await p.locator('.gallery-dialog').evaluate(x=>x.open),false);assert.equal(await opener.evaluate(x=>x===document.activeElement),true);
  }
 }));
 await test('CV IT y administrativo: rutas, respuestas y activación de descarga correctas',()=>pageWith({},async p=>{
  const hashes=[];
  for(const [file,download] of [['iris-lazzarini-cv-it.pdf','Iris-Lazzarini-CV-IT.pdf'],['iris-lazzarini-cv-administrativo.pdf','Iris-Lazzarini-CV-Administrativo.pdf']]){
   const link=p.locator('#cv a[download="'+download+'"]');assert.ok((await link.getAttribute('href')).endsWith(file));
   const response=await p.request.get(new URL('assets/docs/'+file,base).href);assert.equal(response.status(),200);
   const bytes=await response.body();assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.equal(hash(bytes),hash(fs.readFileSync(path.join(__dirname,'../assets/docs',file))));hashes.push(hash(bytes));
   const pending=p.waitForEvent('download');await link.click();const got=await pending;assert.equal(got.suggestedFilename(),download);
   const failure=await got.failure();
   if(failure){results.push({name:'Guardado local de '+download,status:'limited',reason:failure});console.warn('LIMIT '+download+': '+failure);if(process.env.PORTFOLIO_REQUIRE_DISK_DOWNLOAD==='1')throw new Error('El navegador canceló el guardado: '+failure)}
   else assert.equal(hash(fs.readFileSync(await got.path())),hash(bytes));
  }assert.notEqual(hashes[0],hashes[1]);
 }));
 await test('Sin JavaScript: contenido completo, CV y contacto',()=>pageWith({javaScriptEnabled:false},async p=>{
  assert.equal(await p.locator('.experience-item').count(),4);assert.equal(await p.locator('[data-category]:visible').count(),8);
  assert.ok((await p.locator('.experience-item').first().innerText()).includes('Voluntariado'));
  assert.equal(await p.locator('#cv a[download]').count(),2);
  assert.ok((await p.locator('a[href="mailto:irislazzarini81@gmail.com"]').count())>=2);
 }));
 await test('Almacenamiento bloqueado y movimiento reducido',()=>pageWith({reducedMotion:'reduce'},async p=>{
  await p.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});await p.reload();
  await p.locator('[data-language="en"]').click();assert.equal(await p.locator('html').getAttribute('lang'),'en');
  assert.equal(await p.locator('.button').first().evaluate(x=>getComputedStyle(x).transitionDuration),'0s');
 }));
 await test('SEO, recursos locales y rutas de GitHub Pages',()=>pageWith({},async p=>{
  assert.match(await p.title(),/Administración y Datos/);assert.match(await p.locator('meta[name="description"]').getAttribute('content'),/Excel/);
  assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://irislazzarini.github.io/Miport-folio/');
  const urls=await p.evaluate(()=>[...document.querySelectorAll('[href],[src]')].map(x=>x.getAttribute('href')||x.getAttribute('src')).filter(x=>x&&!x.startsWith('#')&&!/^(https?:|mailto:)/.test(x)).map(x=>new URL(x,document.baseURI).href.split('#')[0]));
  for(const url of new Set(urls)){const r=await p.request.get(url);assert.equal(r.status(),200,url)}
 }));
 await browser.close();
 if(output)fs.writeFileSync(path.join(output,'validacion.json'),JSON.stringify(results,null,2));
 console.log(`${results.filter(x=>x.status==='passed').length}/${results.filter(x=>x.status!=='limited').length} comprobaciones correctas; ${results.filter(x=>x.status==='limited').length} límites de guardado local`);
 if(results.some(x=>x.status==='failed'))process.exitCode=1;
})().catch(async e=>{console.error(e);if(browser)await browser.close();process.exitCode=1});
