/**
 * Lessons gallery + lightbox.
 */
(function () {
  const grid = document.getElementById('lessons-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightbox-image');
  const lbCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox && lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox && lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox && lightbox.querySelector('.lightbox-next');

  if (lightbox && lightbox.parentElement !== document.body) {
    document.body.appendChild(lightbox);
  }

  let lessons = [];
  let activeIndex = 0;
  let lastFocused = null;

  const FALLBACK = [
    { n: 1, ext: 'jpg' },
    { n: 2, ext: 'jpg' },
    { n: 3, ext: 'jpg' },
    { n: 4, ext: 'jpg' },
    { n: 5, ext: 'png' },
    { n: 6, ext: 'jpg' },
    { n: 7, ext: 'jpg' },
    { n: 8, ext: 'jpg' },
  ].map(({ n, ext }, i) => ({
    image: `./images/lessons/lesson${n}.${ext}`,
    title: `Пример занятия ${i + 1}`,
    alt: `Пример учебного материала по биологии ${i + 1}`,
  }));

  const pad2 = (n) => String(n).padStart(2, '0');

  function renderGallery(items) {
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((item, index) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'lesson-tile';
      tile.setAttribute('aria-label', `Открыть ${item.title}`);
      tile.dataset.index = String(index);

      const num = document.createElement('span');
      num.className = 'lesson-tile-num';
      num.textContent = pad2(index + 1);

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt || item.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';

      tile.appendChild(num);
      tile.appendChild(img);
      tile.addEventListener('click', () => openLightbox(index));
      grid.appendChild(tile);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lessons.length) return;
    activeIndex = index;
    lastFocused = document.activeElement;
    setImage();
    lightbox.classList.add('is-open');
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('hidden', '');
    document.body.style.removeProperty('overflow');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function setImage() {
    const item = lessons[activeIndex];
    if (!item || !lbImage) return;
    lbImage.src = item.image;
    lbImage.alt = item.alt || item.title || '';
    if (lbCaption) lbCaption.textContent = `${pad2(activeIndex + 1)} · ${item.title || ''}`;
  }

  function step(delta) {
    if (!lessons.length) return;
    activeIndex = (activeIndex + delta + lessons.length) % lessons.length;
    setImage();
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    closeBtn && closeBtn.addEventListener('click', closeLightbox);
    prevBtn && prevBtn.addEventListener('click', () => step(-1));
    nextBtn && nextBtn.addEventListener('click', () => step(1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  fetch('./lessons.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('lessons fetch failed'))))
    .then((data) => {
      lessons = Array.isArray(data?.lessons) && data.lessons.length ? data.lessons : FALLBACK;
      renderGallery(lessons);
    })
    .catch(() => {
      lessons = FALLBACK;
      renderGallery(lessons);
    });
})();
