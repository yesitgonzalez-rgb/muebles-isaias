(function () {
  var track = document.getElementById('heroTrack');
  if (!track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.hero__slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero__dot'));
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  var hero = document.getElementById('hero');

  var current = 0;
  var total = slides.length;
  var intervalMs = 6000;
  var timer = null;

  function goTo(index) {
    if (index === current) return;
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + total) % total;

    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, intervalMs);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-goto'), 10));
      startAutoplay();
    });
  });

  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);

    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); startAutoplay(); }
      if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    });

    var touchStartX = 0;
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
})();
