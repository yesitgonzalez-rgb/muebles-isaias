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

  function addToCart(id, name) {
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: id, name: name, qty: 1 });
    }
    saveCart(cart);
    render();
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
    render();
  }

  function buildWhatsappMessage(cart) {
    if (!cart.length) {
      return 'Hola, quiero cotizar productos de Muebles Isaías.';
    }
    var lines = ['Hola, quiero cotizar los siguientes productos de Muebles Isaías:', ''];
    cart.forEach(function (item) {
      lines.push('- ' + item.name + (item.qty > 1 ? ' (x' + item.qty + ')' : ''));
    });
    return lines.join('\n');
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
        addToCart(card.getAttribute('data-product-id'), btn.getAttribute('data-product-name'));
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
