/**
 * Site behavior: header scroll state, mobile nav, active section highlight, scroll-reveal.
 */
(function () {
  const bodyLock = window.bodyLock;

  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-navigation');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- header scroll state ----- */
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- mobile nav toggle ----- */
  if (toggle && nav) {
    const LABEL_OPEN = 'Открыть меню';
    const LABEL_CLOSE = 'Закрыть меню';

    let navLocked = false;
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? LABEL_CLOSE : LABEL_OPEN);
      if (open && !navLocked) { bodyLock.acquire(); navLocked = true; }
      else if (!open && navLocked) { bodyLock.release(); navLocked = false; }
    };
    const closeNav = () => setOpen(false);

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ----- active section highlight ----- */
  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sectionMap.set(section, link);
  });

  if ('IntersectionObserver' in window && sectionMap.size) {
    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
        let best = null;
        let bestRatio = 0;
        ratios.forEach((ratio, section) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = section;
          }
        });
        if (!best) return;
        const activeLink = sectionMap.get(best);
        navLinks.forEach((l) => l.classList.toggle('is-active', l === activeLink));
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sectionMap.forEach((_link, section) => observer.observe(section));
  }

  /* ----- scroll reveal ----- */
  const revealTargets = document.querySelectorAll(
    '.section-marker, .section-head, .process-step, .fit-card, .specimen, .faq-list, .contact-card'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
})();
