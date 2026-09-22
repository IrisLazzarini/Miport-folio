/* Standalone browser regression checks. See tests/README.md for setup. */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {
  ({ chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_MODULE || 'playwright'));
} catch (error) {
  console.error('Playwright is required only for these tests. See tests/README.md.');
  throw error;
}

const BASE_URL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/Miport-folio/';
const OUTPUT = process.env.PORTFOLIO_TEST_OUTPUT;
const EMAIL = 'irislazzarini81@gmail.com';
const PROJECT_COUNTS = { scholarship: 12, accounting: 17, agromapa: 6, chartier: 5, polo: 5, comercio45: 7 };
const SHOWCASE_KEYS = ['scholarship', 'accounting', 'agromapa'];
const results = [];
let browser;

async function check(name, run) {
  const start = Date.now();
  try {
    await run();
    results.push({ name, status: 'passed', durationMs: Date.now() - start });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: 'failed', durationMs: Date.now() - start, error: error.stack });
    console.error(`FAIL ${name}\n${error.stack}`);
  }
}

async function withPage(options, run, initialize) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(new URL(BASE_URL).origin) && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', request => {
    const failure = request.failure()?.errorText || 'Unknown request failure';
    if (request.url().startsWith(new URL(BASE_URL).origin) && !failure.includes('ERR_ABORTED')) {
      errors.push(`${failure} ${request.url()}`);
    }
  });
  try {
    if (initialize) await initialize(page);
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, `Portfolio must be served at ${BASE_URL}`);
    await page.evaluate(() => document.fonts.ready);
    await run(page);
    assert.deepEqual(errors, [], 'No uncaught JavaScript errors or failed local resources');
  } finally {
    await context.close();
  }
}

async function assertNoOverflow(page, label) {
  const size = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(size.document <= size.viewport + 1 && size.body <= size.viewport + 1,
    `${label}: horizontal overflow ${JSON.stringify(size)}`);
}

async function chooseLanguage(page, language) {
  await page.locator(`[data-language="${language}"]`).click();
  await page.waitForFunction(lang => document.documentElement.lang === lang, language);
  assert.equal(await page.locator(`[data-language="${language}"]`).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator(`[data-language="${language === 'es' ? 'en' : 'es'}"]`).getAttribute('aria-pressed'), 'false');
}

async function galleryData(page) {
  return page.evaluate(async () => (await import(new URL('js/galleries.js', location.href).href)).galleries);
}

async function assertGalleryImage(page, item, index, count, language = 'es') {
  await page.waitForFunction(src => {
    const image = document.querySelector('.gallery-image');
    return image.getAttribute('src') === src && image.complete && image.naturalWidth > 0;
  }, item.src);
  const image = page.locator('.gallery-image');
  assert.equal(await image.getAttribute('alt'), item[language]);
  assert.equal(await image.evaluate(element => element.naturalWidth), item.width);
  assert.equal(await image.evaluate(element => element.naturalHeight), item.height);
  assert.ok((await page.locator('#gallery-caption').textContent()).includes(item[language]));
  const numbers = (await page.locator('.gallery-count').textContent()).match(/\d+/g).map(Number);
  assert.deepEqual(numbers, [index + 1, count], 'Gallery counter follows selected screenshot');
  const original = await page.locator('.gallery-original').getAttribute('href');
  assert.equal(new URL(original, page.url()).href, new URL(item.src, page.url()).href);
}

async function assertFocusInDialog(page) {
  assert.equal(await page.evaluate(() => document.querySelector('.gallery-dialog').contains(document.activeElement)), true,
    'Keyboard focus stays inside the open modal');
}

