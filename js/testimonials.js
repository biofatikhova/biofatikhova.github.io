/**
 * Testimonials loader with collapse/expand.
 */
(function () {
  const grid = document.getElementById('testimonials-grid');
  const toggle = document.getElementById('testimonials-toggle-btn');
  const VISIBLE = 3;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!grid) return;

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

  function bindToggle(itemCount) {
    if (!toggle) return;
    if (itemCount <= VISIBLE) {
      toggle.hidden = true;
      return;
    }
    toggle.hidden = false;
    if (toggle.dataset.bound === '1') return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const collapsed = grid.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      if (collapsed) {
        const section = document.getElementById('testimonials');
        if (section) section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  function render(items) {
    grid.innerHTML = '';
    items.forEach((item) => grid.appendChild(buildCard(item)));
    bindToggle(items.length);
  }

  /* If HTML already shipped a baked snapshot, bind the toggle to that count first. */
  if (grid.children.length) bindToggle(grid.children.length);

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
