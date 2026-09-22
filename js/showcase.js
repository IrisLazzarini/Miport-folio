import { galleries } from './galleries.js';

const cases = {
  scholarship: { es: 'GESTIÓN FINANCIERA', en: 'FINANCIAL MANAGEMENT', description: { es: 'De planillas dispersas a información confiable.', en: 'From scattered spreadsheets to reliable information.' } },
  accounting: { es: 'ARQUITECTURA Y BACKEND', en: 'ARCHITECTURE & BACKEND', description: { es: 'Facturación que se adapta a la infraestructura.', en: 'Invoicing that adapts to the infrastructure.' } },
  agromapa: { es: 'ANÁLISIS DE DATOS', en: 'DATA ANALYSIS', description: { es: 'Datos del campo para decidir con contexto.', en: 'Field data for decisions with context.' } },
};

export function initializeShowcase() {
  const showcase = document.querySelector('.hero-showcase');
  const buttons = [...showcase.querySelectorAll('[data-showcase]')];
  let selected = 'scholarship';
  let language = 'es';

  function render(announce = false) {
    const gallery = galleries[selected];
    const item = cases[selected];
    const number = Object.keys(cases).indexOf(selected) + 1;
    const title = language === 'en' ? gallery.titleEn : gallery.title;
    const image = showcase.querySelector('.showcase-image');
    image.src = gallery.cover;
    image.alt = gallery.images[0][language];
    showcase.querySelector('.showcase-category').textContent = item[language];
    showcase.querySelector('.showcase-number').textContent = `0${number} / 03`;
    showcase.querySelector('#showcase-title').textContent = title;
    showcase.querySelector('.showcase-description').textContent = item.description[language];
    showcase.querySelectorAll('.showcase-case, .showcase-image-link').forEach(link => { link.href = `#${selected}`; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.showcase === selected)));
    const status = showcase.querySelector('.showcase-status');
    if (announce || status.textContent) status.textContent = `${language === 'es' ? 'Proyecto seleccionado' : 'Selected project'}: ${title}`;
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => { selected = button.dataset.showcase; render(true); });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });
  });
  return { setLanguage(next) { language = next; render(); } };
}

export function initializeEmailCopy() {
  const button = document.querySelector('[data-copy-email]');
  const address = document.querySelector('.email-address');
  const status = document.querySelector('.copy-status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address.textContent.trim());
      status.textContent = document.documentElement.lang === 'es' ? 'Correo copiado.' : 'Email copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(address);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = document.documentElement.lang === 'es' ? 'Correo seleccionado. Usá la opción Copiar de tu dispositivo.' : 'Email selected. Use your device’s Copy command.';
    }
  });
  return { clearStatus() { status.textContent = ''; } };
}
