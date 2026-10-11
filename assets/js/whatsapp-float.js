(function () {
  // WhatsApp global: botón flotante reutilizable.
  // Mismo botón, ícono y enlace que el Home. Si la página ya tiene un
  // .wa-float (el Home), no inserta otro. No toca el carrito.
  if (document.querySelector('.wa-float')) return;

  var WHATSAPP_NUMBER = '573155588560'; // 315 558 8560
  var MESSAGE = 'Hola, quiero información sobre los muebles de Muebles Isaías.';

  var link = document.createElement('a');
  link.className = 'wa-float';
  link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(MESSAGE);
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', 'Escribir por WhatsApp a Muebles Isaías');
  link.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.1a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.4-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z"/>' +
    '</svg>';

  document.body.appendChild(link);
  document.body.classList.add('has-wa-float');
})();
