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

  let lessons = [];
  let activeIndex = 0;
  let lastFocused = null;
  let isLocked = false;

  const pad2 = (n) => String(n).padStart(2, '0');

  function renderGallery(items) {
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((item, index) => {
      if (!item || !item.image) return;
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'lesson-tile';
      tile.setAttribute('aria-label', `Открыть ${item.title || 'материал занятия'}`);
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

  function preloadNeighbors() {
    if (lessons.length < 2) return;
    [-1, 1].forEach((delta) => {
      const item = lessons[(activeIndex + delta + lessons.length) % lessons.length];
      if (item && item.image) {
        const img = new Image();
        img.src = item.image;
      }
    });
  }

  function focusableInDialog() {
    if (!lightbox) return [];
    return Array.from(lightbox.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'))
      .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const focusable = focusableInDialog();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function acquireLock() {
    if (isLocked) return;
    isLocked = true;
    if (window.__bodyLock) window.__bodyLock.acquire();
    else document.body.style.overflow = 'hidden';
  }
  function releaseLock() {
    if (!isLocked) return;
    isLocked = false;
    if (window.__bodyLock) window.__bodyLock.release();
    else document.body.style.removeProperty('overflow');
  }

  function openLightbox(index) {
    if (!lightbox || !lessons.length) return;
    activeIndex = index;
    lastFocused = document.activeElement;
    setImage();
    preloadNeighbors();
    lightbox.classList.add('is-open');
    lightbox.removeAttribute('hidden');
    acquireLock();
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('hidden', '');
    releaseLock();
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
    preloadNeighbors();
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
      else trapTab(e);
    });
  }

  /* SSR snapshot hydration: pick up lessons baked into HTML so SEO/JS-off users see them. */
  if (grid && grid.children.length) {
    lessons = Array.from(grid.children).map((tile) => {
      const img = tile.querySelector('img');
      return img ? { image: img.getAttribute('src'), title: img.getAttribute('data-title') || img.alt, alt: img.alt } : null;
    }).filter(Boolean);
    Array.from(grid.querySelectorAll('.lesson-tile')).forEach((tile, idx) => {
      tile.addEventListener('click', () => openLightbox(idx));
    });
  }

  fetch('./lessons.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('lessons fetch failed'))))
    .then((data) => {
      const items = Array.isArray(data && data.lessons) ? data.lessons : [];
      if (!items.length) return;
      lessons = items;
      renderGallery(lessons);
    })
    .catch((err) => {
      console.warn('lessons.json:', err.message);
    });
})();