async function assertShowcase(page, galleries, key, language) {
  const gallery = galleries[key];
  const title = language === 'en' ? gallery.titleEn : gallery.title;
  const image = page.locator('.showcase-image');
  await page.waitForFunction(src => {
    const image = document.querySelector('.showcase-image');
    return image.getAttribute('src') === src && image.complete && image.naturalWidth > 0;
  }, gallery.cover);
  assert.equal(await image.getAttribute('alt'), gallery.images[0][language]);
  assert.equal((await page.locator('#showcase-title').textContent()).trim(), title);
  assert.deepEqual(await page.locator('[data-showcase][aria-pressed="true"]').evaluateAll(buttons => buttons.map(button => button.dataset.showcase)), [key],
    'Exactly the selected project is announced as pressed');
  assert.equal((await page.locator('.showcase-number').textContent()).trim(), `0${SHOWCASE_KEYS.indexOf(key) + 1} / 03`);
  for (const selector of ['.showcase-image-link', '.showcase-case']) {
    assert.equal(await page.locator(selector).getAttribute('href'), `#${key}`);
    assert.equal(await page.locator(`#${key}`).count(), 1, 'Showcase links target an existing case study');
  }
  assert.equal(await page.locator('.showcase-image-link').getAttribute('aria-labelledby'), 'showcase-title');
}

async function mockClipboard(page, mode) {
  await page.addInitScript(selectedMode => {
    window.__portfolioClipboardWrites = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: selectedMode === 'unavailable' ? undefined : {
        async writeText(value) {
          if (selectedMode === 'denied') throw new DOMException('Clipboard permission denied for test', 'NotAllowedError');
          window.__portfolioClipboardWrites.push(value);
        },
      },
    });
  }, mode);
}

