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
