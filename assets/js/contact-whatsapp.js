(function () {
  var WHATSAPP_NUMBER = '573155588560';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var fields = {
    name: { el: document.getElementById('cfName'), error: document.getElementById('cfNameError'), msg: 'Escribe tu nombre.' },
    product: { el: document.getElementById('cfProduct'), error: document.getElementById('cfProductError'), msg: 'Selecciona un producto de interés.' },
    message: { el: document.getElementById('cfMessage'), error: document.getElementById('cfMessageError'), msg: 'Cuéntanos qué necesitas.' }
  };
  var phoneEl = document.getElementById('cfPhone');

  function isFilled(el) {
    return el.value.trim() !== '';
  }

  function setError(field, show) {
    field.error.textContent = show ? field.msg : '';
    field.el.setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    var evt = field.el.tagName === 'SELECT' ? 'change' : 'input';
    field.el.addEventListener(evt, function () {
      if (isFilled(field.el)) setError(field, false);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      var invalid = !isFilled(field.el);
      setError(field, invalid);
      if (invalid && !firstInvalid) firstInvalid = field.el;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var lines = ['Hola, soy ' + fields.name.el.value.trim() + '.'];
    var phone = phoneEl.value.trim();
    if (phone) lines.push('Teléfono: ' + phone);
    lines.push('Producto de interés: ' + fields.product.el.value);
    lines.push('Mensaje: ' + fields.message.el.value.trim());

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
