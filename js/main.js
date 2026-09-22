import { galleries } from './galleries.js';
import { profile } from './profile.js';
import { initializeShowcase, initializeEmailCopy } from './showcase.js';

const root = document.documentElement;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const dialog = document.querySelector('.gallery-dialog');
const image = dialog.querySelector('.gallery-image');
const imageError = dialog.querySelector('.gallery-error');
let language = 'es';
let currentGallery = null;
let currentImageIndex = 0;
let galleryOpener = null;
const showcase = initializeShowcase();
const emailCopy = initializeEmailCopy();

function localized(value) {
  return typeof value === 'string' ? value : value?.[language] || value?.es || '';
}

function renderExperience() {
  if (!profile.experiences.length) return;
  const template = document.querySelector('#experience-entry');
  const list = document.querySelector('.experience-list');
  const entries = profile.experiences.filter(entry => localized(entry.role) && entry.organization);
  if (!entries.length) return;
  list.replaceChildren(...entries.map(entry => {
    const fragment = template.content.cloneNode(true);
    const fields = {
      '.experience-period': entry.period,
      h3: entry.role,
      '.experience-projects': entry.organization,
      '.experience-description': entry.responsibilities,
      '.experience-outcome': entry.outcome,
    };
    for (const [selector, value] of Object.entries(fields)) {
      const element = fragment.querySelector(selector);
      element.textContent = localized(value);
      element.hidden = !element.textContent;
    }
    return fragment;
  }));
}

function renderProjectContributions() {
  for (const [key, value] of Object.entries(profile.projectContributions || {})) {
    if (!localized(value)) continue;
    const details = document.getElementById(key)?.querySelector('.case-details');
    if (!details) continue;
    let row = details.querySelector('[data-profile-contribution]');
    if (!row) {
      row = document.createElement('div');
      row.dataset.profileContribution = '';
      row.append(document.createElement('dt'), document.createElement('dd'));
      details.append(row);
    }
    row.querySelector('dt').textContent = language === 'es' ? 'Mi participación' : 'My contribution';
    row.querySelector('dd').textContent = localized(value);
  }
}

// Keep the original Spanish content as the static, indexable fallback.
const translatable = [...document.querySelectorAll('[data-en]')].map(element => ({
  element, es: element.textContent, en: element.dataset.en,
}));
const attributes = [
  ['data-aria-en', 'aria-label'],
  ['data-alt-en', 'alt'],
].flatMap(([key, attribute]) => [...document.querySelectorAll(`[${key}]`)].map(element => ({
  element, attribute, es: element.getAttribute(attribute), en: element.getAttribute(key),
})));

function updateMenuLabel() {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  const en = open ? 'Close menu' : 'Open menu';
  menuButton.dataset.ariaEn = en;
  menuButton.setAttribute('aria-label', language === 'en' ? en : open ? 'Cerrar menú' : 'Abrir menú');
}

function applyLanguage(nextLanguage) {
  language = nextLanguage === 'en' ? 'en' : 'es';
  root.lang = language;
  translatable.forEach(item => { item.element.textContent = item[language]; });
  attributes.forEach(item => { item.element.setAttribute(item.attribute, item[language]); });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  const description = language === 'es'
    ? 'Portfolio de Iris Lazzarini. Análisis funcional y desarrollo full stack: sistemas de gestión, aplicaciones web y soluciones basadas en datos.'
    : 'Iris Lazzarini’s portfolio. Functional analysis and full stack development: management systems, web applications and data-driven solutions.';
  document.title = language === 'es'
    ? 'Iris Lazzarini — Análisis Funcional & Desarrollo de Software'
    : 'Iris Lazzarini — Functional Analyst & Software Developer';
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:locale"]').content = language === 'es' ? 'es_AR' : 'en_US';
  document.querySelector('meta[property="og:locale:alternate"]').content = language === 'es' ? 'en_US' : 'es_AR';
  updateMenuLabel();
  updateCvLinks();
  renderExperience();
  renderProjectContributions();
  showcase.setLanguage(language);
  emailCopy.clearStatus();
  if (currentGallery) updateGalleryText();
  try { localStorage.setItem('portfolio-language', language); } catch { /* Optional preference storage. */ }
}

function updateCvLinks() {
  if (!profile.cvUrl) return;
  const url = new URL(profile.cvUrl, document.baseURI);
  if (!['https:', 'http:'].includes(url.protocol)) return;
  document.querySelectorAll('[data-cv]').forEach(link => {
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const label = link.querySelector('[data-en]');
    label.textContent = language === 'es' ? 'Ver CV' : 'View CV';
  });
}

function closeMenu(restoreFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  updateMenuLabel();
  if (restoreFocus) menuButton.focus();
}

function initializeMenu() {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    updateMenuLabel();
    if (open) navigation.querySelector('a').focus();
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  navigation.addEventListener('focusout', event => {
    if (event.relatedTarget && !navigation.contains(event.relatedTarget) && event.relatedTarget !== menuButton) closeMenu();
  });
  matchMedia('(min-width: 951px)').addEventListener('change', () => closeMenu());
}

function updateGalleryText() {
  const gallery = galleries[currentGallery];
  const item = gallery.images[currentImageIndex];
  const caption = localized(item);
  dialog.querySelector('#gallery-title').textContent = language === 'en' ? gallery.titleEn || gallery.title : gallery.title;
  image.alt = caption;
  dialog.querySelector('#gallery-caption').textContent = caption;
  dialog.querySelector('.gallery-count').textContent = `${currentImageIndex + 1} / ${gallery.images.length}`;
}

function showGalleryImage(index) {
  const items = galleries[currentGallery].images;
  currentImageIndex = (index + items.length) % items.length;
  const item = items[currentImageIndex];
  imageError.hidden = true;
  image.hidden = false;
  image.width = item.width;
  image.height = item.height;
  image.src = item.src;
  dialog.querySelector('.gallery-original').href = new URL(item.src, document.baseURI).href;
  updateGalleryText();
}

function initializeGalleries() {
  image.addEventListener('error', () => { image.hidden = true; imageError.hidden = false; });
  image.addEventListener('load', () => { image.hidden = false; imageError.hidden = true; });
  document.querySelectorAll('[data-gallery]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (!galleries[link.dataset.gallery]?.images.length || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      closeMenu();
      galleryOpener = link;
      currentGallery = link.dataset.gallery;
      showGalleryImage(0);
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.querySelector('.gallery-close').focus();
    });
  });
  dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.gallery-prev').addEventListener('click', () => showGalleryImage(currentImageIndex - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => showGalleryImage(currentImageIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button, a[href]')].filter(element => !element.hidden && !element.disabled);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showGalleryImage(currentImageIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    currentGallery = null;
    galleryOpener?.focus({ preventScroll: true });
  });
}

function initializeObservers() {
  if (typeof IntersectionObserver !== 'function') return;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  }
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  navLinks.forEach(link => {
    const target = document.getElementById(link.hash.slice(1));
    if (target) sectionObserver.observe(target);
  });
}

let savedLanguage = 'es';
try { savedLanguage = localStorage.getItem('portfolio-language') || 'es'; } catch { /* Use Spanish without storage. */ }
document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});
applyLanguage(savedLanguage);
initializeMenu();
initializeGalleries();
initializeObservers();
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
root.classList.add('js');
