(function () {
  var item = document.querySelector('.site-nav__item--dropdown');
  var toggle = document.getElementById('salasMenuToggle');
  if (!item || !toggle) return;

  var closeTimer = null;

  // Con ratón y menú de escritorio: también abre al pasar el cursor.
  // En táctil o con el menú hamburguesa (≤767px) solo funciona por toque.
  function hoverMode() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
           window.matchMedia('(min-width: 768px)').matches;
  }

  function setOpen(open) {
    item.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function (e) {
    // Con ratón, el hover ya abrió el menú: el clic lo mantiene abierto en
    // lugar de cerrarlo. Con toque o teclado (detail 0) alterna abrir/cerrar.
    if (hoverMode() && e.detail > 0) {
      setOpen(true);
      return;
    }
    setOpen(!item.classList.contains('is-open'));
  });

  item.addEventListener('mouseenter', function () {
    if (!hoverMode()) return;
    window.clearTimeout(closeTimer);
    setOpen(true);
  });

  item.addEventListener('mouseleave', function () {
    if (!hoverMode()) return;
    closeTimer = window.setTimeout(function () { setOpen(false); }, 150);
  });

  document.addEventListener('click', function (e) {
    if (!item.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && item.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Al cerrar el menú hamburguesa, el submenú también se pliega.
  var navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (navToggle.getAttribute('aria-expanded') !== 'true') setOpen(false);
    });
  }
})();
