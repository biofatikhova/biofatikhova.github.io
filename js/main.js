/**
 * Main JavaScript file
 */

// DOM Elements
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = [...document.querySelectorAll('section[id]')].filter(section =>
  document.querySelector(`.nav-link[href="#${section.id}"]`)
);
const stickyTelegramCta = document.querySelector('.sticky-telegram-cta');
const contactSection = document.getElementById('contact');
const footer = document.querySelector('.footer');

function setMobileMenuOpen(isOpen) {
  if (!navMenu || !mobileToggle) return;

  navMenu.classList.toggle('active', isOpen);
  mobileToggle.classList.toggle('active', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  mobileToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('mobile-menu-open', isOpen);
  updateStickyTelegramCta();
}

function getHeaderHeight() {
  return header?.offsetHeight || 0;
}

function updateHeaderState() {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  const scrollY = window.pageYOffset;
  const headerHeight = getHeaderHeight();
  let activeSectionId = null;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    if (scrollY >= sectionTop) {
      activeSectionId = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeSectionId}`);
  });
}

function isElementNearViewport(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight - 40 && rect.bottom > 80;
}

function updateStickyTelegramCta() {
  if (!stickyTelegramCta) return;

  const shouldShow = window.innerWidth <= 768 &&
    window.scrollY > 80 &&
    !navMenu?.classList.contains('active') &&
    !document.body.classList.contains('lightbox-open') &&
    !isElementNearViewport(contactSection) &&
    !isElementNearViewport(footer);

  stickyTelegramCta.classList.toggle('is-visible', shouldShow);
  document.body.classList.toggle('has-sticky-cta', shouldShow);
}

// Mobile Menu Toggle
mobileToggle?.addEventListener('click', () => {
  setMobileMenuOpen(!navMenu?.classList.contains('active'));
});

// Close mobile menu when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
  if (!navMenu?.classList.contains('active')) return;

  if (!navMenu.contains(e.target) && !mobileToggle?.contains(e.target)) {
    setMobileMenuOpen(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
    setMobileMenuOpen(false);
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId.length <= 1) return;

    const targetElement = document.getElementById(targetId.slice(1));
    if (!targetElement) return;

    e.preventDefault();
    setMobileMenuOpen(false);

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getHeaderHeight();

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

// Update header and active nav link on scroll without doing layout work for every event.
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;

  window.requestAnimationFrame(() => {
    updateHeaderState();
    updateStickyTelegramCta();
    scrollTicking = false;
  });
  scrollTicking = true;
}, { passive: true });

window.addEventListener('resize', updateStickyTelegramCta, { passive: true });

// Initialize components when DOM is loaded
function initializePage() {
  updateHeaderState();
  updateStickyTelegramCta();

  // Import and initialize testimonials
  import('./testimonials.js').then(module => {
    module.initializeTestimonials();
  }).catch(err => console.error('Error loading testimonials module:', err));
}

document.addEventListener('lightbox:toggle', updateStickyTelegramCta);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
