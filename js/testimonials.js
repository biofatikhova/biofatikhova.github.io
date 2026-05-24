/**
 * Testimonials loader with collapse/expand.
 * JS owns visibility (hidden attribute on cards past VISIBLE).
 * On mobile (rail layout) collapse is disabled — all cards visible, toggle hidden.
 */
(function () {
  const grid = document.getElementById('testimonials-grid');
  const toggle = document.getElementById('testimonials-toggle-btn');
  const VISIBLE = 3;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const railMQ = window.matchMedia('(max-width: 700px)');

  if (!grid) return;

  let cards = [];
  let collapsed = true;

  function initials(name) {
    if (!name) return '·';
    const parts = String(name).trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }

  function buildCard(item) {
    const article = document.createElement('article');
    article.className = 'testimonial';

    const quote = document.createElement('span');
    quote.className = 'testimonial-quote';
    quote.setAttribute('aria-hidden', 'true');
    quote.textContent = '“';

    const text = document.createElement('p');
    text.className = 'testimonial-text';
    text.textContent = item.review || '';

    const foot = document.createElement('div');
    foot.className = 'testimonial-foot';

    const avatar = document.createElement('span');
    avatar.className = 'testimonial-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = initials(item.author);

    const meta = document.createElement('div');
    meta.className = 'testimonial-meta';

    const author = document.createElement('span');
    author.className = 'testimonial-author';
    author.textContent = item.author || '';

    const date = document.createElement('span');
    date.className = 'testimonial-date';
    date.textContent = item.date || '';

    meta.append(author, date);
    foot.append(avatar, meta);
    article.append(quote, text, foot);

    return article;
  }

  function applyVisibility() {
    const isRail = railMQ.matches;
    const hidePast = collapsed && !isRail && cards.length > VISIBLE;
    cards.forEach((card, i) => {
      if (hidePast && i >= VISIBLE) card.setAttribute('hidden', '');
      else card.removeAttribute('hidden');
    });
    grid.classList.toggle('is-collapsed', collapsed && !isRail);
    if (toggle) {
      const needToggle = !isRail && cards.length > VISIBLE;
      toggle.hidden = !needToggle;
      toggle.setAttribute('aria-expanded', String(!collapsed));
    }
  }

  function bindToggle() {
    if (!toggle || toggle.dataset.bound === '1') return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      collapsed = !collapsed;
      applyVisibility();
      if (collapsed) {
        const section = document.getElementById('testimonials');
        if (section) section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  function render(items) {
    grid.innerHTML = '';
    items.forEach((item) => grid.appendChild(buildCard(item)));
    cards = Array.from(grid.children);
    bindToggle();
    applyVisibility();
    grid.removeAttribute('aria-busy');
  }

  railMQ.addEventListener('change', applyVisibility);

  fetch('./testimonials.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('testimonials fetch failed'))))
    .then((data) => {
      const items = Array.isArray(data && data.testimonials) ? data.testimonials : [];
      if (!items.length) return;
      render(items);
    })
    .catch((err) => {
      console.warn('testimonials.json:', err.message);
    });
})();