async function main() {
  browser = await chromium.launch({ headless: process.env.PORTFOLIO_HEADED !== '1', executablePath: process.env.PORTFOLIO_BROWSER_PATH || undefined });
  try {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await check(`Responsive layout and image loading at ${width}px`, () => withPage(
        { viewport: { width, height: 1000 } }, async page => {
          assert.equal(await page.locator('h1').count(), 1);
          assert.ok(await page.locator('h1').isVisible());
          await assertNoOverflow(page, 'Initial page');
          for (const image of await page.locator('main img[src]').all()) {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate(element => element.decode());
            assert.ok(await image.evaluate(element => element.naturalWidth > 0));
          }
          await assertNoOverflow(page, 'After loading all main images');
          await chooseLanguage(page, 'en');
          await assertNoOverflow(page, 'English page');
          await chooseLanguage(page, 'es');
          await page.locator('h1').scrollIntoViewIfNeeded();
          if (OUTPUT) {
            await page.screenshot({ path: path.join(OUTPUT, `portfolio-${width}.png`), fullPage: true });
          }
        },
      ));
    }

    await check('All local anchors resolve and desktop navigation reaches its sections', () => withPage({}, async page => {
      const broken = await page.locator('a[href^="#"]').evaluateAll(links => links
        .filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1))))
        .map(link => link.getAttribute('href')));
      assert.deepEqual(broken, [], 'Every in-page anchor has a real target');
      const links = page.locator('#navigation > a[href^="#"]');
      assert.equal(await links.count(), 6);
      for (const link of await links.all()) {
        const hash = await link.getAttribute('href');
        await link.click();
        await page.waitForFunction(expected => location.hash === expected, hash);
        await page.waitForFunction(id => {
          const top = document.getElementById(id).getBoundingClientRect().top;
          return top >= -1 && top < innerHeight / 2;
        }, hash.slice(1));
      }
      await page.keyboard.press('Control+Home');
      const skip = page.locator('.skip-link');
      await skip.focus();
      assert.ok(await skip.isVisible(), 'Skip-to-content link is available to keyboard users');
      await skip.press('Enter');
      assert.equal(new URL(page.url()).hash, '#contenido');
    }));

    await check('Complete ES/EN copy, accessible labels, and language persistence', () => withPage({}, async page => {
      assert.equal(await page.locator('html').getAttribute('lang'), 'es');
      const spanish = await page.locator('[data-en]').evaluateAll(elements => elements.map(element => element.textContent));
      assert.ok(spanish.length > 100, 'Translation check covers the whole portfolio');
      await chooseLanguage(page, 'en');
      const errors = await page.evaluate(() => {
        const failures = [];
        for (const [selector, property, attribute] of [
          ['[data-en]', 'textContent', 'data-en'],
          ['[data-alt-en]', 'alt', 'data-alt-en'],
          ['[data-aria-en]', 'ariaLabel', 'data-aria-en'],
        ]) {
          for (const element of document.querySelectorAll(selector)) {
            if (element[property] !== element.getAttribute(attribute)) {
              failures.push(`${selector}: ${element[property]} != ${element.getAttribute(attribute)}`);
            }
          }
        }
        return failures;
      });
      assert.deepEqual(errors, [], 'English copy and accessible attributes are fully translated');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.lang === 'en');
      assert.equal((await page.locator('.hero-description').textContent()).trim(), 'I turn needs, processes and data into digital products that solve real problems.');
      await chooseLanguage(page, 'es');
      assert.deepEqual(await page.locator('[data-en]').evaluateAll(elements => elements.map(element => element.textContent)), spanish,
        'Switching back restores the original Spanish text');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.lang === 'es');
    }));

    await check('Featured showcase selects all three cases, links correctly, and retains selection across ES/EN changes', () => withPage({}, async page => {
      const galleries = await galleryData(page);
      assert.deepEqual(await page.locator('[data-showcase]').evaluateAll(buttons => buttons.map(button => button.dataset.showcase)), SHOWCASE_KEYS);
      assert.equal(await page.locator('.showcase-switcher').getAttribute('role'), 'group');
      assert.equal(await page.locator('.showcase-status').getAttribute('role'), 'status');
      assert.equal(await page.locator('.showcase-status').getAttribute('aria-live'), 'polite');
      await assertShowcase(page, galleries, 'scholarship', 'es');
      for (const [index, key] of SHOWCASE_KEYS.entries()) {
        const button = page.locator(`[data-showcase="${key}"]`);
        await button.click();
        await assertShowcase(page, galleries, key, 'es');
        assert.equal((await page.locator('.showcase-status').textContent()).trim(), `Proyecto seleccionado: ${galleries[key].title}`);
        const spanishDescription = await page.locator('.showcase-description').textContent();
        const spanishCategory = await page.locator('.showcase-category').textContent();
        await chooseLanguage(page, 'en');
        await assertShowcase(page, galleries, key, 'en');
        assert.notEqual(await page.locator('.showcase-description').textContent(), spanishDescription);
        assert.notEqual(await page.locator('.showcase-category').textContent(), spanishCategory);
        await button.click();
        assert.equal((await page.locator('.showcase-status').textContent()).trim(), `Selected project: ${galleries[key].titleEn}`);
        const link = page.locator(index % 2 ? '.showcase-image-link' : '.showcase-case');
        await link.click();
        await page.waitForFunction(hash => location.hash === hash, `#${key}`);
        await page.waitForFunction(id => {
          const top = document.getElementById(id).getBoundingClientRect().top;
          return top >= -1 && top < innerHeight / 2;
        }, key);
        await chooseLanguage(page, 'es');
        await assertShowcase(page, galleries, key, 'es');
        assert.equal(await page.locator('.showcase-description').textContent(), spanishDescription);
        assert.equal(await page.locator('.showcase-category').textContent(), spanishCategory);
      }
    }));

    for (const width of [1440, 390]) {
      await check(`Showcase arrow, Home and End keyboard selection works at ${width}px`, () => withPage(
        { viewport: { width, height: 1000 } }, async page => {
          const galleries = await galleryData(page);
          await page.locator('[data-showcase="scholarship"]').focus();
          for (const [key, selected] of [
            ['ArrowLeft', 'agromapa'], ['ArrowRight', 'scholarship'], ['ArrowRight', 'accounting'],
            ['End', 'agromapa'], ['Home', 'scholarship'], ['ArrowRight', 'accounting'],
          ]) {
            await page.keyboard.press(key);
            await assertShowcase(page, galleries, selected, 'es');
            assert.equal(await page.locator(`[data-showcase="${selected}"]`).evaluate(button => button === document.activeElement), true,
              `${key} moves focus to the selected project`);
          }
          await chooseLanguage(page, 'en');
          await assertShowcase(page, galleries, 'accounting', 'en');
          await assertNoOverflow(page, 'Showcase keyboard navigation');
        },
      ));
    }

    await check('Copy email writes the exact address and announces success in ES/EN without touching the system clipboard', () => withPage({}, async page => {
      const status = page.locator('.copy-status');
      const button = page.locator('[data-copy-email]');
      assert.equal(await status.getAttribute('role'), 'status');
      assert.equal(await status.getAttribute('aria-live'), 'polite');
      assert.equal((await status.textContent()).trim(), '');
      for (const [language, message, count] of [['es', 'Correo copiado.', 1], ['en', 'Email copied.', 2]]) {
        await chooseLanguage(page, language);
        assert.equal((await status.textContent()).trim(), '', 'Changing language clears any previous copy feedback');
        await button.click();
        await page.waitForFunction(text => document.querySelector('.copy-status').textContent === text, message);
        assert.deepEqual(await page.evaluate(() => window.__portfolioClipboardWrites), Array(count).fill(EMAIL));
        assert.equal(await page.locator('.email-link').getAttribute('href'), `mailto:${EMAIL}`);
        assert.equal(await button.evaluate(element => element === document.activeElement), true, 'Copy keeps keyboard focus on the button');
      }
    }, page => mockClipboard(page, 'success')));

    for (const mode of ['denied', 'unavailable']) {
      await check(`Copy email safely selects the address when clipboard is ${mode}`, () => withPage({}, async page => {
        for (const [language, message] of [
          ['es', 'Correo seleccionado. Usá la opción Copiar de tu dispositivo.'],
          ['en', 'Email selected. Use your device’s Copy command.'],
        ]) {
          await chooseLanguage(page, language);
          assert.equal((await page.locator('.copy-status').textContent()).trim(), '');
          const previousURL = page.url();
          await page.locator('[data-copy-email]').click();
          await page.waitForFunction(text => document.querySelector('.copy-status').textContent === text, message);
          assert.equal(await page.evaluate(() => window.getSelection().toString()), EMAIL, 'Fallback selects only the complete email address');
          assert.deepEqual(await page.evaluate(() => window.__portfolioClipboardWrites), [], 'Failed or missing clipboard never reports a write');
          assert.equal(await page.locator('.email-link').getAttribute('href'), `mailto:${EMAIL}`);
          assert.equal(page.url(), previousURL, 'Fallback stays on the portfolio and preserves the mail link');
        }
      }, page => mockClipboard(page, mode)));
    }

    await check('Mobile navigation closes on Escape, links, and outside click; focus returns', () => withPage(
      { viewport: { width: 390, height: 844 } }, async page => {
        const toggle = page.locator('.menu-toggle');
        const nav = page.locator('#navigation');
        assert.ok(await toggle.isVisible());
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.ok(await nav.isVisible());
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await toggle.evaluate(element => element === document.activeElement), true);
        await toggle.click();
        await page.locator('#navigation a[href="#proyectos"]').click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(new URL(page.url()).hash, '#proyectos');
        await page.locator('h1').scrollIntoViewIfNeeded();
        await toggle.click();
        const navBox = await nav.boundingBox();
        assert.ok(navBox && navBox.y + navBox.height < 834, 'Menu leaves an outside area available');
        await page.mouse.click(8, Math.min(834, navBox.y + navBox.height + 12));
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await assertNoOverflow(page, 'Mobile navigation');
      },
    ));

    await check('All 52 gallery screenshots load; buttons, arrow keys, wrapping, focus and English captions work', () => withPage({}, async page => {
      const galleries = await galleryData(page);
      assert.deepEqual(Object.fromEntries(Object.entries(galleries).map(([key, value]) => [key, value.images.length])), PROJECT_COUNTS);
      const sources = Object.values(galleries).flatMap(gallery => gallery.images.map(image => image.src));
      assert.equal(new Set(sources).size, 52);
      for (const [key, gallery] of Object.entries(galleries)) {
        const opener = page.locator(`a[data-gallery="${key}"]`).first();
        await opener.click();
        assert.equal(await page.locator('.gallery-dialog').evaluate(dialog => dialog.open), true);
        await assertGalleryImage(page, gallery.images[0], 0, gallery.images.length);
        await page.locator('.gallery-prev').click();
        await assertGalleryImage(page, gallery.images.at(-1), gallery.images.length - 1, gallery.images.length);
        await page.keyboard.press('ArrowRight');
        await assertGalleryImage(page, gallery.images[0], 0, gallery.images.length);
        for (let i = 1; i < gallery.images.length; i++) {
          await page.locator('.gallery-next').click();
          await assertGalleryImage(page, gallery.images[i], i, gallery.images.length);
        }
        await page.locator('.gallery-next').click();
        await assertGalleryImage(page, gallery.images[0], 0, gallery.images.length);
        await page.keyboard.press('ArrowLeft');
        await assertGalleryImage(page, gallery.images.at(-1), gallery.images.length - 1, gallery.images.length);
        for (let tab = 0; tab < 6; tab++) {
          await page.keyboard.press('Tab');
          await assertFocusInDialog(page);
        }
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.gallery-dialog').evaluate(dialog => dialog.open), false);
        assert.equal(await opener.evaluate(element => document.activeElement === element), true, 'Closing a gallery restores opener focus');
      }
      await chooseLanguage(page, 'en');
      await page.locator('[data-gallery="scholarship"]').first().click();
      await assertGalleryImage(page, galleries.scholarship.images[0], 0, galleries.scholarship.images.length, 'en');
      await page.locator('.gallery-close').click();
      assert.equal(await page.locator('.gallery-dialog').evaluate(dialog => dialog.open), false);
    }));

    await check('Gallery fits a 320px mobile viewport with usable controls', () => withPage(
      { viewport: { width: 320, height: 720 } }, async page => {
        await page.locator('[data-gallery="scholarship"]').first().click();
        const gallery = (await galleryData(page)).scholarship;
        await assertGalleryImage(page, gallery.images[0], 0, gallery.images.length);
        for (const selector of ['.gallery-dialog', '.gallery-close', '.gallery-prev', '.gallery-next', '.gallery-original']) {
          const box = await page.locator(selector).boundingBox();
          assert.ok(box && box.x >= -1 && box.y >= -1 && box.x + box.width <= 321 && box.y + box.height <= 721,
            `${selector} must remain inside the viewport: ${JSON.stringify(box)}`);
        }
        await page.locator('.gallery-next').click();
        await assertGalleryImage(page, gallery.images[1], 1, gallery.images.length);
        await page.keyboard.press('Escape');
        await assertNoOverflow(page, 'Closed mobile gallery');
      },
    ));

    await check('Reduced-motion preference disables smooth scrolling and long animations', () => withPage(
      { reducedMotion: 'reduce' }, async page => {
        assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
        assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior), 'auto');
        const moving = await page.evaluate(() => document.getAnimations().filter(animation => {
          const timing = animation.effect.getComputedTiming();
          return animation.playState === 'running' && Number(timing.duration) > 20;
        }).length);
        assert.equal(moving, 0, 'No long running animation remains when reduced motion is requested');
        for (const section of await page.locator('main > section').all()) {
          await section.scrollIntoViewIfNeeded();
          assert.ok(await section.isVisible());
        }
      },
    ));

    await check('Without JavaScript, content and mobile navigation remain readable and image links work', () => withPage(
      { javaScriptEnabled: false, viewport: { width: 390, height: 844 } }, async page => {
        assert.ok(await page.locator('h1').isVisible());
        for (const selector of ['#proyectos', '#experiencia', '#sobre-mi', '#tecnologias', '#contacto']) {
          assert.ok(await page.locator(`${selector} h2`).isVisible(), `${selector} remains readable without JavaScript`);
        }
        const concealed = await page.locator('.reveal').evaluateAll(elements => elements.filter(element => {
          const style = getComputedStyle(element);
          return Number(style.opacity) === 0 || style.visibility === 'hidden' || style.display === 'none';
        }).length);
        assert.equal(concealed, 0, 'Reveal effects never hide content without JavaScript');
        const projectsLink = page.locator('#navigation a[href="#proyectos"]');
        assert.ok(await projectsLink.isVisible(), 'Mobile navigation is available without JavaScript');
        await projectsLink.click();
        assert.equal(new URL(page.url()).hash, '#proyectos');
        await assertNoOverflow(page, 'No-JavaScript mobile page');
        const fallback = page.locator('[data-gallery="scholarship"]').first();
        const expected = new URL(await fallback.getAttribute('href'), page.url()).href;
        await fallback.click();
        await page.waitForURL(expected);
        assert.ok(page.url().endsWith('.webp'), 'Gallery link opens an image when JavaScript is unavailable');
      },
    ));

    await check('Blocked localStorage and missing IntersectionObserver degrade gracefully', () => withPage(
      { viewport: { width: 390, height: 844 } }, async page => {
        assert.equal(await page.locator('html').getAttribute('lang'), 'es');
        await chooseLanguage(page, 'en');
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        await page.locator('[data-gallery="scholarship"]').first().click();
        const galleries = await galleryData(page);
        await assertGalleryImage(page, galleries.scholarship.images[0], 0, 12, 'en');
        await page.keyboard.press('Escape');
        const hidden = await page.locator('.reveal').evaluateAll(elements => elements.filter(element => Number(getComputedStyle(element).opacity) === 0).length);
        assert.equal(hidden, 0, 'Content remains visible without IntersectionObserver');
      }, async page => {
        await page.addInitScript(() => {
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked for test', 'SecurityError'); } });
          window.IntersectionObserver = undefined;
        });
      },
    ));

    await check('Contact and CV links point to real existing channels and external tabs are protected', () => withPage({}, async page => {
      assert.equal(await page.locator('.email-link').getAttribute('href'), `mailto:${EMAIL}`);
      const cvLinks = await page.locator('[data-cv]').all();
      assert.ok(cvLinks.length >= 2);
      for (const cv of cvLinks) {
        const url = new URL(await cv.getAttribute('href'), page.url());
        assert.equal(url.protocol, 'mailto:', 'The default CV action requests the actual CV by email');
        assert.equal(url.pathname, EMAIL);
        assert.ok(url.searchParams.get('subject'), 'CV request has an email subject');
      }
      assert.ok(await page.locator('#contacto a[href="https://github.com/IrisLazzarini"]').count());
      assert.ok(await page.locator('#contacto a[href="https://www.linkedin.com/in/iris-lazzarini-7600881a3"]').count());
      const unsafe = await page.locator('a[target="_blank"]').evaluateAll(links => links.filter(link => !link.relList.contains('noopener')).map(link => link.href));
      assert.deepEqual(unsafe, []);
      await chooseLanguage(page, 'en');
      for (const cv of cvLinks) {
        assert.ok((await cv.textContent()).includes('Request CV'));
        assert.equal(new URL(await cv.getAttribute('href'), page.url()).pathname, EMAIL);
      }
    }));
  } finally {
    await browser.close();
  }
  if (OUTPUT) fs.writeFileSync(path.join(OUTPUT, 'results.json'), JSON.stringify({ baseURL: BASE_URL, results }, null, 2) + '\n');
  const failed = results.filter(result => result.status === 'failed');
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  process.exitCode = failed.length ? 1 : 0;
}

if (OUTPUT) fs.mkdirSync(OUTPUT, { recursive: true });
main().catch(error => { console.error(error); process.exitCode = 1; });
