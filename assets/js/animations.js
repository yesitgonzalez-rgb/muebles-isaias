(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Imágenes (a través de su tarjeta) y textos de las secciones. No incluye
  // slider, ticker ni pie de página.
  var SELECTOR = [
    '.category-banner__box',
    '.product-card',
    '.commercial-note__text',
    '.payment-band__image',
    '.info-box',
    '.contact-box'
  ].join(',');

  var targets = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  var viewportH = window.innerHeight || document.documentElement.clientHeight;

  // Solo se ocultan los elementos que todavía no están a la vista: así lo
  // que ya se ve al cargar no parpadea ni aparece tarde.
  var pending = targets.filter(function (el) {
    return el.getBoundingClientRect().top > viewportH * 0.92;
  });

  if (!pending.length) return;

  pending.forEach(function (el) {
    var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [el];
    var position = siblings.indexOf(el);
    el.style.setProperty('--reveal-delay', (position % 3) * 90 + 'ms');
    el.classList.add('reveal');
  });

  var observer = null;

  function show(el) {
    if (!el.classList.contains('reveal') || el.classList.contains('is-visible')) return;
    if (observer) observer.unobserve(el);
    pending = pending.filter(function (item) { return item !== el; });
    el.classList.add('is-visible');

    // Al terminar se retiran las clases y el retraso, para que el hover
    // de las tarjetas responda sin demora.
    window.setTimeout(function () {
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--reveal-delay');
    }, 1200);
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    pending.forEach(function (el) { observer.observe(el); });
  }

  // Respaldo: si el observador no responde, el desplazamiento también
  // revela lo que entra a la vista (nada queda invisible). Son pocos
  // elementos, por lo que la revisión es liviana.
  function check() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    pending.slice().forEach(function (el) {
      if (el.getBoundingClientRect().top < h * 0.96) show(el);
    });
    if (!pending.length) {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
})();
