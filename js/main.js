/**
 * Site behavior: header scroll state, mobile nav, active section highlight,
 * scroll-reveal, sticky CTA visibility.
 */
(function () {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-navigation');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const stickyCta = document.querySelector('.sticky-cta');
  const hero = document.getElementById('home');

  /* ----- header scroll state ----- */
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 16);

    if (stickyCta && hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      stickyCta.classList.toggle('is-visible', heroBottom < 60);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- mobile nav toggle ----- */
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.removeProperty('overflow');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-50% 0px -45% 0px', threshold: 0 }
    );
    sectionMap.forEach((_link, section) => observer.observe(section));
  }

  /* ----- scroll reveal ----- */
  const revealTargets = document.querySelectorAll(
    '.section-marker, .section-head, .process-step, .about-card, .fit-card, .specimen, .faq-list, .contact-card'
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
