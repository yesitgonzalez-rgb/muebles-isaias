(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.site-nav__item--dropdown'));
  if (!items.length) return;

  // Con ratón y menú de escritorio: también abre al pasar el cursor.
  // En táctil o con el menú hamburguesa (≤767px) solo funciona por toque.
  function hoverMode() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
           window.matchMedia('(min-width: 768px)').matches;
  }

  var menus = items.map(function (item) {
    var toggle = item.querySelector('.site-nav__dropdown-toggle');
    if (!toggle) return null;
    return { item: item, toggle: toggle, closeTimer: null };
  }).filter(Boolean);

  function setOpen(m, open) {
    m.item.classList.toggle('is-open', open);
    m.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Al abrir un desplegable, los demás se cierran.
  function openOnly(m) {
    menus.forEach(function (o) {
      if (o !== m) {
        window.clearTimeout(o.closeTimer);
        setOpen(o, false);
      }
    });
    window.clearTimeout(m.closeTimer);
    setOpen(m, true);
  }

  menus.forEach(function (m) {
    m.toggle.addEventListener('click', function (e) {
      // Con ratón, el hover ya abrió el menú: el clic lo mantiene abierto en
      // lugar de cerrarlo. Con toque o teclado (detail 0) alterna abrir/cerrar.
      if (hoverMode() && e.detail > 0) {
        openOnly(m);
        return;
      }
      if (m.item.classList.contains('is-open')) setOpen(m, false);
      else openOnly(m);
    });

    m.item.addEventListener('mouseenter', function () {
      if (!hoverMode()) return;
      openOnly(m);
    });

    m.item.addEventListener('mouseleave', function () {
      if (!hoverMode()) return;
      m.closeTimer = window.setTimeout(function () { setOpen(m, false); }, 150);
    });

    // Elegir una opción cierra el desplegable.
    m.item.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.site-nav__submenu a')) setOpen(m, false);
    });
  });

  document.addEventListener('click', function (e) {
    menus.forEach(function (m) {
      if (!m.item.contains(e.target)) setOpen(m, false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (m) {
      if (m.item.classList.contains('is-open')) {
        setOpen(m, false);
        m.toggle.focus();
      }
    });
  });

  // Al cerrar el menú hamburguesa, los submenús también se pliegan.
  var navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (navToggle.getAttribute('aria-expanded') !== 'true') {
        menus.forEach(function (m) { setOpen(m, false); });
      }
    });
  }
})();
