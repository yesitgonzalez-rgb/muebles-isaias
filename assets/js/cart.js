(function () {
  var STORAGE_KEY = 'muebles-isaias-cotizacion';
  var WHATSAPP_NUMBER = '573155588560';

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function addToCart(id, name, extra) {
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      var item = { id: id, name: name, qty: 1 };
      if (extra && extra.img) item.img = extra.img;
      if (extra && extra.desc) item.desc = extra.desc;
      cart.push(item);
    }
    saveCart(cart);
    render();
  }

  function changeQty(id, delta) {
    var cart = getCart();
    var item = cart.find(function (it) { return it.id === id; });
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    render();
  }

  // Modo "rico" (Home): el panel declara data-cart-rich y muestra imagen,
  // descripción y controles de cantidad. Sin ese atributo se conserva el
  // comportamiento anterior de las páginas de catálogo.
  function isRich() {
    var panel = document.getElementById('cartPanel');
    return !!(panel && panel.hasAttribute('data-cart-rich'));
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
    render();
  }

  function buildRichWhatsappMessage(cart) {
    if (!cart.length) {
      return 'Hola, quiero solicitar información y cotización de Muebles Isaías.';
    }
    var lines = ['Hola, quiero solicitar información y cotización sobre:', ''];
    cart.forEach(function (item) {
      lines.push('* ' + item.name + ' — Cantidad: ' + item.qty);
    });
    return lines.join('\n');
  }

  function buildWhatsappMessage(cart) {
    if (isRich()) return buildRichWhatsappMessage(cart);
    if (!cart.length) {
      return 'Hola, quiero cotizar productos de Muebles Isaías.';
    }
    var lines = ['Hola, quiero cotizar los siguientes productos de Muebles Isaías:', ''];
    cart.forEach(function (item) {
      lines.push('- ' + item.name + (item.qty > 1 ? ' (x' + item.qty + ')' : ''));
    });
    return lines.join('\n');
  }

  function makeButton(className, text, label, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.textContent = text;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', onClick);
    return b;
  }

  function buildRichItem(item) {
    var li = document.createElement('li');
    li.className = 'cart-item';

    if (item.img) {
      var img = document.createElement('img');
      img.className = 'cart-item__img';
      img.src = item.img;
      img.alt = item.name;
      li.appendChild(img);
    }

    var info = document.createElement('div');
    info.className = 'cart-item__info';

    var name = document.createElement('strong');
    name.className = 'cart-item__name';
    name.textContent = item.name;
    info.appendChild(name);

    if (item.desc) {
      var desc = document.createElement('span');
      desc.className = 'cart-item__desc';
      desc.textContent = item.desc;
      info.appendChild(desc);
    }

    var qty = document.createElement('div');
    qty.className = 'cart-item__qty';
    var minus = makeButton('cart-item__btn', '−', 'Disminuir cantidad de ' + item.name, function () { changeQty(item.id, -1); });
    minus.disabled = item.qty <= 1;
    var value = document.createElement('span');
    value.className = 'cart-item__qty-value';
    value.textContent = 'Cantidad: ' + item.qty;
    var plus = makeButton('cart-item__btn', '+', 'Aumentar cantidad de ' + item.name, function () { changeQty(item.id, 1); });
    qty.appendChild(minus);
    qty.appendChild(value);
    qty.appendChild(plus);
    info.appendChild(qty);

    var remove = makeButton('cart-panel__item-remove', 'Eliminar', 'Eliminar ' + item.name + ' del carrito', function () { removeFromCart(item.id); });
    info.appendChild(remove);

    li.appendChild(info);
    return li;
  }

  function render() {
    var cart = getCart();
    var countEl = document.getElementById('cartCount');
    var listEl = document.getElementById('cartList');
    var quoteBtn = document.getElementById('cartQuoteBtn');
    if (!countEl || !listEl || !quoteBtn) return;

    var totalQty = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    countEl.textContent = totalQty;

    listEl.innerHTML = '';
    if (!cart.length) {
      var empty = document.createElement('li');
      empty.className = 'cart-panel__empty';
      empty.id = 'cartEmpty';
      empty.textContent = 'Todavía no has agregado productos.';
      listEl.appendChild(empty);
    } else {
      cart.forEach(function (item) {
        if (isRich()) {
          listEl.appendChild(buildRichItem(item));
          return;
        }
        var li = document.createElement('li');

        var label = document.createElement('span');
        label.textContent = item.name + (item.qty > 1 ? ' (x' + item.qty + ')' : '');

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'cart-panel__item-remove';
        removeBtn.textContent = 'Quitar';
        removeBtn.addEventListener('click', function () { removeFromCart(item.id); });

        li.appendChild(label);
        li.appendChild(removeBtn);
        listEl.appendChild(li);
      });
    }

    quoteBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildWhatsappMessage(cart));

    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      var card = btn.closest('[data-product-id]');
      if (!card) return;
      if (isRich()) {
        var q = cart.filter(function (item) { return item.id === card.getAttribute('data-product-id'); })[0];
        btn.classList.toggle('is-added', !!q);
        return;
      }
      var inCart = cart.some(function (item) { return item.id === card.getAttribute('data-product-id'); });
      btn.classList.toggle('is-added', inCart);
      btn.textContent = inCart ? 'AGREGADO AL CARRITO ✓' : 'ADICIONAR AL CARRITO';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();

    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('[data-product-id]');
        if (!card) return;
        addToCart(card.getAttribute('data-product-id'), btn.getAttribute('data-product-name'), {
          img: btn.getAttribute('data-product-img'),
          desc: btn.getAttribute('data-product-desc')
        });
      });
    });

    var cartToggle = document.getElementById('cartToggle');
    var cartPanel = document.getElementById('cartPanel');
    if (cartToggle && cartPanel) {
      cartToggle.addEventListener('click', function () {
        var isOpen = cartPanel.classList.toggle('is-open');
        cartToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', function (e) {
        if (!cartPanel.contains(e.target) && !cartToggle.contains(e.target)) {
          cartPanel.classList.remove('is-open');
          cartToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
})();
